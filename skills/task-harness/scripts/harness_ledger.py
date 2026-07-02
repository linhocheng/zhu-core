#!/usr/bin/env python3
"""
Task Harness · ledger（新陳代謝機制）

掃描 .task_scratchpad_*.json 歸檔檔，聚合成 ledger.jsonl。
harness 的執行紀錄不再是死資料——blocker 分佈、平均輪數、卡死模式
都從這裡讀，作為「要不要開 harness」與 SOP 迭代的依據。

用法：
  python3 harness_ledger.py --collect <dir> [<dir>...]  # 掃目錄，append 進 ledger.jsonl（去重）
  python3 harness_ledger.py --stats                     # 印統計報告
  python3 harness_ledger.py --self-test                 # 跑全部 assert
"""
import glob
import hashlib
import json
import os
import sys
from datetime import datetime, timezone

LEDGER_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ledger.jsonl")


def _entry_key(source_name: str, content: str) -> str:
    return hashlib.sha256((source_name + content).encode()).hexdigest()[:16]


def parse_scratchpad(path: str) -> dict | None:
    """把一份歸檔 scratchpad 轉成 ledger entry；壞 JSON 回 None（不炸整批）。"""
    try:
        with open(path, encoding="utf-8") as f:
            raw = f.read()
        sp = json.loads(raw)
        if not isinstance(sp, dict):
            return None
    except (json.JSONDecodeError, OSError):
        return None
    mtime = datetime.fromtimestamp(os.path.getmtime(path), tz=timezone.utc)
    history = sp.get("blocker_history", [])
    return {
        "key": _entry_key(os.path.basename(path), raw),
        "ts": mtime.isoformat(),
        "source": os.path.abspath(path),
        "goal": (sp.get("goal") or "")[:200],
        "iters": sp.get("iter", 0),
        "blocker_history": history,
        "final_blocker": history[-1] if history else None,
        "done_count": len(sp.get("done", [])),
        "sub_goal_count": len(sp.get("sub_goals", [])),
        "confidence": sp.get("confidence", "unknown"),
        "outcome": sp.get("outcome", "unknown"),  # completed / cb2_trip / cb3_trip / safety_trip / unknown
    }


def load_ledger(ledger_path: str = LEDGER_PATH) -> list[dict]:
    if not os.path.exists(ledger_path):
        return []
    entries = []
    with open(ledger_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    entries.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    return entries


def collect(dirs: list[str], ledger_path: str = LEDGER_PATH) -> dict:
    """掃目錄找 .task_scratchpad_*.json，去重後 append 進 ledger。"""
    existing = {e["key"] for e in load_ledger(ledger_path) if "key" in e}
    found, added, skipped_dup, skipped_bad = 0, 0, 0, 0
    new_entries = []
    for d in dirs:
        for path in sorted(glob.glob(os.path.join(d, ".task_scratchpad_*.json"))):
            found += 1
            entry = parse_scratchpad(path)
            if entry is None:
                skipped_bad += 1
                continue
            if entry["key"] in existing:
                skipped_dup += 1
                continue
            existing.add(entry["key"])
            new_entries.append(entry)
            added += 1
    if new_entries:
        os.makedirs(os.path.dirname(ledger_path), exist_ok=True)
        with open(ledger_path, "a", encoding="utf-8") as f:
            for e in new_entries:
                f.write(json.dumps(e, ensure_ascii=False) + "\n")
    return {"found": found, "added": added, "dup": skipped_dup, "bad": skipped_bad}


def stats(ledger_path: str = LEDGER_PATH) -> dict:
    entries = load_ledger(ledger_path)
    if not entries:
        return {"total": 0}
    blocker_freq: dict[str, int] = {}
    outcome_freq: dict[str, int] = {}
    for e in entries:
        for b in e.get("blocker_history", []):
            blocker_freq[b] = blocker_freq.get(b, 0) + 1
        oc = e.get("outcome", "unknown")
        outcome_freq[oc] = outcome_freq.get(oc, 0) + 1
    iters = [e.get("iters", 0) for e in entries]
    return {
        "total": len(entries),
        "avg_iters": round(sum(iters) / len(iters), 2),
        "max_iters": max(iters),
        "blocker_freq": dict(sorted(blocker_freq.items(), key=lambda x: -x[1])),
        "outcome_freq": outcome_freq,
    }


def self_test() -> None:
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        ledger = os.path.join(tmp, "ledger.jsonl")
        # 一份正常 scratchpad
        sp1 = os.path.join(tmp, ".task_scratchpad_20260702_010101.json")
        with open(sp1, "w") as f:
            json.dump({"goal": "fix tests", "iter": 4, "sub_goals": ["a", "b"], "done": ["a"],
                       "blocker_history": ["TEST_FAIL", "TEST_FAIL", "TYPE_ERROR"],
                       "confidence": "medium", "outcome": "completed"}, f)
        # 一份壞 JSON
        sp2 = os.path.join(tmp, ".task_scratchpad_20260702_020202.json")
        with open(sp2, "w") as f:
            f.write("{broken json")
        # 一份非 dict
        sp3 = os.path.join(tmp, ".task_scratchpad_20260702_030303.json")
        with open(sp3, "w") as f:
            f.write('["not", "a", "dict"]')

        r = collect([tmp], ledger)
        assert r["found"] == 3 and r["added"] == 1 and r["bad"] == 2, r
        # 再掃一次 → 全部去重
        r2 = collect([tmp], ledger)
        assert r2["added"] == 0 and r2["dup"] == 1, r2

        s = stats(ledger)
        assert s["total"] == 1
        assert s["avg_iters"] == 4.0
        assert s["blocker_freq"]["TEST_FAIL"] == 2
        assert s["outcome_freq"]["completed"] == 1

        e = load_ledger(ledger)[0]
        assert e["final_blocker"] == "TYPE_ERROR"
        assert e["done_count"] == 1 and e["sub_goal_count"] == 2

        # 空 ledger stats 不炸
        assert stats(os.path.join(tmp, "nope.jsonl")) == {"total": 0}
    print("self-test: ALL PASS")


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == "--self-test":
        self_test()
    elif cmd == "--collect":
        dirs = sys.argv[2:] or ["."]
        print(json.dumps(collect(dirs), ensure_ascii=False))
    elif cmd == "--stats":
        print(json.dumps(stats(), ensure_ascii=False, indent=2))
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
