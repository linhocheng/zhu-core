---
name: Next.js App Router lib 模組 client/server 拆分 SOP
description: 寫 lib/*.ts 之前先列舉 caller，被 client component import 就拆 shared 檔，避免 firebase-admin 被打進 client bundle
type: feedback
originSessionId: c61f0252-1be7-469c-9aea-4e1d31b82333
---
**寫 `lib/*.ts` 第一個 import 加進去之前，先列舉誰會 import 這個檔。**

步驟：
1. 列舉 caller：grep 看哪些檔會 import 這個 lib。任一 caller 是 client component（含 `'use client'`） → 必拆
2. 拆法：純 type / label / default 寫 `*-shared.ts`（零副作用、零 firebase-admin / fs / env）；DB ops / 環境敏感寫主 `*.ts` 並 re-export shared
3. Client component 只 import shared；server route 可 import 主檔
4. 動手前 grep `'use client'` + import 路徑核一次

**Why:** 2026-05-08 寫 `system-prompts.ts` 把 firebase-admin 跟 SystemPromptsEditor 同檔，Vercel turbopack build 41 errors。根因是寫第一個 import 時沒問「誰會拉這個檔」，等到 build 才被打回票。

**How to apply:** 任何要在 React component 跟 server route 兩邊都用到的 lib 模組，動手前 5 秒先列 caller。看到 client component 就先拆 shared，不要先寫完邏輯再回頭重構。

**觸發信號：**
- 我正在 lib/ 寫一個新 *.ts 檔
- 我正在引入 firebase-admin / fs / process.env 等 server-only 依賴
- 我同時想到「這個常數 / type 後台 UI 也會用」 → 強信號，立刻拆 shared
- Vercel build 出現 firebase-admin / firebase/database-compat 在 turbopack chunk 裡 → 已經晚了，但要立刻拆而不是 dynamic import 繞路
