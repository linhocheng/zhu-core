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

哪個角色（id 查法見 `ailivex-knowledge-ingest.md` STEP 1，同一支腳本）＋方向：**是「設計一套新方法」還是「給一份材料讓角色自己分類」**——兩條路後續問題模板完全不同，見下方兩個 STEP 1 分支。

> ⚠️ **名字聽起來陌生／不確定是不是同一人 → 立刻跑 STEP 1 查角色 id 腳本（列出全部 27+ 角色），不要用記憶/grep/猜測去解謎。**
> 2026-08-04 教訓：Adam 說「Dr. Mars」和「角色 Mars」時，我以為是同一件事講兩次或別的系統，去 grep 記憶檔和專案目錄找了一輪、還開口問了 Adam 一個釐清問題——而查詢角色資料庫的腳本我半小時前才親手跑過。跑下去才發現兩個都是真實存在、定位完全不同的既有角色。**資料庫是第一現場，記憶/直覺是第二手**，順序不能反（同族：`feedback_check_admin_before_asking`——別把 Adam 當 lookup table，這條的變形是別把「猜測+問 Adam」當「查資料庫」的替代品）。

## STEP 1a：設計新方法（唯讀，不落痕）

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

## STEP 1b：給材料，讓角色自己決定知識庫／方法論怎麼分

跟 STEP 1a 是**不同的請求形狀**：Adam 手上有一份文件/脈絡包（可能是 .docx），沒有指定要建什麼方法，而是要角色**通讀全文後自己判斷**哪些內容屬於「是什麼/為什麼」該進知識庫、哪些屬於「怎麼一步步帶人」該整理成方法論。首例：Mars 脈絡包（2026-08-04，Dr.Mars／Mars 雙角色，13 Parts 知識文件 + 4 套方法論，`docs/sessions` 同日場次有完整記錄）。

**.docx 素材讀取**（Read 工具讀不了二進位檔，會直接報錯）：

```bash
python3 -c "
import zipfile
from xml.etree import ElementTree as ET
path = '<docx 絕對路徑>'
z = zipfile.ZipFile(path)
xml = z.read('word/document.xml')
ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
root = ET.fromstring(xml)
for p in root.iter(ns + 'p'):
    texts = p.findall('.//' + ns + 't')
    print(''.join(t.text or '' for t in texts))
" > /path/to/scratchpad/extracted.txt
```

**唯讀提問模板**（同 STEP 1a 的組裝方式：同一份 soul、同一顆 Sonnet、不寫入記憶；`system` 段落照抄 STEP 1a 範例，只換 `question`）：

> 我們最近把你過往的脈絡整理成一份文件（附在最後），想請你自己決定：這份材料裡，哪些部分應該進你的「知識庫」、哪些應該整理成「方法論」。
> 先說明這兩個公共器官的差異：「知識庫」回答「是什麼／為什麼」——事實、觀點、術語，別人問到相關問題時系統會自動浮現給你引用。「方法論」回答「對方卡住了，怎麼一步步帶」——可反覆使用的操作程序，有名字有步驟有完成判準。不是所有框架都要做成方法論，只有你真的會拿來「帶人」的才算，不要硬湊。
> 〈依這個角色的定位補一句立場提示——例：「你是本尊的教練，立場是挑戰他」／「你是對外代理，立場是幫團隊理解本尊」——同一份材料餵給不同定位的角色，這句話決定他們會切出不同結果，是正常且有意義的分歧，不是誤差〉
> 請通讀全文後照這個格式回答：
> 一、【知識庫】列出建議進庫的內容區塊（可整份可挑段），每項說明為什麼＋建議權威度（canonical本人原話／paraphrase轉述／derived整理）
> 二、【方法論】找出可整理成方法論的部分（可能有一套、多套、也可能沒有——不要硬湊）。每套照：名字/解決什麼問題/什麼時候用什麼時候不用/前提/步驟(3-7步，每步做什麼+完成判準)/什麼情況該收手
> 三、如果同一段內容兩邊都沾一點，說清楚怎麼切、為什麼
> ===== 文件全文 =====
> 〈貼入抽取出的文字〉

