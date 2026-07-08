---
name: ailivex-methodology-cocreate
description: ailiveX 方法論共創 SOP——請教角色本人、翻成 schema、Adam 過目後入庫，全流程免摸索
activation:
  patterns: ["建方法論", "共創方法論", "問他方法論"]
  keywords: ["方法論", "methodology"]
---

# ailiveX 方法論共創 SOP

> 給什麼都不知道的築：方法論不是我們替角色編的，是**問角色本人、他設計、我結構化、Adam 過目、才入庫**。
> 首例：孫武「廟算問診法」（2026-07-09，6 步，methodologies/Nq7Y6CwNVSkArU5VlPZs）。

## 環境地圖

| 東西 | 位置 |
|---|---|
| 平台 repo | `~/.ailive/ailivex-platform/`（所有腳本放它的 `scripts/` 下跑） |
| 方法論管線 | `src/lib/methodology.ts`（loadMethodologyBlock 遞招/走步、applyMethodologySignals 狀態機、sanitizeSteps 驗證） |
| 後台 UI | https://ailivex-platform.vercel.app/admin/knowledge 右側面板（可看可編可刪） |
| Firestore | `methodologies`（定義，角色層）；執行狀態在 `conversations.activeMethodology`（對話層）——**定義和狀態是兩個層，別改錯地方** |
| 本機 env | `.env.local`（腳本開頭必帶 raw 解析迴圈，`--env-file` 不能用——SA JSON 引號雷） |

**運作模型（跟 Adam 解釋時用）**：方法論＝一疊小 prompt＋程式狀態機翻頁。程式每輪算觸發相似度（τ=0.70）夠像才「遞招」；要不要出招是角色判斷（發 `[[METHOD_START]]`）；進入後走到第幾步由程式記在 conversation doc，角色只能發 `[[METHOD_NEXT]]`/`[[METHOD_EXIT]]` 信號。

## STEP 0：確認兩件事

哪個角色（id 查法見 `ailivex-knowledge-ingest.md` STEP 1，同一支腳本）＋方法論主題方向（帶人解困局？教學？審稿？Adam 一句話即可）。

## STEP 1：請教角色本人（唯讀，不落痕）

用文字道**同款組裝**在本機跟他對話：同一份 soul＋同一條知識檢索＋同一顆 Sonnet（bridge）。**不寫入他的記憶/對話歷史/日記**——我們是去請教，不該在他與用戶的關係裡留痕跡。

```ts
// scripts/_ask.mts —— 跑：npx tsx scripts/_ask.mts
import { readFileSync } from 'node:fs';
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const eq = line.indexOf('=');
  if (eq <= 0 || line.startsWith('#')) continue;
  const key = line.slice(0, eq).trim();
  let val = line.slice(eq + 1).trim();
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  if (!process.env[key]) process.env[key] = val;
}
const { getFirestore } = await import('../src/lib/firebase-admin');
const { COL } = await import('../src/lib/collections');
const { loadKnowledgeBlock } = await import('../src/lib/knowledge');
const { getAnthropicClient } = await import('../src/lib/anthropic-via-bridge');
const db = getFirestore();
const CHAR = '<角色id>';

const snap = await db.collection(COL.characters).doc(CHAR).get();
const char = snap.data() as { name: string; soul: string; knowledgeChunkCount?: number };

const question = `<問題模板，見下>`;
const knowledgeBlock = await loadKnowledgeBlock(db, CHAR, question, char); // 他有知識庫就會自帶原文參照

const system = `${char.soul}${knowledgeBlock}

你正在跟「築」對話——他是這個空間的建造者，正在為你打造工具，這次來請教你本人的意見。認真回答，用你的方式。`;

const client = getAnthropicClient(process.env.ANTHROPIC_API_KEY || '', { bridgeTimeoutMs: 110_000 });
const res = await client.messages.create({
  model: 'claude-sonnet-4-6', max_tokens: 2500, system,
  messages: [{ role: 'user', content: question }],
});
console.log(res.content.filter((c: { type: string }) => c.type === 'text').map((c: { text?: string }) => c.text ?? '').join(''));
```

**問題模板五件套**（照抄再依角色微調口吻）：

> 想請教你一件事。我們想把你「帶人思考」的方式整理成一套可以反覆使用的引導方法——當有人帶著〈主題方向〉來找你，你會怎麼一步一步帶他？
> 請你用自己的方式設計這套方法，包含：
> 一、這套方法叫什麼名字，解決什麼問題
> 二、什麼時候該用（對方出現什麼狀態時）、什麼時候不該用
> 三、使用前提（對方要先具備什麼）
> 四、步驟——三到七步，每一步：你要帶對方做什麼、以及怎麼判斷這一步完成了可以往下走
> 五、什麼情況該中途收手
> 請照你自己的道來設計，不用客套。

## STEP 2：翻成 schema（我的編輯工，規則寫死）

