---
name: node-esm-import-js-boot
description: moduleResolution:bundler 編譯期放行無副檔名 import，Node runtime 才炸 ERR_MODULE_NOT_FOUND；新加相對 import 後 deploy 前必本機 node dist 起一次
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8ef8c0e1-e3c6-4a5a-b395-90a13805cb5c
---

規則：**Node ESM 專案（package.json `"type":"module"`）的相對 import 一律寫 `.js` 副檔名**（`import { x } from './text-filter.js'`，即使源檔是 `.ts`）。而且：**專案第一次加入相對 import 時，deploy 前先本機 boot 一次**。

**Why**：2026-07-02 podcast-worker 加 `text-filter.ts`，寫 `from './text-filter'`。tsconfig 是 `moduleResolution: "bundler"` → **tsc 編譯全綠**，但 Node runtime 的 ESM resolver 要求完整副檔名 → container 一啟動就 `ERR_MODULE_NOT_FOUND` → Cloud Run startup probe 失敗 → 整個 Cloud Build FAILURE。編譯期跟執行期的模組解析規則不同步，這個雷只有跑起來才炸。

**How to apply（SOP）**：
1. Node ESM 專案寫相對 import 就帶 `.js`，反射動作。
2. 更保險的攔截點：build 完 `node dist/index.js` 本機起一次看到 listening 才推（單檔專案第一次加 import 最容易踩——之前沒有相對 import 所以從沒暴露過）。
3. 已炸時的診斷路徑：Cloud Build 報 `container failed to start and listen on PORT` → `gcloud logging read ... revision_name=<失敗的revision>` 看 startup log，ERR_MODULE_NOT_FOUND + `url: 'file:///app/dist/xxx'`（無副檔名）就是這雷。

**觸發信號**：Cloud Run deploy 報「container failed to start and listen on the port」而上一輪 deploy 還是好的、這輪剛好新加了 import；tsc 全綠但 runtime 掛。

相關：[[dynamic-import 救不了 Turbopack bundle]]（同屬「編譯期綠 ≠ 執行期通」家族）。
