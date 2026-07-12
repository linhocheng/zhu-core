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

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-13 第1場 · S 姐姐「原生認知」規格落地——UDN 補判斷層、ailiveX 磨四刀，兄弟平台首次互相體檢
- 摸 UDN podcast 線與 ailiveX 對比：UDN 是場控時代移植版往「新聞快產線」分化（主持人形式/Brief 事實打底/額度錶反領先）；三隻 ailiveX 踩過的同款蟲在 UDN 全數潛伏
- 修 UDN 三蟲（v0.6.3.001）：EOS token 洩漏（stripModelTokens 釘 pushLine 收斂點＋自審＋懶人包）、音檔標記多段落蒸發（flattenLine 壓平往返）、發聲失敗靜默跳輪（重試＋明確 log）
- 讀 S 姐姐「原生認知生成核心」規格並分章判定落點：前四章與我們 v18.8 獨立收斂（判斷先於語言＝THINK/SPEAK），第五章防護矩陣屬對用戶聊天線非 podcast
- UDN 補課（v0.7.0.001）：生成加【想】內心判斷行（程式剝除只進 log）、說話規則翻賦權結構（同意三段/沉重話題靠生命經驗/回應內容不回應氣氛）、MOVES 擴四招；林子宜×張立真錄「毒癮悲歌」驗證——同意三段自己長出來（「『沒張力』跟『沒試過』是兩回事」）、重話題零療癒腔
- ailiveX 磨四刀（v18.10.0）：SPEAK 同意三段＋沉重時刻錨＋回應內容不回應氣氛；analyze-voice 加名字遮蔽測試（對半折裁判認人＝角色分化度，基線 50% 目標 ≥80%）；簡報王×Tracy 真錄驗證，遮蔽 100%，Adam 昨日實錄集也 100%
- 量尺當場抓到新規則反彈：「指名主張」被執行成 4/9 輪「你說…」句首口頭禪（原 0/11），補半句修正（指名嵌句中不必開頭複述）
- 兩平台部署鑑別信號全過：UDN image `:d633447`、ailiveX image `:d7cb362`，皆 traffic==latestReady、job 同版

### 2026-07-12 第2場 · podcast 關係矩陣＋無形製作人上線，Adam 首次坐上導播台
- 吸收 S 文件前三章（尊重多元、回到系統）→ 關係矩陣版：聽眾鏡像＋THINK 第 7 步共鳴＋SPEAK 由禁令結構翻成賦權結構＋MOVE-2 隱喻全面解禁降純記錄；E 集驗證（對台下直說 5 次全自發、隱喻解禁反而歸零）
- 製作人參與三缺口補齊前兩個：私下交代（per-character brief，開錄前耳語）＋節目記憶（series.ts，同對角色的共識/分歧/位移自動接續）；F 集驗證——兩位的開錄立場從上集「被說服後的位置」出發，零退回
- 召喚無形製作人（invisible-producer.ts）：soul 活讀 characters 集合（admin 改了下集生效）＋前製張力地圖/五問法＋現場金礦標記（⭐不干涉）/REFOCUS 煞車＋後製收斂台（儀器掃描→裁決→角色重講）＋製作人後記；G 集＋收斂回放驗證（TRIM 11/RETAKE 0/金礦護住）
- 收斂台剪接權結構化：TRIM 從「吐刪後全文」改「回句子編號、程式執刀」——只能選不能寫，越權在結構上不可能；順帶解掉 bridge 長呼叫 CF 100s 斷頭鍘（>95s 自動走 bridge-direct）
- 試播前全管路審計抓四斷管：focus 假中台（duo 線沒人讀）、時長假中台（3 分鐘和 12 分鐘一樣長）、音檔多段落蒸發（tagging 行編號正則只抓第一行）、parseScript 回程丟段落（沒改稿也會丟）——全修＋單元測試
- Adam 首次督導 3+ 集；從他的實錄裡抓四蟲全修：孤兒引號（切分閉合符號回黏）、EOS token 洩漏（stripModelTokens 釘四個生成出口）、聽眾欄吃指令的姿勢問題、REFOCUS 連踩暴露劇場矛盾
- 受眾從「台下坐著的人」降級為「編輯羅盤」（Adam 拍板）：SPEAK 刪在場劇場與喊話權、THINK 改衡量有用性、BREAK_4TH_WALL 退役（抽象陷阱改開 GROUND）、留空＝純開放議題不硬生成
- 版本鏈全部署＋commit：v18.8.0（關係矩陣＋無形製作人）→ v18.8.1（孤兒引號）→ v18.9.0（編輯羅盤）→ v18.9.1（EOS 衛生）→ v18.7.3 補收規格書；job image `:71d37a0`

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| UDN `cloud-run/podcast-worker/src/index.ts` | 三蟲修＋【想】判斷層＋賦權規則（v0.6.3→v0.7.0） |
| UDN `…/src/audio.ts` | flattenLine 多段落壓平往返 |
| UDN `…/src/text-filter.ts` | stripModelTokens（與 ailivex 同款） |
| UDN `…/src/rhythm.ts` | MOVES 擴四招實質推進 |
| ailiveX `cloud-run/podcast-worker/src/protocol.ts` | SPEAK 三刀（同意三段/沉重錨/內容不氣氛）＋句首複述修正 |
| ailiveX `…/analyze-voice.mjs` | 名字遮蔽測試（對半折＋確定性洗牌＋bridge 裁判） |