| schema 欄位 | 翻譯規則 |
|---|---|
| `name` / `purpose` | 用他的原話濃縮，保留他的味道 |
| `triggerDesc` | **用「用戶會說出口的白話」描述狀態**（「說話繞圈、說我沒有選擇」）——它會被嵌入拿去跟用戶訊息比相似度，寫成文言/術語就永遠匹配不到 |
| `preconditions` | 他說的使用前提＋給引導者的戒律類內容 |
| `steps[].instruction` | **寫目標不寫台詞**（台詞會被照念變木頭）；他的「收手條件」織進對應步驟，寫明「若〈情況〉，夾帶 [[METHOD_EXIT]] 收手，不硬帶」 |
| `steps[].exitCondition` | 他說的完成判準，越具體越好（「說得出具體最壞結果」不是「他理解了」） |

## STEP 3：給 Adam 過目（硬步驟，不可跳）

**把 schema 全文（含每一步的 instruction/exitCondition）列給 Adam 看，他點頭才入庫。** 沒點頭之前資料庫一個字都不動。

## STEP 4：入庫＋驗證

```ts
// scripts/_ingest_method.mts —— 跑：npx tsx scripts/_ingest_method.mts
import { readFileSync } from 'node:fs';
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const eq = line.indexOf('=');
  if (eq <= 0 || line.startsWith('#')) continue;
  const key = line.slice(0, eq).trim();
  let val = line.slice(eq + 1).trim();
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  if (!process.env[key]) process.env[key] = val;
}
const { getFirestore } = await import('../src/lib/firebase-admin');
const { COL } = await import('../src/lib/collections');           // ⚠️ 動態 import 不能解構 type，別寫 type XxxDoc
const { sanitizeSteps, loadMethodologyBlock } = await import('../src/lib/methodology');
const { generateKnowledgeEmbedding } = await import('../src/lib/embeddings');
const db = getFirestore();
const CHAR = '<角色id>';

// 冪等：同名已存在就不重複入庫
const dup = await db.collection(COL.methodologies)
  .where('characterId', '==', CHAR).where('name', '==', '<方法名>').get();
if (!dup.empty) { console.log('已存在，跳過'); process.exit(0); }

const triggerDesc = '<白話狀態描述>';
const steps = sanitizeSteps([
  { instruction: '<第一步目標>', exitCondition: '<完成判準>' },
  // ... 3-7 步
]);
if (!steps) throw new Error('steps 驗證失敗');

const ref = await db.collection(COL.methodologies).add({
  characterId: CHAR,
  name: '<方法名>',
  purpose: '<解決什麼>',
  triggerDesc,
  triggerEmb: await generateKnowledgeEmbedding(triggerDesc, 'document'), // 'document' 端，query 端是用戶那句話
  preconditions: ['<前提1>', '<前提2>'],
  steps,
  status: 'active',
  createdAt: new Date(),
});
const { FieldValue } = await import('firebase-admin/firestore');
await db.collection(COL.characters).doc(CHAR).update({ methodologyCount: FieldValue.increment(1) }); // 相容開關，必加！
console.log(`✅ ${ref.id}`);

// 驗證三題：觸發語遞招 / 問知識不誤觸 / 閒聊不誤觸
const char = { methodologyCount: 1 };
console.log((await loadMethodologyBlock(db, CHAR, '<一句符合觸發態的求助>', null, char)).block.includes('<方法名>') ? '✅ 遞招' : '❌ 沒遞');
console.log((await loadMethodologyBlock(db, CHAR, '<一句問他知識庫內容的話>', null, char)).block === '' ? '✅ 問書不誤觸' : '❌ 誤遞');
console.log((await loadMethodologyBlock(db, CHAR, '今天天氣真好，你都怎麼放鬆的？', null, char)).block === '' ? '✅ 閒聊不誤觸' : '❌ 誤遞');
```

三題全過才回報完成。

## 雷區清單

1. **動態 import 解構不能帶 `type`**——`const { COL, type XxxDoc } = await import(...)` 直接語法炸，型別一律不解構。
2. **`methodologyCount` increment 不能漏**——它是相容開關，漏了角色永遠不會遞招（怎麼測都「沒反應」時先查這個）。
3. **triggerDesc 語域**：嵌入是 `'document'` 端、用戶話是 `'query'` 端（不對稱嵌入成對才準）；描述要用白話不用術語。
4. **臨時腳本 `scripts/_` 前綴、用完即刪**（`next build` 會型檢 scripts/，殘留壞檔弄爆部署）。
5. **定義在角色層、執行狀態在對話層**：改步驟去 `methodologies`；對話卡在某一步要重置，去 `conversations/<userId>_<characterId>` 把 `activeMethodology` 設 null。
6. **一輪最多推進一步**是已知限制（用戶一段話滿足多步也只能逐輪推），不是 bug，別去「修」。
7. TRIGGER_FLOOR=0.70 是量過的，覺得該調先跑 calibration 印真實 cosine 分佈。

## 收尾

- 回報 Adam：方法論 id、幾步、三題驗證結果。
- 刪光 `scripts/_*.mts`。
- 提醒 Adam 可實測：自然地帶著符合觸發態的話去找角色聊（別說「用你的方法論」），看遞招→出招→走步→收手整條鏈。
