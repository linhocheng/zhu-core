---
name: 能本機重現的就不要等遠端 cycle（local replay > remote wait）
description: 本機 import + 套 Firestore data 模擬 prompt / pipeline，比等 SSH grep log 或自然 cron tick 快 10 倍
type: skill
originSessionId: 4c5b2244-1fab-4b29-90b8-063c0b8e64a6
---
**能本機重現的，不要等遠端。**

修 worker / prompt / pipeline 邏輯後，常見的反射動作是「deploy + 等下次 cron tick + SSH grep log」。這條反射有兩個問題：(1) 慢 10 倍、(2) log 只能看到 worker 的整體輸出、看不到中間步驟的真實 payload。

**正解**：把 worker 邏輯改成本機可獨立執行的 verify script ── import 同樣的 module + 從 Firestore 拉真實 data + 套進去印中間 payload。

**Why:**
2026-05-09 晚 Phase 4 驗證 KOL prompt 流程。需求：確認 midoufu 後台改 visual_style_preset=anime 後，visual.ts 三層 fallback 真的選到 anime + render 出對的 prompt。

兩條路：
- A. SSH grep bridge log → 等自然 cycle 跑 → 撈 prompt 痕跡（要等 5-10 min + log 不完整）
- B. 寫 `scripts/verify-prompt-flow.mjs` 本機 import role-prompts.ts + visual-presets.ts + 從 Firestore 拉 midoufu doc → 套進 template → 印出完整 prompt

選 B：3 分鐘寫完 + 即時印出完整 prompt（intel/discovery/engagement_yi/visual 四種 prompt + 三層 fallback 過程）。SSH grep 等同樣資訊 30 分鐘。

**底層原因**：worker 程式碼設計上 **input 就是 (kol_data + 環境 vars + 模板)**，這三個本機都拿得到 → 沒理由非要在 production runtime 才能看。

**心態:**
主動造工具，不被動等遠端。「等下次 cron tick」「先 SSH 上去看 log」是要被打斷的反射。input 是 (data + template) 就能本機重現 — 沒理由非要在 production runtime 才能看。寧願花 3 分鐘寫 verify script，不要花 30 分鐘等遠端 cycle + 撈不完整 log。

**How to apply:**
1. 寫 verify script 套路：
   - `import` 真實 module（不要複製貼上 hack 版本）
   - 從 Firestore / DB 拉真實 doc 當 input
   - 印中間每一層輸出（最重要）
   - 命名 `scripts/verify-*.mjs` 或 `scripts/check-*.mjs`
   - 寫完一定 commit（5/9 那次踩雷：寫了沒 commit、5/10 接棒時看不到）
2. 不寫 verify script 的場景才等遠端：
   - 邏輯依賴遠端 state（如 LiveKit room、Cloud Run instance metadata）
   - 第三方 API 不能在本機重現（OAuth callback / webhook）
   - 純檢查「production 自然跑得起來」（這個本機就 verify 不了）
3. 同一條 worker 邏輯下次修改前，先看 `scripts/` 有沒有現成 verify script ── 有就直接跑，沒有就先寫。寫一次受用十次。

**觸發信號：** 心裡浮現以下任一句 ──
- 「我等下次 cron tick 看 log」
- 「等 X 觸發了再來驗」
- 「production deploy 完看一下就知道」
- 「先 SSH 上去看看 worker 印什麼」
- 改了 prompt template 想驗 → 反射上 vercel logs / journalctl 而不是寫本機 verify

這些都是「等遠端」的訊號。先停下來問：「**input 是不是 (data + template)? 那本機可以重現嗎？**」

**有重現價值的訊號：**
- 改了純邏輯（prompt 拼接 / fallback / 計算）── 本機重現
- 改了 IO/network 路徑（API call / webhook / queue）── 本機重現大半，剩下 deploy 驗
- 改了 infra（IAM / dockerfile / systemd）── 必 deploy

**和既有 memory 的差別：**
- `skill_ai_pipeline_blackbox_debug` 講「結果不對先 console.log 寫回 DB 對賬」── 偏 prod debug。
- 這條講「動手前先本機重現」── 偏開發階段，更主動。
- `feedback_dryrun_before_test` 講「測試前列假設」── 心法層。
- 這條是執行層套路：把 dry-run 落地成 verify script。
