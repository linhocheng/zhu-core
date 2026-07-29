---
name: bridge-cli-auto-memory-contamination
description: "zhu-bridge 的 claude CLI 自動記憶把 Adam 客戶資料注入所有過橋流量——LLM 引擎層不是無狀態的,假設要驗證"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0eba6e0e-482e-4eda-9a46-516fe92e64b7
---

**zhu-bridge(claude CLI)曾因 auto-memory 成為跨平台污染源**:CLI 服務 A.Two 對話時自己蒸餾了 182 個記憶檔(阿利博士 IP 架構等客戶內幕),之後**每次過橋呼叫**(任何角色/用戶/平台)都可能被注入。2026-07-29 破案:平台端真相鏈證明注入塊全零、prompt 乾淨,洩漏在引擎層。

**Why**:大家默認「LLM 呼叫是無狀態的」——直連 API 是,但 claude CLI 不是:它有 per-cwd 的 auto-memory + session 累積。省錢方案(Max 月費 bridge)引入了 API 沒有的狀態性。

**心態**:排查洩漏時,「我們送了什麼」(prompt)和「模型知道什麼」(引擎層)是兩個獨立審計面;prompt 乾淨不等於回覆乾淨。

**How to apply**:
- 修法:bridge `.env` 加 `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`(官方 env,保 OAuth)+ cwd `.claude/settings.json` 寫 `"autoMemoryEnabled": false` 雙保險;污染備份在 VM `~/bridge-memory-backup-20260729.tar.gz`
- 任何新的 claude CLI headless 服務(bridge/worker),部署第一天就關 auto-memory——除非「累積記憶」是明確要的 feature
- `--bare` 不可用於 Max bridge(會禁 OAuth 只認 API key)
- 驗證信號:穿透題 N 發零命中 + memory 目錄零新檔 + 進程 environ 有旗標

**觸發信號**:模型回覆出現「prompt 裡沒有的具體事實」且跨獨立呼叫重現;新 bridge/CLI 服務上線;debug 洩漏時 prompt 各組件都排除完。

相關:[[glue-layer-errors-lie]](錯誤指向A真因在B)、模稜兩可信號天條。
