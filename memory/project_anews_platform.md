---
name: ANEWS 平台進度（2026-05-22c 文章平台 + 後台大改版）
description: 自動化長文編排系統，Next.js + Vercel + Cloud Tasks + Firestore + bridge LLM
type: project
originSessionId: 7a81deda-87fd-44e2-9efe-cde4e97f6a39
---
ANEWS 平台在 `~/.ailive/anews-platform/`，prod：https://anews-platform.vercel.app

**Why:** Adam 要建獨立長文生成平台，5 篇文章（1 主 + 4 子），自動從研究→藍圖→段落→QA→發布。

**How to apply:** 進 ANEWS 相關工作先讀 `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`，再看最新 git log。

## S3 完成（2026-05-22）
- section-write/qa/stitch/polish/coherence/image/export 全通
- Pipeline pending → done 全通

## 文章平台 + 後台大改版（2026-05-22c）
- 前台三頁面：首頁（前衛雜誌風）/ 期號頁 / 文章閱讀頁
- 後台：Claude design、大白話狀態、Pipeline 進度條、段落色塊
- 功能：刪除（cascade）、一期鎖（API 層）、校對入口、Kick 重啟、角色設定頁
- 角色設定：4 個 role prompt 存 Firestore（/dashboard/settings），workers 讀取

## 未解技術債
1. QA 過嚴：word_count 80% + no_unsupported_claims → 降到 60%，移除後者
2. stitch URL 換行根源未修（export 有防護）
3. 圖片生成：SVG placeholder，真實方向未決

## 當前卡死期刊
- **AI 下的設計思考**（issueId: F9u8lHZCief2bTN6ztAO）：sections blueprint_ready 卡死
- 解法：https://anews-platform.vercel.app/dashboard/F9u8lHZCief2bTN6ztAO 按「▶ 繼續生成」

## 下一步
1. 測試 Kick 按鈕能否重啟卡死 pipeline
2. 調 section-qa 嚴格度（`app/api/workers/section-qa/route.ts`）
3. 決定圖片生成方向