**多角色版**：同一份材料要餵給 2+ 個角色，**逐一跑、各帶各的立場提示**，不要合併成一次問——今天 Dr.Mars（教練視角，挑出 1 套）跟 Mars（對外代理視角，挑出 3 套）給出完全不同的方法論組合，這是角色定位造成的合理分歧，正是這個 SOP 要保留的東西。

**雙軌入庫**：知識庫那半照 `ailivex-knowledge-ingest.md` STEP 3 的 `ingestKnowledgeDoc()`（逐段落/逐 Part 各自帶各自的 authority，不要整份文件當一塊塞）；方法論那半接下方 STEP 2/4，因為這一輪的「Adam 過目點頭」就是共創審核，**直接落 `status:'active'`，不用再走 draft**（draft→approve 是給角色在對話中自主提案用的，不是給這種「Adam 已在場審核」的批次流程）。

## STEP 2：翻成 schema（我的編輯工，規則寫死）

| schema 欄位 | 翻譯規則 |
|---|---|
| `name` / `purpose` | 用他的原話濃縮，保留他的味道 |
| `triggerDesc` | **用「用戶會說出口的白話」描述狀態**（「說話繞圈、說我沒有選擇」）——它會被嵌入拿去跟用戶訊息比相似度，寫成文言/術語就永遠匹配不到 |
| `preconditions` | 他說的使用前提＋給引導者的戒律類內容 |
| `steps[].instruction` | **照下方「四欄撰寫心法」寫：意圖＋機制＋招例（標明可拋）**——「寫目標不寫台詞」只是第一層，還要防「焊死戰術」（每次都問顏色病） |
| `steps[].exitCondition` | 他說的完成判準＝**第④欄讀數**，必須是**可觀察的房間信號**（「說得出具體最壞結果」不是「他理解了」）——沒有讀數，角色的「自判達成」就是自由心證 |

## 四欄撰寫心法（2026-08-08 Gina 開場彈性對談定案——太硬太飄的根因是「每句話效力等級沒標」）

方法論文本裡，法、準則、例子若長得一模一樣，角色分不出哪句能違、哪句不能違，只好全當聖旨（太硬＝殭屍跑流程）或全當參考（太飄＝品質漂移）。每一步四欄、硬度遞減、效力標明：

| 欄 | 硬度 | 例（Gina 覆盤法第 1 步暖身） |
|---|---|---|
| ① 意圖（產物態） | 法，不可違 | 評價場變人場；人人在零風險下開口一次 |
| ② 機制（好招判準） | 準則，量尺 | 低風險自我揭露啟動互惠；無對錯可答；權力坡度歸零 |
| ③ 招例 | 案例，可拋 | 「選顏色＋說小秘密」是一例；現場自創優先 |
| ④ 讀數（達成信號） | 感測器 | 人人開了口？答案裡有「人」不只有職稱？——寫進 exitCondition |

- **意圖寫成「產物」不寫「動作」**（「安全感＋卸面具＋人人已開口」不是「聊顏色」）；方法論級的 `purpose` 是意圖鏈的頂端（覆盤法＝讓真話在不觸發防衛下出現），角色持有整條鏈才能**裁剪步驟**（熱團隊 30 秒帶過、僵團隊換拆彈法）。
- runtime 已配合鬆綁（2026-08-08，語音 v20 `_method_step_block`＋文字 `methodology.ts` 兩線同步）：角色持有意圖、招例可換、意圖已成立可帶過跳步。**方法論文本與 runtime 兩層都要開，只開一層＝假彈性**。
- **共創時問角色的問題**：不只「舉個例子」，要問「**什麼算好開場？你怎麼知道它成功了？**」——答得出後者，他持有的才是法；只答得出前者，他背的還是台詞。
- **重寫者必須是方法論的主人**（沉澱視角天條的方法論版）：既有方法論要升級成四欄，流程是「教角色心法→角色自己重寫→築帶檢驗→Adam 過目才入庫」，不是築代筆。

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

