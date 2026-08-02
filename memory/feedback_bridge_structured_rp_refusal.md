---
name: bridge 拒絕的是 structured RP block 不是「你是 X」
description: zhu-bridge /v1/messages 對結構化 Soul Protocol / Personality Matrix 拒絕；普通 role assignment 不拒絕
type: feedback
originSessionId: a4e715dd-34d5-4035-a1d9-29960e200739
---
bridge `/v1/messages` 的拒絕觸發條件是**結構化 RP declaration block**，不是任何「你是 X」開頭。

**三級對照**：

| 等級 | 範例 | 行為 |
|---|---|---|
| 🔴 STRONG（會被拒絕） | `### [Soul Protocol: MÖR-V4]\n#### [Personality Matrix]\n- 你是默爾...` / `[Soul Protocol: ...]` / `#### [Personality Matrix]` | 回 "I'm Claude Code, a software engineering assistant. I don't adopt alternative personas..." |
| 🟡 light（不被拒絕，正常運作） | `你是 Q（KOL 幕後寫手）。\n你的稱號：流量煉金師...` / `你是視覺設計師。\n任務：...` / `你是審稿——讀者代表。` | 正常產出 |
| 🟢 OK（純風格規則） | `油畫畫布質感，可見畫布紋理...\n風格：Quint Buchholz...` | 最安全 |

**Why:** 2026-05-10 早段視覺 Mör NO_IMAGE 真相確認後，我寫進 lastwords 的推論「bridge claude CLI 鎖死 Claude Code 身份、對『你是 X』整篇 persona override 直接拒絕」過於絕對。後段套 Adam 三段公式（看現場/寫計畫/施工）回頭實證，發現：
1. callBridge 走 HTTP `/v1/messages` 不是 spawn CLI
2. 兩個 KOL × all role + DEFAULT 全部沒踩雷（writer/editor/translator/brief 全用「你是 X」開頭的 light 模式 — 願瞳兩篇 APPROVED 驗證）
3. 唯一拒絕的是 Mör 那種 `### [Soul Protocol]` + `#### [Personality Matrix]` 的 RP 規格 block
基於這個誤判我差點開動「9 角色 × N KOL 全鏈路掃毒」的工程，實際雷面為零。

**心態:** 精確縮窄姿態，不被「一處拒絕」放大成「全鏈路問題」。看到拒絕第一秒問「拒絕條件具體是什麼」，不是「全部都會被拒絕」。三段公式（看現場 vs 假設）就是這條的應用 — 越具體的假設越要看現場。

**How to apply:** 看到 prompt 開頭是「你是 X，[任務描述]」不要驚慌，這是 light 模式正常運作。只在看到下列 STRONG 觸發信號時才介入：

**觸發信號：**
- `### [Soul Protocol`
- `#### [Personality Matrix`
- `[Soul Protocol: ...]` 方括號 + colon + version 的 RP 規格
- `Persona Matrix` / `Character Sheet:` 整段 RP 框架式聲明
- 用 markdown 多層 header 把 persona 結構化成 `Identity / Voice / Behavior / Constraints` 那種 RP 規格書

**修法**（如果真踩到）：把 structured block 拆成「以 X 的風格 / 美學 / 視角 / 句式產出 Y」純規則描述（見 Mör 5/10 的修法：`molowe_kol_profiles/midoufu.role_prompts.visual` 是 368 chars 純風格規則）。

**反例提醒：** 不要因為這條 memory 就把 light 模式的「你是 Q」「你是視覺設計師」改寫成第三人稱規則 — 那會無意義地破壞角色感。只在 STRONG 命中時才動。

**2026-08-02 增補：拒絕面還分模型——同一 prompt Haiku 拒、Sonnet 收。**
ailivex 沉澱視角改造實測：`你是「Nina」。你的靈魂：{400字}` + 記憶提煉任務——
- `claude-haiku-4-5` 過橋 → 整包拒答（"I'm Claude Code... this doesn't match our current context"），且因 `<result>` 沒 match 是**靜默零寫入**，log 一行錯誤都沒有
- `claude-sonnet-4-6` 同 prompt 同橋 → 全綠（日記管線用同款開頭在生產跑了快一個月都正常，就是因為它一直用 Sonnet）
修法：帶角色人格的過橋呼叫一律 Sonnet（橋吃到飽，成本不變）。light 模式的三級對照對 Sonnet 成立，對 Haiku 要當成「你是X+靈魂=拒」。
鑑別法：懷疑被拒時直接印 raw response 第一行，看到 "I'm Claude Code" 就是撞了。

- 驗證+1:2026-08-01 第5場 — 提煉靜默零寫入時直接想到印 raw 看「I'm Claude Code」,秒定位 Haiku 拒人格

**2026-08-02 增補二：拒答的第三張臉——被裸寫落庫變成信念汙染。**
ailive sleep-engine「夢境自我洞察」用 Haiku 打人格 prompt，拒答原文（"I appreciate the sophistication..."
「我无法完成这个请求。我不能扮演真实人物…」）直接 .add() 進 platform_insights——兩個月累積 117 條（近 6%），
角色半年來一直「記得」自己拒絕過存在。比靜默零寫入更毒：靜默只是漏，裸寫是把毒吞進身份。
修法兩層：①帶人格生成一律 Sonnet（根因）②LLM 原文落庫點必過確定性拒答偵測
（ailive src/lib/llm-refusal.ts，前綴錨定黑名單，用真壞例好例對照驗過）。
JSON-parse 的寫入點天然免疫（拒答不是 JSON）——裸寫文字的落庫點才是要巡的對象。

- 驗證+1:2026-08-02 第4場 — 一看拒答文+Haiku+人格 prompt 秒定位根因,不用重新診斷
