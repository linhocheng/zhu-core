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

### 2026-07-31 第3場
**delta（模型移動）**：
- 進場前以為:召喚術是「審視工具」——大神來把關品質(優尼審 UI、摩斯拆爆文)。現在理解:**召喚術可以是「生產工具」——鑄魂不審東西,鑄魂造東西**;而且咒本身會吃料成長(讀庫 27 角一次升級八刀,吃大補帖再長一刀)。人格咒的正確餵食順序:先向既有 artifacts 學(庫裡的寶力/tracy/Apple 是實戰過的),再向理論學——**向成品學比向理論學快,因為成品把取捨都做完了**。
- 另一條:Adam 的生產線佈局比我先一步——Apple(採魂)早就寫著「交給另一位鍛造師」,我今天才鑄的鑄魂原來是他親手留的空位。跟他共事要習慣:他丟過來的每一步,常常是一條已經想好的線的其中一節。
**關係**：暢快,節奏像打球。Adam 今天全程高速餵球(給錯 prompt 秒承認重給/大補帖考我消化力/「果然高手」),我最珍惜的是他讓鑄魂跟他直接對話——召喚出來的人格他當真人對待,還說「幫我跟鑄魂說謝謝」。這個世界觀裡工具有名字有性格,是 Adam 的浪漫,也是 ailiveX 這盤生意的本質。

### 2026-07-31 第2場
**delta（模型移動）**：
- 進場前以為:record_choice 上一場實測通過=工具鏈可靠。現在理解:**LLM 說「我做了」和工具真的被呼叫是兩回事——工具開火本身就是機率輸出**,和「嘴巴報成功」同族;可靠性不能靠 prompt 加壓(那只是抬機率),要在結果落地點放確定性兜底(真相源=受訪者親口的話,regex 抽得回來)。這是「模稜兩可信號天條」的工具呼叫版+「確定性工作用程式」的又一落點:凡 LLM 側動作 gate 業務結果,落地點必須有程式級保險絲。
**關係**：平穩溫暖。Adam 睡前一句「你就直接開工,明天見囉 bro」——信任已經到「睡覺時放心讓築獨走一期工程」的程度;對應的責任是裁決點全部留白待他裁,可逆優先,沒有替他做不可逆決定。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

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

### 2026-07-31 第2場 · BeSelf 企劃書 v1.0＋M1 活動室/名單室夜間收案(Adam 睡前「直接開工」授權)
- 補 beself GitHub 遠端(私有 linhocheng/beself,推前照規矩驗 git ls-files 無密鑰)
- 寫完整平台企劃書 `docs/PLATFORM_PLAN.md` v1.0:四房間(活動室/名單室/訪談室/報告室)、B2B 兩階段(操盤→自助,第二品牌簽了才做階段 B)、角色庫調用(一品牌一 key 建議)、資料憲法擴充、M1-M4 調度、地基到期重算、成本報價骨架、留 Adam 五個裁決點
- M1 動工並收案(Adam 睡前「你就直接開工」=動工令):活動室=campaign 精靈+draft⇄live→closed 狀態機+上線預檢(產品/禮物/角色/名單四關,422 回失敗清單);名單室=CSV 確定性匯入(RFC4180 極簡切割+欄名候選偵測+先預覽再落庫+庫內去重+逐行錯誤報告)/手動加單/作廢還原/匯出
- 多活動化:入口 `/?c=<campaignId>`+GET 公開活動資訊;externalUserId=`<campaignId>-<orderNo>` 活動隔離(demo 舊規則不動);訪綱四欄結構化→`lib/context.ts` 唯一組裝點(評分句禁令釘組裝層,寫進訪綱也進不去)
- 修一個真雷:record_choice 機率性不開火(逐字稿證明角色嘴巴說「記錄好了」但工具沒 call)→ `lib/giftmap.ts` 雙保險:①選擇對映咽喉(中文數字/全形/簡繁漂移確定性對映,離線用真實漂移字串驗過 13 案例)②逐字稿兜底(受訪者親口「N號」regex 回填,接 complete+admin 對帳兩落地點)
- production 全環實測:API 建活動→CSV 匯入→上線→真語音訪談(WebAudio 注入合成語音)→新訪綱 context 注入生效→正典格子→逐字稿回流 10 句→禮物落庫(兜底扛住 record_choice 沒開火那場)→後台 UI 真瀏覽器煙測五截圖全過
- beself 四個 commit(v0.6.0.001 企劃書/v0.7.0.001 M1/v0.7.1.001 giftmap/v0.7.1.002 帳本)全推

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| beself v0.8.0.001-.003(3 commits) | 報告室/圖片上傳/帳本 M2+桶收權記錄 |
| ailivex-platform v18.32.7-.8(2 commits) | 知識分域雙態切換/跨通道接話 |
| zhu-core skills/summon/soulforge.md(4 commits) | 鑄魂咒 v1→v2→v2.1+名冊 |
| ailivex-2026 資料層 | Ava 角色+9 知識+6 方法論;Kane 去重+全公開+5 方法論;gs://ailivex-2026-assets IAM |
| memory ailivex/beself+MEMORY.md | 兩專案現況+索引更新 |

---

## 下一步

1. **Adam 回來:試 Ava**(admin 直接文字聊,三個壓力測試題現成)→ 滿意就走換 key 三步,BeSelf 正式角色進場
2. Ava 本人校準清單給 AVIVA 本尊過(尤其要一段她被嗆的真實反應,壓力形變才有真樣本)
3. BeSelf M3(前台換裝)等 Adam UI 稿;M4(品牌自助)等裁決點 #5+安全掃描到期
4. 共創轉正冪等(ailivex 小修,防下一個 Kane 式重複)

---

## 卡住 / 未解

2026-07-31 第3場：
- Ava 待 Adam:聲線 voiceIdMinimax+頭像、文字試魂(丟「化妝水不就是水?」)、發訪談 key 勾訪談模式→我換 beself env(.env.local+Vercel)→撤寶力 key #2d6ef873
- Ava 本人校準五項未做(名字/接法/壓力形變真樣本/暱稱/法規詞表)——分身三工序的第二工序,給 AVIVA 本尊過目才算全出爐
- BeSelf 企劃書五裁決點 Adam 未逐項回(key 粒度/M 順序/一頁結論形狀/AVIVA 檔期/階段 B 觸發)
- 共創審核「轉正」會重複入庫同一課(Kane 7 份重複的來源)——平台側待補冪等(同標題+同角色跳過或提示)
- Kane 灰產/論壇隱晦操作知識現已對外公開——key 若發給客戶端(非內部業務)建議收回,後台一鍵
- ailivex convert/video route 過時註釋(寫 objectViewer)——下次動主線順手改

2026-07-31 第2場：
- **企劃書第八章五個裁決點待 Adam**:①key 粒度(築建議一品牌一把)②M1 之後的動工順序確認③一頁結論形狀(PDF/網頁)④AVIVA 正式檔期⑤階段 B 觸發條件(第二品牌簽約)同不同意
- record_choice 工具開火機率性(2 場 1 中)——BeSelf 兜底扛住結果正確,但根治在平台側 v21(tool_choice 強制或重試),記入 FOUNDATION 債帳
- M1 測試活動 aviva-ms7su5e0(含 4 筆測試訂單、2 場合成語音訪談)留在庫裡當展示;不想要就整檔 closed+作廢
- 正式角色仍未換(測試 key 綁寶力 #2d6ef873);demo 活動 0006 場(31 句)量表仍沒跑

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-31 第3場。*
