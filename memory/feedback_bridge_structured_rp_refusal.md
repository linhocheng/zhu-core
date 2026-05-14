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
