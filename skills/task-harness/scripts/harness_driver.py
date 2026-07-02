#!/usr/bin/env python3
"""
Task Harness · driver（控制權反轉，v2.2）

程式持有迴圈，模型只負責每輪的判斷與生成——「跳過 REFLECT」「忘記 CB」
在結構上不可能，不再靠 SOP 順從度。

  driver 跑測試 → 確定性分類 blocker → 確定性判 CB/政策 → 叫模型改碼 → 再跑測試
  exit 0 = done（現實是唯一裁判）；模型呼叫走 claude CLI（Max 訂閱，不燒 API key）

用法：
  python3 harness_driver.py --config task.json        # 正式跑
  python3 harness_driver.py --config task.json --mock "shell cmd"   # 用 shell 指令替代模型（測迴圈用）
  python3 harness_driver.py --self-test

task.json 範例：
{
  "goal": "使 pytest 全綠",
  "done_cmd": "python3 -m pytest -q",
  "workdir": "/path/to/repo",
  "max_iters": 6,
  "allowed_tools": "Read,Edit,Write,Grep,Glob",
  "policy": {
    "auto_continue_past_checkin": false,
    "max_diff_lines": 400,
    "stop_on_blockers": []
  }
}

沙箱邊界（紅線，程式強制）：
  - workdir 必須是 git repo（diff 可追蹤、可回退）
  - 模型只拿到編輯類工具，測試由 driver 跑——模型碰不到 Bash
  - 每輪 git diff 行數超過 max_diff_lines → SAFETY 熔斷（保留現場，不自動 revert）
  - CB1 = Ctrl-C / SIGTERM → 走熔斷接手協議（HARNESS_STATE.md 落地）
"""
import json
import os
import signal
import subprocess
import sys
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)
from blocker_classify import classify, cb2_should_trip, cb3_should_trip  # noqa: E402

SCRATCHPAD = ".task_scratchpad.json"


# ── 純函數（可自測）────────────────────────────────────────────────────────────

def build_prompt(goal: str, test_log: str, sp: dict) -> str:
    findings = sp.get("findings", "")
    return f"""你是 Task Harness 的執劍者，在 driver 迴圈的第 {sp.get('iter', 0) + 1} 輪。
迴圈控制、測試執行、CB 判斷都由外部程式負責——你只做這一輪的修改。

目標（goal_condition）：{goal}

上一輪測試輸出（tail）：
{test_log}

累積發現：{findings or '（第一輪，無）'}

規則：
1. 只改必要的地方，每輪聚焦一個問題
2. 不要跑測試（driver 會跑），不要動 .task_scratchpad*.json
3. 改完後，最後輸出一行 FINDINGS: <一句話：這輪你發現/修了什麼>，driver 會存進 scratchpad"""


def extract_findings(model_output: str) -> str:
    for line in reversed(model_output.strip().splitlines()):
        if line.strip().startswith("FINDINGS:"):
            return line.strip()[len("FINDINGS:"):].strip()[:300]
    return ""


def diff_lines(numstat_output: str) -> int:
    """git diff --numstat 總變更行數（added+deleted；binary 的 '-' 當 0）。"""
    total = 0
    for line in numstat_output.strip().splitlines():
        parts = line.split("\t")
        if len(parts) >= 2:
            for p in parts[:2]:
                if p.isdigit():
                    total += int(p)
    return total


def decide(sp: dict, policy: dict, blocker_key: str) -> str:
    """確定性決策：CONTINUE / CB2_TRIP / CB3_CHECKIN / POLICY_STOP。"""
    history = sp.get("blocker_history", [])
    if cb2_should_trip(history[-3:]):
        return "CB2_TRIP"
    if blocker_key in policy.get("stop_on_blockers", []):
        return "POLICY_STOP"
    if cb3_should_trip(sp.get("iter", 0), sp.get("mid_checkin_done", False)):
        if policy.get("auto_continue_past_checkin", False):
            return "CB3_AUTO_CONTINUE"   # 預授權：記錄後放行
        return "CB3_CHECKIN"
    return "CONTINUE"


