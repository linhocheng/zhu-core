---
name: raw-query-not-ui-truth
description: debug 直撈 DB 的結果不能當「UI 會顯示什麼」回報——業務層過濾（archived/screened/scope）才是產品真相
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0eba6e0e-482e-4eda-9a46-516fe92e64b7
---

**規則**：回報「用戶會看到什麼」之前，必須走跟 UI 同一條讀路徑（產品 API / 帶過濾的 lib 函數）。debug script 直撈原始層查到的東西，只能以「原始層資料」的名義呈現，不能翻譯成 UI 行為。

**Why**：原始層看得到的，業務層不一定放行。2026-07-24 UDN：我用 raw Firestore query 列角色（含 archived 的 Alex），回報 Adam「四位角色的聲音都能選」；實際 `/api/characters` 過濾 archived 後只有三位。我的錯誤回報變成 Adam 的假警報（「Alex 移除了還在，是 bug？」），查完發現 bug 是我的話不是系統。

**心態**：debug 求快直撈沒有錯，錯在把「我查到的」無標籤地說成「你會看到的」。兩個層級之間永遠隔著一層業務規則。

**How to apply**：
- 回報 UI 行為 → curl 產品 API（同 auth、同過濾）再說
- debug script 輸出自帶層級聲明（「原始層，含已封存」）
- 聽到自己說「都能選/都會顯示/都在」→ 問：這是哪一層的「都」？

**觸發信號**：正要把 DB query 結果寫進給 Adam 的回報；Adam 拿我上一句回報來問「是不是 bug」。

家族：[[memory-can-lie]]、[[diagnosis-verify-before-write]]——現場層級錯位版。

- 驗證+1:2026-08-02 第2場 — 「上輪表現」驗證照抄 UI 同一條聚合路徑（最新 batch/跳錯誤行/按 promptId）
