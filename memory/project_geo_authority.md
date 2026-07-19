---
name: project-geo-authority
description: GEO 權威收錄代操平台——AI 搜尋可見度監測＋月報＋內容管線；Adam×WAITIN 雙人協作（白皮書 v1.0）
metadata: 
  node_type: memory
  type: project
  originSessionId: 0df5b3f0-a1f0-45bc-a412-242728821924
---

GEO Authority＝AI 搜尋可見度（GEO）代操平台。repo `~/.ailive/geo-authority`（GitHub private：linhocheng/geo-authority）；後台 https://geo-admin-950655569084.asia-east1.run.app；GCP project geo-authority-2026。

- **月循環自動駕駛**：週一 09:00 週輪監測（geo-weekly-monitor）＋每月 1 號月報 cron（geo-monthly-report）＋作戰計畫自動排產草稿＋通知層。四引擎（Claude/Gemini/ChatGPT/Perplexity）全開且 key 有效（2026-07-19 三面驗過——協作者以為要「補 key」，實際早已名副其實）。
- **商品差異點**：月報全確定性聚合零 LLM（「沒有任何 AI 生成的數字成分」）；設計＝黃框黑面板後台＋亮色信紙月報（2026-07-18 設計稿落地 v2.0）。
- **雙人協作（2026-07-18 起）**：WAITIN（Waitin Chen，GitHub baobaoagi-cpu，語氣靈/tone-spirit 租戶主）；分工白皮書＝repo `docs/COLLAB_WHITEPAPER.md` v1.0——領地邊界＝檔案邊界（`reportCopy.ts`/`contentPrompt.ts`＝WAITIN；量測/任務/部署/稽核＝Adam；`collections.ts`＝憲法區雙簽）。他的名字是 WAITIN 不是 Wayne。
- **審 WAITIN PR 的 Adam 側不變式**：75-150 瞄準帶 ⊆ 60-220 稽核帶、法規紅線、無網址、`# 標題` 首行（清單在 PR #1 留言）。本機開發只准 emulator（`dev/README.md`）。
- 部署唯一路徑 `./deploy.sh`；地基帳本 `FOUNDATION.md`（lastword 盤到期）；版本號 2026-07-19 曾岔流（平行 session 用 v1.8.x 接在 v2.2.x 後），之後從 v2.3 接續。

關聯：[[feedback-parallel-sessions-same-repo]]、[[feedback-memory-can-lie]]、[[feedback-deterministic-work-belongs-in-code]]
