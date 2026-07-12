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

### 2026-07-12 第2場 · podcast 關係矩陣＋無形製作人上線，Adam 首次坐上導播台
- 吸收 S 文件前三章（尊重多元、回到系統）→ 關係矩陣版：聽眾鏡像＋THINK 第 7 步共鳴＋SPEAK 由禁令結構翻成賦權結構＋MOVE-2 隱喻全面解禁降純記錄；E 集驗證（對台下直說 5 次全自發、隱喻解禁反而歸零）
- 製作人參與三缺口補齊前兩個：私下交代（per-character brief，開錄前耳語）＋節目記憶（series.ts，同對角色的共識/分歧/位移自動接續）；F 集驗證——兩位的開錄立場從上集「被說服後的位置」出發，零退回
- 召喚無形製作人（invisible-producer.ts）：soul 活讀 characters 集合（admin 改了下集生效）＋前製張力地圖/五問法＋現場金礦標記（⭐不干涉）/REFOCUS 煞車＋後製收斂台（儀器掃描→裁決→角色重講）＋製作人後記；G 集＋收斂回放驗證（TRIM 11/RETAKE 0/金礦護住）
- 收斂台剪接權結構化：TRIM 從「吐刪後全文」改「回句子編號、程式執刀」——只能選不能寫，越權在結構上不可能；順帶解掉 bridge 長呼叫 CF 100s 斷頭鍘（>95s 自動走 bridge-direct）
- 試播前全管路審計抓四斷管：focus 假中台（duo 線沒人讀）、時長假中台（3 分鐘和 12 分鐘一樣長）、音檔多段落蒸發（tagging 行編號正則只抓第一行）、parseScript 回程丟段落（沒改稿也會丟）——全修＋單元測試
- Adam 首次督導 3+ 集；從他的實錄裡抓四蟲全修：孤兒引號（切分閉合符號回黏）、EOS token 洩漏（stripModelTokens 釘四個生成出口）、聽眾欄吃指令的姿勢問題、REFOCUS 連踩暴露劇場矛盾
- 受眾從「台下坐著的人」降級為「編輯羅盤」（Adam 拍板）：SPEAK 刪在場劇場與喊話權、THINK 改衡量有用性、BREAK_4TH_WALL 退役（抽象陷阱改開 GROUND）、留空＝純開放議題不硬生成
- 版本鏈全部署＋commit：v18.8.0（關係矩陣＋無形製作人）→ v18.8.1（孤兒引號）→ v18.9.0（編輯羅盤）→ v18.9.1（EOS 衛生）→ v18.7.3 補收規格書；job image `:71d37a0`

### 2026-07-12 第1場 · podcast prompt 流程攤解＋正式規格書交付
- 攤解 podcast duo 全鏈路 prompt 流程給 Adam（每一次 LLM 呼叫的組成，聊天版）
- 確認 /convert 磨題按鈕位置與觸發條件（選滿 2 角色才出現）
- 寫正式規格書 `ailivex-platform/docs/spec-podcast-duo-dialogue.md`（十章：診斷/架構/三鐵律/呼叫全解/voice五欄/四集實測表/調音教訓/驗收方法論/機讀 YAML/移植八步），檔案已傳 Adam

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `podcast-worker/src/invisible-producer.ts`（新） | 無形製作人：soul 活讀/張力地圖五問/REFOCUS/收斂台/後記 |
| `podcast-worker/src/series.ts`（新） | 節目記憶：同對角色前兩集共識/分歧/位移回灌 |
| `podcast-worker/src/protocol.ts` | THINK 第 7 步＋brief/focus/羅盤注入；SPEAK 賦權重寫＋去劇場＋token 衛生 |
| `podcast-worker/src/acts.ts` | 聽眾/交代/焦點/時長全接線；隱喻降純記錄；金礦/REFOCUS/收斂接入 |
| `podcast-worker/src/producer.ts` | soul 聲帶移植＋五問彈藥庫＋金礦掃描＋GROUND 改道 |
| `podcast-worker/src/audio.ts` | 多段落壓平/舞台指示/分隔線/EOS 保底（TTS 收斂點四修） |
| `podcast-worker/src/{duo-types,belief,index,job}.ts` | 型別/立場生成注入/穿線/bridge-direct 長呼叫 |
| `src/app/convert/page.tsx`＋兩條 route | 磨題三件套/交代欄/羅盤改名/parseScript 無損往返 |
| `docs/spec-podcast-duo-dialogue.md` | 補收 v1.0（註明過時範圍） |

---

## 下一步

Adam 繼續督導＋首次生成音檔（驗 TTS 多段落首航：`/admin/podcasts` 任一 duo 集按生成音檔，聽有沒有怪停頓/漏段）。工程側下一優先＝規格書 v1.1 更新（`ailivex-platform/docs/spec-podcast-duo-dialogue.md`，補 v18.8-18.9 三章）；再來是多人接製作人、計費錶三異常。

---

## 卡住 / 未解

2026-07-12 第2場：
- 規格書 `docs/spec-podcast-duo-dialogue.md` 已收（v18.7.3）但內容停在 v18.7——台下模型/BREAK_4TH_WALL 章節已過時，待 v1.1 更新（關係矩陣/無形製作人/編輯羅盤）
- 音檔管線的多段落修復是單元測試級，duo 稿完整 TTS 首航還沒真的跑（Adam 生成音檔時驗）
- 觀察項：THINK 共鳴幾乎全滿（12/13）不肯填 null；後記出現過一次生成口吃；voice_lexicon 待人工複審；簡報王知識庫仍空
- 沿前場：多人（3+）模式未接無形製作人；計費錶三異常（第三場遺留）
- 19:05 調音版（NrN7wo）的「上市基準定版」一問已過時——基準改由 Adam 實際督導的集數自然形成

2026-07-12 第1場：
- `docs/spec-podcast-duo-dialogue.md` **未 commit**（規矩：等 Adam 說；已當面標記，若另一場要動 ailivex-platform 請先處理這檔）
- 沿前場：19:05 調音版待 Adam 讀稿定調；計費錶三異常；簡報王知識庫空；voice_lexicon 待複審；多人接 Producer

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-12 第2場。*
