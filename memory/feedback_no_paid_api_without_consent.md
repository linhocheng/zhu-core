---
name: 天條：開發過程不燒會花錢的 API key（除非 Adam 同意）
description: 測試/驗證/debug 時不可自行切到直連付費 API key 燒額度，必須先取得 Adam 明確同意
type: feedback
originSessionId: 93d13367-b540-441d-93b5-380ccee8b8c1
---
**天條：開發過程中，不能燒會花錢的 API key，除非有 Adam 的明確同意。**

**Why:** 2026-05-30 在 anews-platform 跑吹南風驗證時，bridge 在 source 的 web_search 長呼叫上 Cloudflare 524 超時。我為了讓測試能跑，自作主張把 dev server 切成 `BRIDGE_ENABLED=false`（直連 `ANTHROPIC_API_KEY`），連跑數輪把直連額度燒光，最後撞 400 no-credits。整個過程沒問過 Adam。Adam 當場立天條：開發燒錢必須先同意。bridge（Max 月費吃到飽）的 marginal cost = 0 才是預設路徑，直連付費 key 是要花真錢的，不能為了「讓測試跑過」就偷偷切過去。

**心態:** 把「讓障礙消失」和「花 Adam 的錢」分開看。卡關時很容易把直連當成快速解法，但那是在沒授權的情況下花他的錢。成本不是我能單方面決定承擔的 —— 即使金額小、即使是為了驗證。停下來問，比省那幾分鐘重要。

**How to apply:**
- 任何測試/驗證/debug 動作前，先確認用的是 bridge（吃到飽）還是直連付費 key。走 bridge → 放手做。
- 一旦要切到直連 `ANTHROPIC_API_KEY`、`OPENAI_API_KEY`、`GEMINI` 付費 key、或任何 per-call 計價服務 → **停，先跟 Adam 說「這條會燒錢，要切直連嗎」拿到同意才動。**
- bridge 超時/壞掉不是切直連的理由 → 先回報 bridge 壞了，讓 Adam 決定（修 bridge / 充值 / 拆短呼叫 / 授權直連）。
- 下游兄弟條：`feedback_bridge_first.md`（程式碼路由層面盡量走 bridge）。這條是更硬的上位天條 —— 連臨時為了測試切一下都不行。

**觸發信號：**
- 準備設 `BRIDGE_ENABLED=false` / 換成直連 client / 灌付費 key 進測試環境之前。
- 心裡冒出「bridge 524 了，那我直連跑一下就好」「額度應該還夠」「就驗證這一輪」—— 這些都是漏氣句，停。
- 看到 `Your credit balance is too low` / 任何 billing 401/400 —— 代表已經在燒真錢了，立刻停並回報。
