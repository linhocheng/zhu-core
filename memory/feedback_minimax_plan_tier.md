---
name: MiniMax 海外版 plan tier ≠ 餘額（2061 vs 2053 區分）
description: 海外版 product access 跟 credit 是兩條獨立權限軸；2061 plan not support 儲值救不了，2053 才是儲值能解
type: feedback
originSessionId: 32b08dfd-50e3-4004-bca4-32e3494f2ef9
---
MiniMax 海外版（platform.minimax.io）的 plan tier 控制「能不能用某個 product / model」，credit 控制「還能用多少」。兩者獨立，錯誤碼處理路徑完全不同。

**Why:** 2026-04-28 ailive 即時語音斷音排雷時連續踩兩段：
- 第一把 key（GCP secret 裡的）噴 `2053 insufficient credit` → 餘額耗盡
- Adam 直接儲值想救 → 撥號還是 2053（儲值的帳號跟 key 對不上）
- 換新生 key `sk-cp-...` → curl 直打回 `2061 your current token plan not support model, speech-02-turbo`，連 speech-01-turbo 也 2061，**儲值無關**——這把 key 的 sub-workspace 完全沒開 TTS product
- 第三把 `sk-api-...` 才通

「儲值 = 解決問題」是錯誤映射。儲值只解 credit，不解 plan / product / region 任何一條。錯誤碼指向 plan 時，儲值是白花錢。

**How to apply:**
- 看到 MiniMax error 先讀 `status_code`：
  - `2053 insufficient credit` → 儲值能解
  - `2061 plan not support` → 帳號／sub-workspace 沒開 product，要從 console 開通或換有權限的帳號發新 key，**儲值無效**
- 灌進 GCP secret 前永遠 `curl /v1/t2a_v2` 驗 `base_resp.status_code == 0`（呼應「動手前驗證 secret 有效」那條 feedback）
- key 前綴觀察：`sk-cp-` 踩 2061、`sk-api-` 通——經驗觀察非官方文件，不當真理
- 排雷時不要先儲值救火，先 curl 拿錯誤碼判路徑