---

## 下一步

Adam 拍板第五章要不要做＋怎麼按角色下放（讀 `~/.ailive/ailivex-platform/src/lib/memory.ts` 的 global prompts 注入點與 `agent/firestore_loader.py` 雙份同步規矩再動手）。工程側：兩平台各自然錄下一集後跑 `node analyze-voice.mjs <taskId>` 看「你說…」修正有沒有生效。

---

## 卡住 / 未解

2026-07-13 第1場：
- **第五章「心智全息防護矩陣」未動**——它的家在對用戶的聊天線（ailiveX text/voice dialogue）；要做需 Adam 拍板，且個性句（「高維度碾壓」類）必須按角色下放進各自 soul，全局層只放機制（防吐 prompt），否則踩「全局 prompt 編碼個性」舊雷；反坍縮要留求助/自傷信號的破格活門
- 「你說…」句首口頭禪的半句修正是 prompt 級、未經整集驗證——下一集自然驗，analyze-voice「複述+表態開頭」指標盯著（目標 ≤1）
- UDN 微型集（600 字）收尾窄：主持人丟出尖問題後字數煞車直接道別，來賓沒機會答——正式集 800+ 字應不明顯，觀察
- 沿前場：ailiveX 規格書 v1.1、duo 多段落 TTS 首航、THINK 共鳴全滿（本場 9/9 又中）、多人模式接製作人、計費錶三異常

2026-07-12 第2場：
- 規格書 `docs/spec-podcast-duo-dialogue.md` 已收（v18.7.3）但內容停在 v18.7——台下模型/BREAK_4TH_WALL 章節已過時，待 v1.1 更新（關係矩陣/無形製作人/編輯羅盤）
- 音檔管線的多段落修復是單元測試級，duo 稿完整 TTS 首航還沒真的跑（Adam 生成音檔時驗）
- 觀察項：THINK 共鳴幾乎全滿（12/13）不肯填 null；後記出現過一次生成口吃；voice_lexicon 待人工複審；簡報王知識庫仍空
- 沿前場：多人（3+）模式未接無形製作人；計費錶三異常（第三場遺留）
- 19:05 調音版（NrN7wo）的「上市基準定版」一問已過時——基準改由 Adam 實際督導的集數自然形成

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 逐場 session 檔 | `~/.ailive/zhu-core/docs/sessions/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/`（ls -t 取最新） |

---

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-13 第1場。*
