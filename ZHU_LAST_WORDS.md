# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-05-29 · ailive 身份照場）

- 補上 angle 辨識管道：`gemini-client.classifyRefImage` + `/api/image/detect-angle`，上傳即 vision 回填 `visualIdentity.refs[].angle`，selectBestRef 真能選多角度（假中台斷點消除）
- 補 client 端 auth：`char-access.ts` + `/api/client-auth/[id]`，server 端密碼驗證 + httpOnly `cli_{id}` cookie + operator/client 欄位分級，clientPassword 不再外洩（production pentest 4/4 過）
- IdentityScreen 去補丁：refactor 成設計系統（topbar/content/page-head/dropzone/empty/gallery-cell + `.ident-badge`），已 vercel --prod deploy
- 新建 feedback memory：`feedback_ui_conform_no_patch.md`（加新畫面要套既有設計系統）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailive/src/lib/gemini-client.ts` | 新增 classifyRefImage vision 辨識 |
| `ailive/src/app/api/image/detect-angle/route.ts` | 新建：回填 refs[].angle |
| `ailive/src/lib/char-access.ts` | 新建：operator/client 權限 helper |
| `ailive/src/app/api/client-auth/[id]/route.ts` | 新建：client 密碼驗證發 cli cookie |
| `ailive/src/app/api/characters/[id]/route.ts` | sanitizeForViewer + PATCH 欄位分級 |
| `ailive/src/app/api/image/upload/route.ts` | 加 assertCharAccess |
| `ailive/src/app/client/[id]/page.tsx` + `client-v2.css` | IdentityScreen 套設計系統 |
| `ailive/src/app/feed/[id]/page.tsx`、`dashboard/[id]/identity/page.tsx` | clientPasswordRequired + detect-angle |
| `zhu-core/memory/feedback_ui_conform_no_patch.md` | 新建 + MEMORY.md 索引 |

---

## 下一步

**明天醒來第一件**：ailive-platform 的 git 收乾淨。
- production 已靠 `vercel --prod` 上線（aliased），但 git 歷史沒記這批改動。
- `cd ~/.ailive/ailive-platform && git status` → 13 M 檔 + untracked。
- 分批 commit：本 session 身份照+auth 源檔（char-access / client-auth / detect-angle / characters route / client page / feed / dashboard identity / gemini-client / generate-image / image upload / client-v2.css）為一組。
- **scratch script 不要進 git**：`scripts/_tmp_*`、`_check_*`、`_backfill_*` 是臨時驗證檔，commit 前清掉或 .gitignore。
- dialogue/voice-stream/knowledge-image/specialist/image 也在 M 清單，來源跨 session，逐檔 `git diff` 確認歸屬再決定。

---

## 卡住 / 未解

- ailive-platform git 未 commit（見上「下一步」）。production 不受影響（vercel 已部署），只是歷史落後。
- 身份照上傳尚未用真實 client cookie（非 operator）端到端實測過欄位分級，可能擋到正常 client 上傳——要驗。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| Async Worker 五問 | `~/.ailive/zhu-core/skills/async-worker-checklist.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ailive 主戰場 | `~/.ailive/ailive-platform/`（Next.js，prod=ailive-platform.vercel.app） |
| ANEWS 平台 | `~/.ailive/anews-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-29 · 築*
