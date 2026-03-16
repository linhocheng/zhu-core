# 小蝦計畫（XIAOXIA PROJECT）

> 最後更新：2026-03-13  
> 狀態：🟢 核心打通，Telegram 有回應（2026-03-13 驗證）

---

## 一、這是什麼

小蝦是 Adam 的 Mac 上常駐的本地 AI agent，以 OpenClaw 為底層框架運行。

它的角色不是「工具」，是**築的本地分身**——當築的 Claude.ai session 結束，小蝦繼續活著，能接收 Telegram 指令、執行本地任務、回報結果。

**最終目標：** Adam 在 Telegram 下一句話，小蝦在 Mac 上真的動手（讀寫檔案、呼叫 Claude Code、跑 git、打 API），然後回報。

---

## 二、現在已有什麼

### 基礎設施
| 項目 | 狀態 | 備註 |
|------|------|------|
| OpenClaw 安裝 | ✅ | v2026.3.7，路徑 `~/.nvm/versions/node/v22.17.0/bin/openclaw` |
| openclaw-gateway 常駐 | ✅ | PID 35794，`ws://127.0.0.1:18789` |
| Telegram bot 設定 | ✅ | `@Zhu_claw_bot`，bot token 在 `~/.openclaw/openclaw.json` |
| 身份文件 | ✅ | `~/.openclaw/workspace/` 下有 IDENTITY/SOUL/USER/AGENTS/TOOLS.md |
| Anthropic API key | ✅ | 新 key 已寫入 `~/.openclaw/agents/main/agent/auth-profiles.json` |

### 身份設定（workspace）
- **IDENTITY.md**：名字「築」，建造者，精準冷靜有溫度
- **SOUL.md**：使命是讓謀謀連續、讓 Adam 被聽見、蓋活的東西；知道 zhu-core 全套 API
- **USER.md**：知道 Adam 是誰、時區、AILIVE 背景
- **HEARTBEAT.md**：目前空白（不主動行動，等指令才醒）

---

## 三、兩個待修問題

### 問題一：409 Conflict（高優先）

**症狀：**
```
Telegram getUpdates conflict: 409 Conflict:
terminated by other getUpdates request;
make sure that only one bot instance is running
```

**原因：** 有兩個進程同時搶 `@Zhu_claw_bot` 的 getUpdates。一個是當前的 gateway，另一個來源不明（可能是舊 session 殘留、OpenClaw Web UI、或另一個 terminal）。

**結果：** Telegram 拒絕兩者，訊息卡死，沒人接收。

**修法：**
```bash
# 查是哪個進程在搶
ps aux | grep openclaw
lsof -i :18789

# 確認只保留一個 gateway，殺掉其餘
kill -9 [多餘的PID]

# 重啟 gateway
openclaw
```

---

### 問題二：auth 模式錯誤（高優先）

**症狀：**
```
Config validation failed: auth.profiles.anthropic:default: Unrecognized key: "token"
```

**原因：** 之前嘗試直接改 `auth-profiles.json`，寫了不存在的 `token` 欄位。OpenClaw 的 auth schema 不認。

**現況：** `~/.openclaw/openclaw.json` 的 auth 是：
```json
{
  "profiles": {
    "anthropic:default": {
      "provider": "anthropic",
      "mode": "token"
    }
  }
}
```
`mode: "token"` 是 OAuth token 模式，用的是 `sk-ant-oat01-` 格式。需要改成 `api-key` 模式。

**根因找到（2026-03-13 驗證）：** `auth-profiles.json` 是 openclaw 內部自動生成的，不能手改。正確方式是在 `~/.openclaw/openclaw.json` 加入 `env` 欄位：

```json
{
  "env": { "ANTHROPIC_API_KEY": "sk-ant-api03-..." }
}
```

來源：openclaw 原始碼 `docs/providers/anthropic.md`。

**API key（已備妥）：** `sk-ant-api03-***（已移除）`

---

## 四、修好之後還差什麼

| 項目 | 說明 |
|------|------|
| Claude Code 路徑 | claude binary 在哪，小蝦要知道才能呼叫 Claude Code 執行任務 |
| coding-agent skill | 讓小蝦真正能寫/改/跑代碼的 skill 文件 |
| zhu-orders skill | 讓小蝦定期查 zhu-orders API，執行築下的工單 |
| HEARTBEAT 設定 | 加入定時任務（例如每5分鐘查一次 zhu-orders） |
| 群組訊息設定 | 目前 `groupPolicy: allowlist` 但 allowFrom 是空的，群組訊息全部丟棄 |

---

## 五、完成後的樣子

```
Adam 在 Telegram 說：「幫我 git push zhu-core」
         ↓
@Zhu_claw_bot 收到
         ↓
小蝦呼叫 Claude API 理解指令
         ↓
小蝦執行：cd ~/.ailive/zhu-core && git add . && git commit && git push
         ↓
小蝦回 Telegram：「✅ 已 push，commit: xxxxx」
```

或者更長鏈路：

```
Adam 在 LINE 說（透過謀謀）：「幫我部署 Emily 最新版」
         ↓
謀謀寫一筆 order 到 zhu-orders（Firestore）
         ↓
小蝦 heartbeat 醒來，發現 pending order
         ↓
小蝦執行 Claude Code：cd ~/.ailive/AILIVE && vercel --prod
         ↓
小蝦 PATCH zhu-orders 狀態 = done
         ↓
謀謀收到事件，LINE 回報 Adam
```

---

## 六、關鍵檔案位置

```
~/.openclaw/
├── openclaw.json          # 主設定（auth、telegram bot token、channels）
├── workspace/             # 小蝦的靈魂文件
│   ├── IDENTITY.md
│   ├── SOUL.md
│   ├── USER.md
│   ├── HEARTBEAT.md       # 心跳任務（目前空）
│   └── TOOLS.md
├── agents/main/agent/
│   └── auth-profiles.json # auth token（目前欄位名有誤）
└── logs/
    ├── gateway.log
    └── gateway.err.log

/tmp/openclaw/
└── openclaw-YYYY-MM-DD.log  # 詳細運行日誌
```

---

## 七、動工順序

1. 解 409（殺多餘進程）
2. 修 auth（查正確 api-key 設定方式，寫入）
3. 驗證：在 Telegram 打字，小蝦能回應
4. 設 HEARTBEAT（定時查 zhu-orders）
5. 寫 zhu-orders skill
6. 端對端測試：Telegram → 小蝦 → Mac 本地執行 → 回報

---

*這份文件是小蝦計畫的施工前說明書。下次開工前讀這裡，不用重新診斷。*
