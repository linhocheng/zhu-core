---
name: ailivex-knowledge-ingest
description: ailiveX 角色知識庫入庫 SOP——素材取得、切塊入庫、驗收三件套，全流程免翻 code
activation:
  patterns: ["入庫", "加知識庫", "餵知識"]
  keywords: ["知識庫", "入庫", "knowledge"]
---

# ailiveX 角色知識庫入庫 SOP

> 給什麼都不知道的築：照這份走完就是完成，不用翻 code、不用摸索。
> 管線建於 2026-07-08（v17.2.0，commit 33e3c56），首例：孫武《孫子兵法》27 塊。

## 環境地圖（一次記住）

| 東西 | 位置 |
|---|---|
| 平台 repo | `~/.ailive/ailivex-platform/`（Next.js，Vercel prod: https://ailivex-platform.vercel.app） |
| 入庫管線 | `src/lib/knowledge.ts`（chunkText 切塊 / generateGists 白話大意 / ingestKnowledgeDoc 入庫 / loadKnowledgeBlock 檢索） |
| 後台 UI | https://ailivex-platform.vercel.app/admin/knowledge（Adam 有帳號，我沒有——我走本機腳本） |
| Firestore | collections：`characters`（角色，欄位 `knowledgeChunkCount` 是相容開關）、`knowledge_docs`（母表）、`knowledge_chunks`（塊） |
| 本機 env | `~/.ailive/ailivex-platform/.env.local`（含 Firestore SA、BRIDGE_*；**沒有付費 ANTHROPIC_API_KEY，LLM 一律走 bridge**） |
| 驗證範本 | `scripts/verify-knowledge.mts`（e2e 17 項，已 commit） |

**管線自動做的事（不用自己做）**：切塊（段落合併~500字/硬上限900）、Sonnet 4.6 寫白話大意（gist，檢索索引用；2026-07-14 從 Haiku 換上）、embedding（`text-multilingual-embedding-002`＋task_type）、authority 與出處標籤、`knowledgeChunkCount` 計數維護。

**預寫 gists（時機地址）——2026-08-08 起一切語料必用，不再限寓言類**：`ingestKnowledgeDoc` 收可選 `input.gists`（長度必須===`chunkText(content)`塊數，錯位 throw）。把索引從「內容摘要」升級為「使用時機」——**前 2/3 處境語言（用戶會怎麼問到這段的 2-4 種不同措辭）＋後 1/3 一句話內容錨（專名保留）**。禁寫「這份文件說明⋯」文件描述語——索引比對的對象是提問的人，不是文件管理員。
- 寓言/狀態導向語料證據：莊子 203 塊，內容敘述放前面稀釋狀態尾巴（鯤鵬排 #100，翻轉配比後升 #1）。
- **事實類語料證據（Mars 案，2026-08-08）**：自動生成的內容摘要式 gist 讓「現在主力有哪些產品」真實用戶問句 0 塊過檻（角色答「我沒有資料」）、最相關的《集團組織架構》從不進 top5；重寫時機地址後同句 top1 cos 0.77／lex 0.55，全部驗收句過檻。**措辭覆蓋要包含「泛稱問法」**（「主力產品」「公司背景」這種不含專名的問法）——只寫專名問法（「CreativeFlow 怎麼計價」）救不了泛稱 query。
- 驗收加考「狀態題／泛稱題」：N 句擬真處境 query（不照抄 gist 措辭、含泛稱問法、含一句簡體模擬 STT），期望塊須進 top3；外加一句無關閒聊當陰性對照（0 過檻才對）。

## STEP 0：開場三問（用戶沒給就問，別猜）

1. **哪個角色？** 拿到名字後查 id（見 STEP 1 腳本）。
2. **素材什麼形式？** 直接貼文／書名要我去找／URL。
3. **權威度誰定？** canonical（本人原話）/ paraphrase（轉述）/ derived（整理）——**這是 Adam 的編輯責任，不是系統猜的**。他沒說就問。順帶問 docType：book/article/talk/interview/note。

## STEP 1：查角色 id

在 `~/.ailive/ailivex-platform/` 下建臨時腳本跑（**所有腳本都必須放在這個 repo 的 `scripts/` 下**，出去就吃不到 node_modules 和 tsconfig paths）：

