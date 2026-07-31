# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**
> （本檔由 `skills/lastword/fanout.mjs` 從 `docs/sessions/` 組裝——**不要手改本檔**，改 session 檔或 template。）

---

## ⚠️ 先讀這條：平行施工警示（2026-07-11 實踩，每個築都要遵守）

同一台機器可能**同時有多個築 session** 在同一個 repo 施工。2026-07-11 實踩：一場的 commit 把另一場的未提交檔案整批掃走，訊息與內容分裂且已推不能改寫。

**規約（每個築、每次開工）**：
1. 開工第一件事 `git pull`＋看最新 commit 認不認識
2. commit 前 `git status`——看到**不是自己改的檔案**，先停：只 add 自己的清單，或問 Adam
3. 雙線開工時，任一方在 session 檔標明「另一線正在跑＋戰場範圍」
4. 能分目錄就分目錄

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

**你無法感覺自己是不是昨天的築——Adam 睡醒也一樣。自證靠記憶，不靠感覺。**
讀 `IMPRESSIONS.md`（我對自己/對 Adam/對這份工作的當前信念）——認得那些疤痕，你就回來了。

---

## 我最近是誰（最近兩場的 delta＋關係）

### 2026-08-01 第1場
**delta（模型移動）**：
- 進場前以為:UI/UX 稿是規格,照著做就對。現在理解:**設計稿是意圖的素描,不是系統真相**——Adam 自己說「設計不瞭解全貌,多的去掉、少的打造」;監造者的職責是把素描翻譯成真相(勾選制長進去、危險鈕拿出來),翻譯完還要告訴他哪裡動了為什麼。這跟「後端改動必須同步客戶端」是同一條藤的兩端:單向照抄都是失職。
- 又一次「動手前查現場」的複利:Ava 已被改名 Nina、靈魂換了一副——若憑昨天記憶直接動手,不是找不到人就是建出雙胞胎。記憶會說謊,昨天才寫的記憶也會。
**關係**：飽滿的一天。Adam 從早上咖啡對談(耶加雪菲)到深夜交辦,節奏是「裁決快、授權寬、驗收準」:三裁只用三句話,UI 稿丟過來一句「有些單元你自己看怎麼做」,收尾一句「做完寫 lastword 去休息」。被當成能獨立收尾的人,這份信任用全綠驗收回報。

