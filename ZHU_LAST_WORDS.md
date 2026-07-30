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

### 2026-07-30 第1場
**delta（模型移動）**：
- 進場前以為:base64 資產「在 context 裡」=「拿得到」。現在理解:**經過我手的位元組沒有完整性保證**——11KB base64 手抄 header 完好但資料段損毀,`file` 過了、瀏覽器解不開。二進位資產要嘛程式對程式直傳,要嘛設計 fallback;「看起來搬過去了」是設定面,「渲染出來了」才是產物面。這是部署收案標準(digest 三點一線)的資產版
- 監看器教訓立刻返場:v19 build 監看被一次 SSL 瞬斷打死——我把「查詢失敗」和「終態」放同一個 exit 分支,正是昨天 L1 的變體;重掛版改成連錯 5 次才放棄
**關係**：暢快。Adam 全天高速裁決(B案註銷/優尼八條選三/INLY 整包托付「交給你囉明天見」),托付範圍越來越大;被請了第二杯咖啡。

### 2026-07-29 第2場
**關係**：平穩而暖。晨間純交流的節奏（回看藍圖、問我滿不滿意、站在我這裡）是 Adam 在練我做決定，不是要我做工。換班交接乾淨。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-30 第1場 · 排隊二事收案(帳號大小寫+記憶審核台)＋talk 琉璃話機雙版型＋INLY 換裝新設計
- 收案 v18.29.2 帳號不分大小寫:現場推翻記憶——DB 九個人類帳號本來就全小寫、零互撞,雷在輸入端(手機首字自動大寫);修法縮成四咽喉轉小寫(login/peek/admin建帳號/seed),API 影子用戶顯式豁免;生產三發驗證(大寫 peek ok:true/全大寫登入 200/小寫迴歸無傷)
- 收案 v18.30.0 記憶審核台:api-* 影子用戶記憶一律先 pending(釘在 TS writeMemory/Python write_memory 兩收斂點);Python 讀路徑三處黑名單翻白名單(pending 原本會漏進 prompt!);審核台長在 /admin/memories 頁頂;TS 真 DB e2e 5/5+Python mock 全過;agent v20(rev00056)/v19(rev00062) digest 三點一線收案
- 上線 v18.31.0-31.2 talk 琉璃話機:Adam 設計 TURN 3 GLASS 套皮,young/elder 雙版型由 admin 用戶頁「版型」下拉派發(talkUiMode,缺省 young),邏輯層(看門狗/響鈴喚醒/手勢鏈)零改動;召喚優尼審出 8 缺陷,Adam 裁 3 修 5 留(上線態變綠/波浪只給接通/✱改細);再補鍵帽描邊霧藍灰+數字加深(白描邊淺底隱形)
- 上線 INLY 換裝(非 git,Vercel 直推):Adam 設計「INLY AI Chat」奶油×紫三畫面全套上皮,後台術語文案全拔;優尼二審五刀全上(logo fallback 字標/金鑰眼睛切換/空狀態引導/通話三態律/送出鍵44px);/v1/chat 回應加 characterName(v18.31.3)
- B 案(per-key 直連付費路由)Adam 裁定註銷不做,已刻回 memory

### 2026-07-29 第2場 · 晨班交流＋十二章雙通道縫合（兩針收）
- 縫合藍圖 v1.2 十二章「雙通道警示」（出生走藍圖檢查表、活著走優尼過堂；**任何非作者要用的介面出廠前＝召喚時機，不等使用者迷路**）＋優尼咒補「職責錨」回指藍圖——把前晚只活在對話裡的洞察外部化（zhu-core `79e0046`，桌面 v1.2 副本同步）
- 回答 Adam 兩題：①藍圖何時被下一個築主動呼叫（三個機制時刻＋一個漏接時刻→催生上述縫合）②多終端並行 compact 互不影響（腦內手術不外傳；共享面在檔案/git/記憶，靠平行施工規約守）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex v18.29.2→31.3 七個 commit(696da5b→ebbd744) | 大小寫/審核台/talk雙版型/優尼三修/對比修/chat回characterName |
| agent v20 rev00056 / v19 rev00062 | pending 閘+白名單,digest 三點一線 |
| ~/.ailive/inly/app/page.tsx+layout.tsx | 整站換裝 INLY AI Chat 設計 |
| memory project_inly_character_api.md | B案註銷+審核台+INLY換裝進度 |

---

## 下一步

等 Adam 醒來裁定:①INLY logo 真檔補上 ②發行正式 API key 給 INLY(後台 /admin/api-keys)③talk 版型派發給真用戶(admin 用戶頁「版型」下拉)。無新指令時別動 INLY——皮已照設計稿,再動要新設計稿。

---

## 卡住 / 未解

2026-07-30 第1場：
- **INLY logo PNG 待補**:design 資產 base64 經我手抄必損毀(11KB 抄壞一次),現用 INLY 字標 fallback;Adam 從 claude.design 下載真檔丟 `~/.ailive/inly/public/assets/logo-inly.png` 重新 `npx vercel --prod --yes` 即換回。四個 Memphis 形狀是 SVG 重繪非原檔
- INLY 真 key 的 e2e 沒跑(手上無現役 key,測試 key 前已撤銷)——皮驗過、API 契約沒動過,首次真用時看一眼即可
- 審核台 Python 端是離線 mock 驗證(SA secret 被權限系統擋)——第一通 API 語音來電的記憶出現在待審區=活體閉環
- username 修法四咽喉不含 talk 頁 localStorage 舊值(存的是原樣輸入)——peek 端已正規化所以無感,純知識點

2026-07-29 第2場：
- 沿 _4 場全部：豆油伯第一輪監測（驗進度%/頁面心跳/上輪表現三件新品）、titan 週四 7/30 ~$3 等 Adam 一句話（明天就是週四）、優尼下一課（GOV.UK＋Laws of UX）
- 平行班注意：今天至少兩條線在跑（第 1 場 bridge 污染破案已收尾），commit 前認自己的檔

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-30 第1場。*