```ts
// scripts/_find_char.mts —— 跑：npx tsx scripts/_find_char.mts
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
const db = getFirestore();
const snap = await db.collection(COL.characters).get();
for (const d of snap.docs) {
  const c = d.data() as { name: string; status: string; knowledgeChunkCount?: number };
  console.log(`id=${d.id} name=${c.name} status=${c.status} kChunks=${c.knowledgeChunkCount ?? 0}`);
}
```

> ⚠️ 開頭那段 env 迴圈**每個腳本都要帶**：`FIREBASE_SERVICE_ACCOUNT_JSON` 外層引號內含未跳脫引號，Node `--env-file` 會在第二個引號截斷炸 JSON.parse，**不能用 --env-file**。

## STEP 2：取得素材

- **公開經典**：維基文庫抓，**不憑記憶默寫**（記憶會說謊，經典也一樣）：
  ```bash
  curl -s "https://zh.wikisource.org/w/api.php?action=parse&page=<URL編碼書名>&prop=wikitext&format=json&formatversion=2"
  ```
  清掉 wiki 標記（`{{...}}`、`[[wikipedia:...|x]]` 留 x、`== 章節 ==` 可保留當段落界）。
- **URL**：抓正文，去頁眉頁尾廣告。
- **私有內容**：只用 Adam 提供的，不自己去找。
- **檢查**：中英混雜（英譯不算「本人原話」）→ 問 Adam 要不要拆；簡體 → 問要不要轉繁。單次上限 20 萬字，超過分多份入庫。

## STEP 3：入庫（先問 Adam 給誰做）

**路徑 A**：Adam 自己在後台 `/admin/knowledge` 貼——選角色→填標題/類型/權威度/出處→貼內容→入庫。量少首選。

**路徑 B**：我代辦，臨時腳本（原碼經孫武案實戰）：

```ts
// scripts/_ingest.mts —— 跑：npx tsx scripts/_ingest.mts
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
const { ingestKnowledgeDoc } = await import('../src/lib/knowledge');
const { getAnthropicClient } = await import('../src/lib/anthropic-via-bridge');
const db = getFirestore();
const client = getAnthropicClient(process.env.ANTHROPIC_API_KEY || ''); // env 無 key → 自動走 bridge 吃到飽

const r = await ingestKnowledgeDoc(db, '<角色id>', {
  title: '<書名>',
  docType: 'book',            // book/article/talk/interview/note
  authority: 'canonical',     // Adam 定的：canonical/paraphrase/derived
  sourceRef: '<出處說明>',
  content: readFileSync('<素材檔路徑>', 'utf8'),
}, client);                   // ← client 必傳！不傳就沒有白話大意索引，文言/專業語料檢索會癱
console.log(`入庫 ${r.documentId}，${r.chunkCount} 塊`);
```

## STEP 4：驗收三件套（不跑不算完成——天條：宣告修好前先定鑑別信號）

```ts
// scripts/_verify.mts（接在同一支腳本後面也行）
const { loadKnowledgeBlock } = await import('../src/lib/knowledge');
const charSnap = await db.collection('characters').doc('<角色id>').get();
const char = charSnap.data() as { knowledgeChunkCount?: number };

// ① 完整度：挑 3-5 句素材裡的關鍵句，確認都在庫
const cs = await db.collection('knowledge_chunks').where('characterId', '==', '<角色id>').get();
const corpus = cs.docs.map(d => (d.data() as { content: string }).content).join('\n');
console.log(corpus.includes('<關鍵句1>') ? '✅ 關鍵句1' : '❌ 缺');

// ② 無 gist 塊必須 = 0（gist 批次會靜默 fallback，必須點名）
const noGist = cs.docs.filter(d => !(d.data() as { gist?: string }).gist).length;
console.log(`無 gist：${noGist}（必須 0）`);

// ③ 檢索三題：白話問寫過的→命中；域外題→空字串；逐字引原句→命中
console.log(await loadKnowledgeBlock(db, '<角色id>', '<白話問一個他寫過的主張>', char));
console.log((await loadKnowledgeBlock(db, '<角色id>', '你覺得加密貨幣投資怎麼樣？', char)) === '' ? '✅ 域外空手' : '❌ 漏水');
```

三題全過才對 Adam 說「完成」。有一題不過就照雷區清單排查，不硬報。

## 雷區清單（每顆都流過血）