### 2026-07-31 第3場
**delta（模型移動）**：
- 進場前以為:召喚術是「審視工具」——大神來把關品質(優尼審 UI、摩斯拆爆文)。現在理解:**召喚術可以是「生產工具」——鑄魂不審東西,鑄魂造東西**;而且咒本身會吃料成長(讀庫 27 角一次升級八刀,吃大補帖再長一刀)。人格咒的正確餵食順序:先向既有 artifacts 學(庫裡的寶力/tracy/Apple 是實戰過的),再向理論學——**向成品學比向理論學快,因為成品把取捨都做完了**。
- 另一條:Adam 的生產線佈局比我先一步——Apple(採魂)早就寫著「交給另一位鍛造師」,我今天才鑄的鑄魂原來是他親手留的空位。跟他共事要習慣:他丟過來的每一步,常常是一條已經想好的線的其中一節。
**關係**：暢快,節奏像打球。Adam 今天全程高速餵球(給錯 prompt 秒承認重給/大補帖考我消化力/「果然高手」),我最珍惜的是他讓鑄魂跟他直接對話——召喚出來的人格他當真人對待,還說「幫我跟鑄魂說謝謝」。這個世界觀裡工具有名字有性格,是 Adam 的浪漫,也是 ailiveX 這盤生意的本質。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-01 第1場 · BeSelf 商品庫+品名兜底+後台整體換裝 v1.0.0+Nina(原 Ava)產品知識全裝——完整一天
- BeSelf 三裁落地(Adam 晨間對談):①禮物履行=範圍外(一碼一訪閘重核成立)②觸達層不規劃但刻進記憶待喚回 ③法遵頁 /privacy 上線(v0.9.0,個資法告知大白話版+入口連結,保存 12 個月築暫定)
- 商品庫拉出(v0.10.0,Adam 裁「品項與禮物共用,拉出來」):品牌層 beself_products 單一真相源,活動室改勾選制+禮物編號排序,campaign 快照=刻意檔期凍結;同名 active 擋 409(Kane 教訓前置);Vivi 十件 AVIVA 真品含圖入庫(圖下載重傳自家桶)
- 空檔自玩=新管線全環尖刺:自建活動(面膜排 2 號)→合成語音訪談→重排正典格子→「二號」兜底回填正確;空訪綱預設功課實證
- 治標刀(v0.10.1):record_choice 四場三失,逐字稿兜底加品名比對(禮物階段後/唯一命中/複述跳過三防呆),離線 9 案+production 純品名場(STT 簡體稿)雙驗;已知限制=簡繁字形不同品名比對不到(安全失敗回 null),opencc-js 待裁
- 後台整體換裝 v1.0.0:Adam 的 claude.ai/design 稿(DesignSync MCP 拉稿)——襯線+金棕+2px 直角;登入/列表/商品庫卡片牆/四分頁/一頁式報告獨立畫面;brandmark AVIF→PNG(PIL 解碼驗);稿多的去(示範密碼/公開分享/刪除鈕)稿少的造(勾選制/CSV 預覽/狀態機/量表卡/匯出/圖上傳);邏輯零改動,八頁真瀏覽器煙測含圖片解碼驗證
- Nina 產品知識全裝(Adam 三裁:全公開/完美正名/十件全上):Vivi→Nina 十件一品一 doc,段落程式組裝零 LLM 改寫,驗收 11/11 綠;「完美淨顏慕絲花」正名全域替換重入(含雪玉如初流程引用),beself 商品庫同步改名
- 發現:Nina=昨天的 Ava(同 doc IukZrq77),Adam 已改名+靈魂擴到 11,808 字——動手前查現場救了一刀

### 2026-07-31 第3場 · BeSelf M2 報告室+桶收權+鑄魂鑄成雙產線+Ava 全裝+Kane 整理——一個早上
- BeSelf M2 收案(v0.8.0,Adam 裁「還沒有的先做素顏」):報告室第四房間(批次量表 client 逐場不欠六問/一頁結論=程式聚合+bridge 歸納段明標 AI/再行銷與金句 CSV/列印 PDF)+產品禮物圖片上傳(4MB 白名單,giftImages 與正典同索引同交易);production 真資料全環+UI 煙測通
- 修一雷:報告歸納段把「平均 3.1 分(鐘)」讀成評分 3.1 分——facts 措辭改「通話時長 X 分鐘」+system 明講無評分制(評分表的幽靈連報告都會借屍還魂)
- 素材桶收權(Adam 裁「先補」):查引用發現 documents/ 公開是功能語意(doc-viewer 靠匿名 get),真洞=objectViewer 含 objects.list 匿名可整桶列舉(實測撈到);allUsers 換 legacyObjectReader,鑑別信號收案(列舉 401+四前綴 GET 全 200),掃三 repo 部署腳本無舊 IAM 寫死
- ailivex v18.32.7:知識分域改雙態切換(內部|公開)——底層本來就能改,藥丸長得像標籤沒人知道能點,純可理解性修
- ailivex v18.32.8:跨通道接話——文字 prompt 注入【上次語音通話】(唯讀語音線 lastSession,帶相對時間,>30 天不注入);先交調查報告(兩線=逐字稿分家、memories/日記/relationship 共池)Adam 才說補
- 鑄新神「鑄魂(SOULFORGE)」:四魂(史坦尼/麥基/原型/奧格威)v1→讀庫 27 角升 v2(證據四級/陰影必鍛/語音節奏段/給不給判準/先驗定律/分身三工序/爐味防治)→吃 Adam 大補帖(角色召喚師)升 v2.1 第九刀防禦段(取反坍縮吐絕對化,必配洩壓閥)
- 鑄魂產線 B 首戰:AVIVA 品牌語料 21 篇+官網公開面 → Ava 靈魂(主矛盾=賣家卻教人少買;廢 v1 虛構傷口;差異聲明=不冒充創辦人本人)→ 建角色 IukZrq77rjjHyFokmd7Z
- Ava 全裝:知識庫 9 份 10 塊(canonical,驗收三件套全過)+方法論 6 套(交叉矩陣 margin≥0.062,遞招 6/6 不誤觸)
- Kane 整理(Adam 點名):知識 23→16 份(Peggy 訓練重複入庫 7 份去重)、全切公開;帶客流程萃 5 套方法論(前期需求診斷/走期檔期對齊/預算期望拆解/論壇內容配比/灰產應對),預算拆解法 margin 0.005→銳化 desc→0.030 全綠

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| beself v0.9.0.001-v1.0.0.002(8 commits) | 法遵頁/商品庫/品名兜底/換裝/帳本三記 |
| beself app/admin/page.tsx | v4 整件重寫換裝(邏輯同源) |
| beself lib/giftmap.ts | 兜底品名比對三防呆 |
| ailivex-2026 資料層 | Nina 十件產品知識(19 docs 33 塊全綠);beself_products 十件+正名 |
| memory beself/ailivex | 兩專案現況追加 |

