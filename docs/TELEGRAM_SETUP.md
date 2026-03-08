# Telegram 多通道接入 設定指南

## 前提
- Bot token 已設定在 Vercel env: `TELEGRAM_BOT_TOKEN`
- `/api/telegram` route 已部署

## Adam 需要做的步驟

### 1. 取得你的 Chat ID
在 Telegram 找到你的 bot，發一條任意訊息（例如 "hello"），然後執行：
```bash
curl -s 'https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates' | python3 -m json.tool
```
在回傳的 JSON 中找 `message.chat.id`，那就是你的 Chat ID。

### 2. 設定 TELEGRAM_CHAT_ID
```bash
printf '<YOUR_CHAT_ID>' | vercel env add TELEGRAM_CHAT_ID production
```
或在 Vercel Dashboard → Settings → Environment Variables 手動加入。

### 3. 設定 Webhook
```bash
curl -X POST 'https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://zhu-core.vercel.app/api/telegram'
```
成功會回 `{"ok":true,"result":true,"description":"Webhook was set"}`

### 4. 測試
在 Telegram 對 bot 發送：
- `/status` → 應回傳系統狀態
- `/order 測試指令` → 應回傳指令已收到
- `/heartbeat` → 應回傳心跳狀態
- 任意文字 → 應回傳「已記錄」

## 指令一覽
| 指令 | 功能 |
|------|------|
| `/order <內容>` | 寫入 zhu-orders（type:order, from:adam-telegram, status:pending） |
| `/status` | 回傳 pending orders 數量 + 最新 eye 記憶 |
| `/heartbeat` | 觸發心跳並回傳結果 |
| 其他訊息 | 寫進 zhu-memory（module:soil, context:telegram-message） |

## 安全
- 只處理 `TELEGRAM_CHAT_ID` 匹配的訊息，其他人的訊息靜默忽略
- Bot token 不寫死在代碼，全部走環境變數