1. **`--env-file` 不能用**（SA JSON 引號雷）→ 腳本自帶 raw 解析迴圈。
2. **Firestore doc id 不能用 `__x__` 格式**（保留字，測試 id 用 `zhu-verify-xxx-tmp`）。
3. **client 不傳 = 沒有 gist 索引**：文言/古典/專業語料的白話檢索會癱（孫子兵法目標塊曾排 #15）。
4. **gist 批次會靜默失敗**（模型格式漂移已有程式級寬容解析接住，但仍要驗「無 gist = 0」）。
5. **臨時腳本用 `scripts/_` 前綴、用完即刪**——`scripts/` 會被 `next build` 型別檢查，殘留壞腳本會弄爆部署。
6. **門檻不要亂調**：τ=0.68、lex rescue=0.25、TRIGGER_FLOOR=0.70 都是量過真實 cosine 分佈定的（`text-multilingual-embedding-002`）。覺得漏 → 先寫 calibration 腳本印分佈，再談調。
7. **memories 用的是另一顆模型（text-embedding-004）**，兩池不互通，別想共用向量。
8. **開發不燒付費 key**：LLM 一律 `getAnthropicClient`（bridge 吃到飽）；bridge 壞了回報 Adam，不切直連。
9. **gist 批次模型會「反問」而非回 JSON**（批內是含多子項的總覽段時，模型問「要濃縮成一條還是分項各寫？」）——寬容解析接不住反問，照樣 fallback。修法：入庫後跑「無 gist 塊」掃描，單塊重跑並在 prompt 加「不要反問、不要解釋，直接給大意」（Tracy 工具包案，2026-07-10）。
10. **狀態尾巴會被內容頭稀釋**（莊子案 2026-07-22）：gist 寫成「故事摘要＋結尾一句針對狀態」時，embedding 重心落在敘事語域，狀態句幾乎逐字對上 query 也排 #100。修法＝翻轉配比（處境 2/3 先行＋故事錨 1/3）。
11. **混合狀態考題會被最強語域劫持**：「我學這些沒有用」的「學」壓過「有用」，撈到學-主題塊（且是正當命中，庫內多入口）。考題一題只考一個狀態；混合句測出來的不是庫壞，是題目貼錯標籤。
12. **維基文庫三雷**：異體字錨句（用「爲」不用「為」，錨句先 grep 原文驗證）；API 限速要 2s 間隔＋指數退避＋斷點續傳；罕用字 `<span title="...">X</span>` 剝殼取內文 X。
13. **gist 200 字上限會砍尾**：狀態句通常在尾巴，被砍＝時機地址蒸發。生成 prompt 硬限 140-160 字，入庫前掃 `length ≥ 195` 的塊重生。
14. **長批次 bridge 生成必斷點續傳**：逐批落盤 JSON、重跑跳過已完成批——bg 任務 600s timeout 砍了也不丟工。
15. **`ingestKnowledgeDoc()` 沒有查重保護**（不像方法論入庫有 dup 檢查）：多份文件連續入庫若撞 Bash 5 分鐘逾時，**絕對不能猜「應該還沒跑完」就整段重跑**——會產生重複 chunk。逾時後第一動作是查 Firestore 現況（`knowledge_docs.where('characterId','==',id).get()` 印已有標題），只補缺的那幾份再繼續。批次規模建議先切 6-8 份一組，別一次排 20+ 份賭時間（2026-08-04 Mars 案：13 份×2 角色在 22/26 份時逾時死亡，查現況後補剩 4 份完成）。
16. **.docx 素材 Read 工具讀不了**（二進位檔會直接報錯），改用 python 手動解 `word/document.xml`：
    ```bash
    python3 -c "
    import zipfile
    from xml.etree import ElementTree as ET
    z = zipfile.ZipFile('<docx 路徑>')
    xml = z.read('word/document.xml')
    ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    root = ET.fromstring(xml)
    for p in root.iter(ns + 'p'):
        print(''.join(t.text or '' for t in p.findall('.//' + ns + 't')))
    " > extracted.txt
    ```
17. **名字聽起來不確定是不是同一人／同一角色 → 先跑 STEP 1 查角色 id 腳本，不要用記憶/grep 猜**。2026-08-04 曾把兩個真實存在、定位不同的角色（Dr.Mars／Mars）誤判成「可能是同一件事講兩次」，繞了一輪才被導回查資料庫——腳本半小時前才跑過卻沒反射性重用。詳見 `ailivex-methodology-cocreate.md` STEP 0 的展開說明。

## 收尾

- 對 Adam 回報：角色、幾份文件幾塊、驗收三題結果、（若有）沒過的題和原因。
- 刪光 `scripts/_*.mts` 臨時腳本。
- 有新雷 → 補進本檔雷區清單並 commit zhu-core。