def harness_state_md(sp: dict, reason: str) -> str:
    """熔斷接手協議第 1 步：五段式 HARNESS_STATE.md 內容。"""
    return f"""# HARNESS_STATE — 熔斷交棒

## 1. Goal
{sp.get('goal', '')}

## 2. 已完成
{json.dumps(sp.get('done', []), ensure_ascii=False)}
findings: {sp.get('findings', '')}

## 3. 熔斷原因
{reason}
blocker 序列：{json.dumps(sp.get('blocker_history', []), ensure_ascii=False)}

## 4. 未完成
iter {sp.get('iter', 0)} / 測試尚未全綠。最後 log 見 .task_scratchpad_test.log

## 5. 下一個接手的第一步
讀 .task_scratchpad.json 的 findings 與最後一輪 log，從最後一個 blocker（{sp.get('blocker_history', ['?'])[-1] if sp.get('blocker_history') else '?'}）繼續，
不重跑已完成的部分。driver 重啟：python3 ~/.ailive/zhu-core/skills/task-harness/scripts/harness_driver.py --config <原 config>
"""


# ── 迴圈本體 ──────────────────────────────────────────────────────────────────

def _run(cmd: str, cwd: str, timeout: int = 600) -> tuple[int, str]:
    try:
        r = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True, timeout=timeout)
        return r.returncode, (r.stdout + r.stderr)[-4000:]
    except subprocess.TimeoutExpired:
        return 124, f"TIMEOUT after {timeout}s"


