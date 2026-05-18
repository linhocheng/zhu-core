---
name: Gemini 圖片生成參考
description: gemini-2.5-flash-image 模型可用於生圖，key 存放位置與用法
type: reference
originSessionId: 3301e5b7-5af4-4d51-80a0-7452b1f97b96
---
- 模型：`gemini-2.5-flash-image`（付費 key，非免費額度）
- Key 存放：`~/.hermes/.env`（GEMINI_API_KEY）
- 用途：文件 → 簡報 pipeline 的配圖生成，base64 inline 直接嵌 HTML
- 並行跑：每張獨立 API call，互不阻塞，失敗單張 fallback Unsplash
- doc-designer 專案：`~/projects/doc-designer/`，skill 在 `~/hermes-agent/skills/creative/doc-designer/SKILL.md`