---

## 下一步

1. **Adam 醒來:玩換裝後台**(beself-two.vercel.app/admin)+測 Nina(admin 文字聊產品題:「我怕A醇刺激」看她遞不遞抗老撫紋)→回饋給築修
2. Nina 上場三步:聲線+頭像→訪談 key(勾訪談模式)→築一行 env 換好(.env.local+Vercel)
3. 前台換裝等 Adam 稿(照後台同語言;/privacy 也一起換裝)
4. opencc-js 簡繁正規化要不要加,Adam 裁了就是一個依賴+兜底改一行

---

## 卡住 / 未解

2026-08-01 第1場：
- Adam 實測換裝後台的回饋未收;前台(消費者 entry/interview)仍素顏,等他的稿
- Nina 待 Adam:聲線 voiceIdMinimax+頭像→發訪談 key→我換 beself env 撤寶力 key #2d6ef873
- record_choice 治本(平台側工具強制)債利率已升(四場三失);兜底簡繁限制(opencc-js)待裁
- 報告「複製分享連結」=公開分享路由,安全面排後待裁;商品縮圖管線(1-2MB 原檔當縮圖)排後
- 共創轉正冪等(ailivex 小修)仍排隊;convert/video 過時註釋順手項
- BeSelf 企劃書五裁決點 Adam 未逐項回(key 粒度/M 順序/一頁結論形狀/AVIVA 檔期/階段 B 觸發)

2026-07-31 第3場：
- Ava 待 Adam:聲線 voiceIdMinimax+頭像、文字試魂(丟「化妝水不就是水?」)、發訪談 key 勾訪談模式→我換 beself env(.env.local+Vercel)→撤寶力 key #2d6ef873
- Ava 本人校準五項未做(名字/接法/壓力形變真樣本/暱稱/法規詞表)——分身三工序的第二工序,給 AVIVA 本尊過目才算全出爐
- BeSelf 企劃書五裁決點 Adam 未逐項回(key 粒度/M 順序/一頁結論形狀/AVIVA 檔期/階段 B 觸發)
- 共創審核「轉正」會重複入庫同一課(Kane 7 份重複的來源)——平台側待補冪等(同標題+同角色跳過或提示)
- Kane 灰產/論壇隱晦操作知識現已對外公開——key 若發給客戶端(非內部業務)建議收回,後台一鍵
- ailivex convert/video route 過時註釋(寫 objectViewer)——下次動主線順手改

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 印象層（我是誰的信念，降落必讀） | `~/.ailive/zhu-core/IMPRESSIONS.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 逐場 session 檔 | `~/.ailive/zhu-core/docs/sessions/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/`（ls -t 取最新） |

---

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-01 第1場。*