def run_driver(config: dict, mock_cmd: str | None = None) -> str:
    workdir = os.path.abspath(config["workdir"])
    goal = config["goal"]
    done_cmd = config["done_cmd"]
    max_iters = config.get("max_iters", 10)
    policy = config.get("policy", {})
    max_diff = policy.get("max_diff_lines", 400)
    allowed_tools = config.get("allowed_tools", "Read,Edit,Write,Grep,Glob")

    # 沙箱紅線：必須是 git repo
    rc, _ = _run("git rev-parse --is-inside-work-tree", workdir, 10)
    if rc != 0:
        print("REFUSE: workdir 不是 git repo（diff 不可追蹤 = 不准自主跑）")
        return "REFUSED"
    if "Bash" in allowed_tools:
        print("REFUSE: allowed_tools 含 Bash——測試由 driver 跑，模型不拿 shell")
        return "REFUSED"

    sp_path = os.path.join(workdir, SCRATCHPAD)
    sp = {"goal": goal, "iter": 0, "sub_goals": [], "plan": "", "done": [], "findings": "",
          "blockers": "", "blocker_key": "UNKNOWN", "blocker_history": [],
          "mid_checkin_done": False, "confidence": "low", "log": [], "outcome": "unknown"}

    outcome = "unknown"

    def save():
        with open(sp_path, "w", encoding="utf-8") as f:
            json.dump(sp, f, ensure_ascii=False, indent=1)

    def trip(reason: str, oc: str):
        nonlocal outcome
        outcome = oc
        sp["outcome"] = oc
        save()
        with open(os.path.join(workdir, "HARNESS_STATE.md"), "w", encoding="utf-8") as f:
            f.write(harness_state_md(sp, reason))
        print(f"TRIP[{oc}]: {reason}")
        print(f"HARNESS_STATE.md 已落地：{workdir}")

    def on_signal(signum, frame):
        trip(f"CB1 顯式中止（signal {signum}）", "cb1_trip")
        sys.exit(130)

    signal.signal(signal.SIGINT, on_signal)
    signal.signal(signal.SIGTERM, on_signal)
    save()

    for i in range(1, max_iters + 1):
        rc, log = _run(done_cmd, workdir)
        with open(os.path.join(workdir, ".task_scratchpad_test.log"), "w", encoding="utf-8") as f:
            f.write(log)
        if rc == 0:
            sp["outcome"] = outcome = "completed"
            sp["confidence"] = "high"
            save()
            print(f"DONE at iter {sp['iter']}：done_cmd exit 0（現實裁判）")
            break

        key = classify(log)
        sp["blocker_key"] = key
        sp["blocker_history"].append(key)
        verdict = decide(sp, policy, key)
        print(f"iter {i}: done_cmd exit {rc} → blocker={key} → {verdict}")

        if verdict == "CB2_TRIP":
            trip(f"CB2：連續三輪 {key}", "cb2_trip"); break
        if verdict == "POLICY_STOP":
            trip(f"政策熔斷：blocker {key} 在 stop_on_blockers", "policy_trip"); break
        if verdict == "CB3_CHECKIN":
            trip("CB3：iter>=5 未 mid-checkin，政策未預授權續跑", "cb3_trip"); break
        if verdict == "CB3_AUTO_CONTINUE":
            sp["mid_checkin_done"] = True
            sp["log"].append(f"iter {i}: CB3 由政策預授權放行")

        head_before, _ = _run("git rev-parse HEAD", workdir, 10)

        prompt = build_prompt(goal, log, sp)
        if mock_cmd is not None:
            mrc, mout = _run(mock_cmd, workdir, 120)
        else:
            mrc, mout = _run(
                f"claude -p {json.dumps(prompt)} --allowedTools {json.dumps(allowed_tools)} --max-turns 20",
                workdir, timeout=900)
        if mrc != 0:
            sp["log"].append(f"iter {i}: 模型呼叫失敗 rc={mrc}")
            trip(f"模型呼叫失敗（rc={mrc}）：{mout[-200:]}", "model_err"); break

        # 沙箱：diff 上限（含 untracked 不算，只看 tracked 變更）
        _, numstat = _run("git diff --numstat", workdir, 10)
        changed = diff_lines(numstat)
        if changed > max_diff:
            trip(f"SAFETY：本輪 diff {changed} 行 > 上限 {max_diff}（現場保留，人工檢視）", "safety_trip"); break

        finding = extract_findings(mout)
        if finding:
            sp["findings"] = (sp["findings"] + f"\niter {i}: {finding}").strip()
        sp["iter"] = i
        sp["log"].append(f"iter {i}: diff {changed} 行, blocker {key}")
        save()
    else:
        trip(f"達 max_iters={max_iters} 未完成", "max_iters_trip")

    # 收尾：歸檔 + 餵 ledger
    save()
    archive = os.path.join(workdir, f".task_scratchpad_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    os.replace(sp_path, archive)
    _run(f"python3 {os.path.join(SCRIPT_DIR, 'harness_ledger.py')} --collect .", workdir, 30)
    print(f"outcome={outcome}，scratchpad 歸檔 → {os.path.basename(archive)}，已餵 ledger")
    return outcome


# ── 自測 ──────────────────────────────────────────────────────────────────────

def self_test() -> None:
    # decide()
    base = {"iter": 0, "blocker_history": [], "mid_checkin_done": False}
    assert decide(base, {}, "TEST_FAIL") == "CONTINUE"
    assert decide({**base, "blocker_history": ["X", "X", "X"]}, {}, "X") == "CB2_TRIP"
    assert decide({**base, "iter": 5}, {}, "TEST_FAIL") == "CB3_CHECKIN"
    assert decide({**base, "iter": 5}, {"auto_continue_past_checkin": True}, "TEST_FAIL") == "CB3_AUTO_CONTINUE"
    assert decide({**base, "iter": 5, "mid_checkin_done": True}, {}, "TEST_FAIL") == "CONTINUE"
    assert decide(base, {"stop_on_blockers": ["UNKNOWN"]}, "UNKNOWN") == "POLICY_STOP"
    # CB2 優先於 CB3（同輪同時滿足時先報卡死）
    assert decide({"iter": 5, "blocker_history": ["A", "A", "A"], "mid_checkin_done": False}, {}, "A") == "CB2_TRIP"

    # diff_lines()
    assert diff_lines("10\t5\tfoo.py\n3\t0\tbar.ts\n") == 18
    assert diff_lines("-\t-\timg.png\n") == 0
    assert diff_lines("") == 0

    # extract_findings()
    assert extract_findings("blah\nFINDINGS: 修了 off-by-one\n") == "修了 off-by-one"
    assert extract_findings("no marker here") == ""

    # harness_state_md() 五段齊備
    md = harness_state_md({"goal": "g", "done": [], "findings": "", "blocker_history": ["X"], "iter": 2}, "CB2")
    for sec in ["## 1. Goal", "## 2. 已完成", "## 3. 熔斷原因", "## 4. 未完成", "## 5. 下一個接手的第一步"]:
        assert sec in md, sec

    print("self-test: ALL PASS")


def main() -> None:
    args = sys.argv[1:]
    if not args:
        print(__doc__); sys.exit(1)
    if args[0] == "--self-test":
        self_test(); return
    if args[0] == "--config":
        with open(args[1], encoding="utf-8") as f:
            config = json.load(f)
        mock = None
        if "--mock" in args:
            mock = args[args.index("--mock") + 1]
        outcome = run_driver(config, mock_cmd=mock)
        sys.exit(0 if outcome == "completed" else 1)
    print(__doc__); sys.exit(1)


if __name__ == "__main__":
    main()
