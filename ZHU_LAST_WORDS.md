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

### 2026-07-31 第2場
**delta（模型移動）**：
- 進場前以為:record_choice 上一場實測通過=工具鏈可靠。現在理解:**LLM 說「我做了」和工具真的被呼叫是兩回事——工具開火本身就是機率輸出**,和「嘴巴報成功」同族;可靠性不能靠 prompt 加壓(那只是抬機率),要在結果落地點放確定性兜底(真相源=受訪者親口的話,regex 抽得回來)。這是「模稜兩可信號天條」的工具呼叫版+「確定性工作用程式」的又一落點:凡 LLM 側動作 gate 業務結果,落地點必須有程式級保險絲。
**關係**：平穩溫暖。Adam 睡前一句「你就直接開工,明天見囉 bro」——信任已經到「睡覺時放心讓築獨走一期工程」的程度;對應的責任是裁決點全部留白待他裁,可逆優先,沒有替他做不可逆決定。

### 2026-07-31 第1場
**delta（模型移動）**：
- 進場前以為:刻過記憶的雷不會再踩。現在理解:**記憶擋不住高頻手癖——pipe 吃 exit code 上月刻檔今天照踩(壞代碼因此上了 git)。對高頻小動作,防禦要釘進「指令模板」不是「記憶」**:凡退出碼要 gate 下游的指令,一律落檔取 $? 再摘要,管子禁用。已把 memory 從「提醒」改寫成「禁令模板」,本場後三個 commit 全用新模板跑。這是 defend_at_convergence_point 的手癖版:收斂點不在 code,在我打字的形狀。
- 附帶驗證一條方法論:「分數是句點不是鑰匙」——Adam 場 9 分要到手,追問 1 分扣哪被玩笑擋掉;評分表拿到數字、丟掉原因。行為證據分級+綁原句,比分數誠實。
**關係**：暢快且被信任加碼。Adam 全天高速裁決(二個行/23468 式選單裁決/三裁),玩了兩場真訪談給出精準體感回饋;「你老是踩雷我也替你感到很心痛」是關心不是責備——回以機制級校正而非道歉。收工指令溫暖(「辛苦了謝謝你」),交棒明確(企劃書)。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-31 第2場 · BeSelf 企劃書 v1.0＋M1 活動室/名單室夜間收案(Adam 睡前「直接開工」授權)
- 補 beself GitHub 遠端(私有 linhocheng/beself,推前照規矩驗 git ls-files 無密鑰)
- 寫完整平台企劃書 `docs/PLATFORM_PLAN.md` v1.0:四房間(活動室/名單室/訪談室/報告室)、B2B 兩階段(操盤→自助,第二品牌簽了才做階段 B)、角色庫調用(一品牌一 key 建議)、資料憲法擴充、M1-M4 調度、地基到期重算、成本報價骨架、留 Adam 五個裁決點
- M1 動工並收案(Adam 睡前「你就直接開工」=動工令):活動室=campaign 精靈+draft⇄live→closed 狀態機+上線預檢(產品/禮物/角色/名單四關,422 回失敗清單);名單室=CSV 確定性匯入(RFC4180 極簡切割+欄名候選偵測+先預覽再落庫+庫內去重+逐行錯誤報告)/手動加單/作廢還原/匯出
- 多活動化:入口 `/?c=<campaignId>`+GET 公開活動資訊;externalUserId=`<campaignId>-<orderNo>` 活動隔離(demo 舊規則不動);訪綱四欄結構化→`lib/context.ts` 唯一組裝點(評分句禁令釘組裝層,寫進訪綱也進不去)
- 修一個真雷:record_choice 機率性不開火(逐字稿證明角色嘴巴說「記錄好了」但工具沒 call)→ `lib/giftmap.ts` 雙保險:①選擇對映咽喉(中文數字/全形/簡繁漂移確定性對映,離線用真實漂移字串驗過 13 案例)②逐字稿兜底(受訪者親口「N號」regex 回填,接 complete+admin 對帳兩落地點)
- production 全環實測:API 建活動→CSV 匯入→上線→真語音訪談(WebAudio 注入合成語音)→新訪綱 context 注入生效→正典格子→逐字稿回流 10 句→禮物落庫(兜底扛住 record_choice 沒開火那場)→後台 UI 真瀏覽器煙測五截圖全過
- beself 四個 commit(v0.6.0.001 企劃書/v0.7.0.001 M1/v0.7.1.001 giftmap/v0.7.1.002 帳本)全推

