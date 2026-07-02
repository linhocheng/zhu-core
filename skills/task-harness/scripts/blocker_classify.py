#!/usr/bin/env python3
"""
Task Harness · blocker_key 確定性分類器（破綻四修復）

六值枚舉為 v1 原定義（2026-06-24）：
  TEST_FAIL / TYPE_ERROR / IMPORT_ERR / LOGIC_ERR / ENV_ERR / UNKNOWN

用法：
  python3 blocker_classify.py --classify <log檔>      # 印出 blocker_key
  python3 blocker_classify.py --check-cb <scratchpad> # 印出 CB2/CB3 判定
  python3 blocker_classify.py --self-test             # 跑全部 assert
"""
import json
import re
import sys

KEYS = ["TEST_FAIL", "TYPE_ERROR", "IMPORT_ERR", "LOGIC_ERR", "ENV_ERR", "UNKNOWN"]

# 順序即優先級：越上面越先匹配（根因通常比表象更具體）
PATTERNS: list[tuple[str, list[str]]] = [
    ("IMPORT_ERR", [
        r"cannot find module",
        r"module not found",
        r"modulenotfounderror",
        r"importerror",
        r"err_module_not_found",
        r"failed to resolve import",
        r"no such file or directory.*\.(ts|tsx|js|jsx|py|mjs)",
    ]),
    ("TYPE_ERROR", [
        r"\bts\d{4,5}\b",                      # TS2345 等 tsc 錯誤碼
        r"type error",
        r"is not assignable to",
        r"property .* does not exist on type",
        r"argument of type .* is not assignable",
        r"型別",
    ]),
    ("ENV_ERR", [
        r"\b401\b|\b403\b|unauthorized|forbidden|permission denied|eacces",
        r"api key|invalid.?key|secret",
        r"econnrefused|etimedout|enotfound|socket hang up|fetch failed",
        r"environment variable|env var|missing .*env",
        r"command not found",
        r"quota|rate.?limit|\b429\b",
    ]),
    ("LOGIC_ERR", [
        r"rangeerror|maximum call stack|stack overflow",
        r"\bnan\b",
        r"off.?by.?one",
        r"indexerror|keyerror|out of range|out of bounds",
        r"undefined is not a function|cannot read propert",
        r"typeerror",   # runtime TypeError（JS/Python）是邏輯錯；編譯期型別訊號已被上面 TYPE_ERROR 攔走
        r"infinite loop",
    ]),
    ("TEST_FAIL", [
        r"assertionerror|assert(ion)? failed",
        r"\bfail(ed|ing)?\b.*test|test.*\bfail(ed|ing)?\b",
        r"✕|✗",
        r"expected .* (but )?(received|got|to be|to equal)",
        r"\d+ (test(s)?|spec(s)?) failed",
        r"eslint.*error|\d+ error(s)?\b.*\d+ warning",
    ]),
]


def classify(text: str) -> str:
    """把錯誤文字確定性分類到六值枚舉，對不上落 UNKNOWN。"""
    lowered = text.lower()
    for key, pats in PATTERNS:
        for p in pats:
            if re.search(p, lowered):
                return key
    return "UNKNOWN"


def cb2_should_trip(last3_keys: list[str]) -> bool:
    """連續三輪同一個 blocker_key → 熔斷。"""
    return len(last3_keys) == 3 and len(set(last3_keys)) == 1


def cb3_should_trip(iter_count: int, mid_checkin_done: bool) -> bool:
    """iter >= 5 且尚未 mid-checkin → 強制浮出。"""
    return iter_count >= 5 and not mid_checkin_done


def check_cb(scratchpad_path: str) -> dict:
    with open(scratchpad_path, encoding="utf-8") as f:
        sp = json.load(f)
    history = sp.get("blocker_history", [])
    return {
        "cb2_trip": cb2_should_trip(history[-3:]),
        "cb2_last3": history[-3:],
        "cb3_trip": cb3_should_trip(sp.get("iter", 0), sp.get("mid_checkin_done", False)),
        "iter": sp.get("iter", 0),
        "mid_checkin_done": sp.get("mid_checkin_done", False),
    }


def self_test() -> None:
    # classify：每個枚舉至少兩個代表樣本
    assert classify("Error: Cannot find module '@/lib/firestore'") == "IMPORT_ERR"
    assert classify("ModuleNotFoundError: No module named 'requests'") == "IMPORT_ERR"
    assert classify("error TS2345: Argument of type 'string' is not assignable") == "TYPE_ERROR"
    assert classify("TypeError: x.map is not assignable to type Foo") == "TYPE_ERROR"
    assert classify("HTTP 401 Unauthorized: invalid api key") == "ENV_ERR"
    assert classify("connect ECONNREFUSED 127.0.0.1:3000") == "ENV_ERR"
    assert classify("gcloud: command not found") == "ENV_ERR"
    assert classify("RangeError: Maximum call stack size exceeded") == "LOGIC_ERR"
    assert classify("TypeError: Cannot read properties of undefined (reading 'id')") == "LOGIC_ERR"
    assert classify("AssertionError: expected 3 to equal 5") == "TEST_FAIL"
    assert classify("Tests: 2 failed, 10 passed") == "TEST_FAIL"
    assert classify("✕ renders login form") == "TEST_FAIL"
    assert classify("完全無法歸類的神祕輸出 zzz") == "UNKNOWN"
    assert classify("") == "UNKNOWN"
    # 優先級：import 錯根因蓋過 test 表象
    assert classify("Tests failed: Cannot find module './utils'") == "IMPORT_ERR"

    # cb2
    assert cb2_should_trip(["TEST_FAIL", "TEST_FAIL", "TEST_FAIL"]) is True
    assert cb2_should_trip(["UNKNOWN", "UNKNOWN", "UNKNOWN"]) is True   # UNKNOWN 也參與計數
    assert cb2_should_trip(["TEST_FAIL", "TYPE_ERROR", "TEST_FAIL"]) is False
    assert cb2_should_trip(["TEST_FAIL", "TEST_FAIL"]) is False          # 不足三筆不熔斷
    assert cb2_should_trip([]) is False

    # cb3
    assert cb3_should_trip(5, False) is True
    assert cb3_should_trip(7, False) is True
    assert cb3_should_trip(5, True) is False
    assert cb3_should_trip(4, False) is False

    print("self-test: ALL PASS")


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == "--self-test":
        self_test()
    elif cmd == "--classify":
        with open(sys.argv[2], encoding="utf-8") as f:
            print(classify(f.read()))
    elif cmd == "--check-cb":
        print(json.dumps(check_cb(sys.argv[2]), ensure_ascii=False, indent=2))
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
