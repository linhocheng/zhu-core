---
name: 意川_WEB Vercel 部署記錄
description: 意川網站前台靜態部署在 Vercel，臨時性，可能撤下
type: project
originSessionId: 43565858-4ac2-46bc-aa67-0f2bfd01d1a6
---
意川_WEB 靜態前台部署於 Vercel（2026-06-27）。

- **URL**：https://web-tawny-six-67.vercel.app
- **原始檔**：`~/Downloads/意川_WEB/`（純靜態 HTML + JSX + CSS，React CDN 版）
- **Vercel 專案**：`adams-projects-ce0cdac0/web`
- **狀態**：臨時性，Adam 提醒之後可能撤下

**Why:** 這是網站前台 UI/UX 展示用途，暫時放雲端讓外部可看。

**How to apply:** 撤下時到 Vercel dashboard 刪除 deployment 或整個 `web` 專案即可。重新部署用 `vercel --prod --prebuilt --yes` 在 `~/Downloads/意川_WEB/` 跑。