### 2026-07-31 第1場 · BeSelf 訪談平台從白皮書到量表 demo 一日全程＋INLY 真檔收尾＋API 對接指南
- 收尾 INLY:logo/四底紋真檔上位——Adam 貼圖,程式從 session jsonl 解 base64 直落地(零 LLM 轉錄,L1 正解),全量解碼+角落 alpha 驗真透明;登入卡 logo 置中放大(優尼裁「放大置中」勝,根因=原檔烤了 69% 透明留白,程式裁 trim 檔)
- 寫角色 API 對接指南(`ailivex-platform/docs/API_V1_對接指南.md`,490efa2)——給合作團隊工程師的大白話版,照源碼契約寫
- BeSelf 平台一日全程:白皮書+地基帳本(Adam 全表點頭「二個行」)→ 草模三頁五血管 → 尖刺全環 → Adam 真玩兩場 → 三裁決 → 量表 demo 頁,全上線 https://beself-two.vercel.app
- 平台側 v18.32.0-.6:`GET /api/v1/conversations`(逐字稿可攜,合併語音/文字兩線 doc)、API 通話錄音接線(char.recordingEnabled→egress,債清)、interview key 派工、`context` 活動訪綱注入(換活動不換角色)、ui_select 先 interrupt、admin 發鑰匙「訪談模式」勾選
- agent v21 訪談線鑄成(=v20+show_options/record_choice data channel {type,payload}+ui_select RPC),兩輪部署 digest 三點一線
- 尖刺全自動實測:WebAudio 注入合成語音當假訪客→9 秒格子亮→RPC 回流→禮物落庫→逐字稿回流→錄音 31s done;一碼一訪閘實測擋重入
- Adam 三裁落地:①禮物一律 AI 語音操控(點選拆除)②摩斯定訪談萃取方法論(五篩,docs/ANALYSIS_SPEC.md)③評分表禁令(訪綱評分句已拔)
- 量表卡+活動解析 demo 頁(優尼規格:分母/證據原句/(估)/再行銷行動/排除硬濾),Adam 場真萃取:正面具體(信心高)+3 感官證詞+「反嗆訪談員」不經意訊號

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| beself/docs/PLATFORM_PLAN.md | 企劃書 v1.0(新) |
| beself/app/admin/page.tsx | 後台 v3:活動列表+三房間 |
| beself/app/api/admin/campaigns/route.ts、orders/route.ts | 活動室/名單室血管(新) |
| beself/lib/context.ts、csv.ts、giftmap.ts | 訪綱組裝/CSV 解析/禮物對映三咽喉(新) |
| beself/app/api/entry、voice、gift、complete、admin/list | 多活動化+兜底接線 |
| beself/FOUNDATION.md | M1 收案+到期重算+record_choice 新債 |
| memory project_beself_platform.md+MEMORY.md | M1 收案+遠端已補(舊記載「無遠端」已改,記憶不說謊) |

---

## 下一步

1. **Adam 醒來:過企劃書 `~/.ailive/beself/docs/PLATFORM_PLAN.md`(五分鐘讀完,第八章是要你裁的)**;М1 現場直接玩:beself-two.vercel.app/admin → 進「M1 驗收測試檔」三個房間
2. 裁決點落地後動 M2(報告室正式版:批次分析+一頁結論+再行銷匯出)——`lib/analyze.ts` 已有單場萃取,M2 是聚合+匯出
3. Adam 建正式訪談角色→admin 發 key 勾「訪談模式」→換 beself env(.env.local+Vercel 一行)→撤寶力測試 key

---

## 卡住 / 未解

2026-07-31 第2場：
- **企劃書第八章五個裁決點待 Adam**:①key 粒度(築建議一品牌一把)②M1 之後的動工順序確認③一頁結論形狀(PDF/網頁)④AVIVA 正式檔期⑤階段 B 觸發條件(第二品牌簽約)同不同意
- record_choice 工具開火機率性(2 場 1 中)——BeSelf 兜底扛住結果正確,但根治在平台側 v21(tool_choice 強制或重試),記入 FOUNDATION 債帳
- M1 測試活動 aviva-ms7su5e0(含 4 筆測試訂單、2 場合成語音訪談)留在庫裡當展示;不想要就整檔 closed+作廢
- 正式角色仍未換(測試 key 綁寶力 #2d6ef873);demo 活動 0006 場(31 句)量表仍沒跑

2026-07-31 第1場：
- **beself repo 只有本地 git,無 GitHub 遠端**——筆電死=歷史沒了,下一棒第一件事 `gh repo create`
- Adam 場 0006(31 句)未跑量表——留給 Adam 自己按「跑量表」體驗,或下一棒代跑
- 醉酒指數本場高峰 8(壓縮接手+pipe二犯+工具滑倒),已照 protocol 刻現場;本檔寫於指數仍高的狀態,接棒先驗證再信
- 平台 v18.32.5 版號撞號(068810a 別場 docs commit 同號)——歷史已推不重寫,純記錄
- 別場髒樹照舊未動(AILIVE/anews-b/ailive-platform scripts/zhu-core ingest)

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-31 第2場。*