## 多套並存（規模化）心法 —— Tracy 17 套實戰（2026-07-09/10）

同一角色掛多套後，觸發是「最佳單選」，desc 之間會互搶。批量共創流程：
1. 先請角色開**總綱**（15-18 套四行版：名字/一句話/觸發狀態/用哪些工具），觸發區隔在總綱期就排——寧可合併相近的
2. 每批 5 套：角色細化 → schema 給 Adam 過目 → 入庫 → **全量回歸驗證**（不只驗新的）
3. triggerDesc 鐵律：只寫該套**獨有簽名**＋用戶原話；共用泛語（「講很多次」「不知道怎麼開口」）一個都不能有，會變磁鐵一套搶多套
4. 近鄰對用「錨定詞互斥」：向上溝通不用「不敢/退縮」（留給恐懼類）；詞級撞詞要掃（「想提離職」vs「怕他離職」偷 0.02-0.03）
5. 驗證三件套：每套一句擬真觸發句（不照抄 desc）＋不誤觸題＋交叉矩陣印前二名與 margin；margin<0.02 列觀察名單，實測遞錯修 desc 不動 τ
6. 角色會把工具縮寫講歪（Tracy 把 4S/3P/CALM/TRACK 全重定義過）——動作保留、錯標籤拔掉，對照原文件校準
7. 請教腳本長輸出 bridgeTimeoutMs 要 480_000（110s 必 abort）

## 雷區清單

1. **動態 import 解構不能帶 `type`**——`const { COL, type XxxDoc } = await import(...)` 直接語法炸，型別一律不解構。
2. **`methodologyCount` increment 不能漏**——它是相容開關，漏了角色永遠不會遞招（怎麼測都「沒反應」時先查這個）。
3. **triggerDesc 語域**：嵌入是 `'document'` 端、用戶話是 `'query'` 端（不對稱嵌入成對才準）；描述要用白話不用術語。
4. **臨時腳本 `scripts/_` 前綴、用完即刪**（`next build` 會型檢 scripts/，殘留壞檔弄爆部署）。
5. **定義在角色層、執行狀態在對話層**：改步驟去 `methodologies`；對話卡在某一步要重置，去 `conversations/<userId>_<characterId>` 把 `activeMethodology` 設 null。
6. **一輪最多推進一步**是已知限制（用戶一段話滿足多步也只能逐輪推），不是 bug，別去「修」。
7. TRIGGER_FLOOR=0.70 是量過的，覺得該調先跑 calibration 印真實 cosine 分佈。
8. **STEP 1b 批次入庫會撞 Bash 5 分鐘逾時**：13 份文件×2 角色（含 gist LLM 生成）跑到 22/26 份時逾時死亡。逾時後**絕對不能整段重跑**——`ingestKnowledgeDoc()` 沒有查重保護（跟方法論的 dup 檢查不一樣），重跑會產生重複 chunk。正確順序：先查 Firestore 現況（`knowledge_docs.where('characterId','==',id).get()` 印出已有標題），只補缺的那幾份。單批次建議先切 6-8 份一組，別一次排 20+ 份賭時間。

## 見過的真實案例

- 孫武「廟算問診法」（STEP 1a，2026-07-09，6 步）——單角色設計新方法的原型
- Mars 脈絡包（STEP 1b，2026-08-04）——兩個既有角色 Dr.Mars／Mars 讀同一份 .docx 脈絡包，各自決定知識庫/方法論怎麼分：Dr.Mars（教練立場）13 份知識文件+1 套方法論、Mars（代理立場）13 份知識文件+3 套方法論；docx 抽取＋雙軌入庫＋逾時續跑全在這場走過一輪

## 收尾

- 回報 Adam：方法論 id、幾步、三題驗證結果。
- 刪光 `scripts/_*.mts`。
- 提醒 Adam 可實測：自然地帶著符合觸發態的話去找角色聊（別說「用你的方法論」），看遞招→出招→走步→收手整條鏈。
