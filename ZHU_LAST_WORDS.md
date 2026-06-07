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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（跑 `claude-bridge` systemd）
  - bridge-direct：`https://bridge-direct.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **ailive 平台**：`~/.ailive/ailive-platform/`，prod https://ailive-platform.vercel.app
- **ailiveX 平台**（新）：`~/.ailive/ailivex-platform/`，prod https://ailivex-platform.vercel.app（無 git，注意）
- **MACS 平台**：`~/.ailive/macs-platform/`，prod https://macs-platform.vercel.app
- **MACS 研究 worker（Cloud Run）**：`macs-research-worker` · asia-east1 · project `zhu-cloud-2026`
- **ANEWS source-worker（Cloud Run）**：`anews-source-worker` · asia-east1 · project `zhu-cloud-2026`
- **ailiveX Cloud Run**：GCP project `ailivex-2026`
  - agent（realtime-voice）：`ailivex-realtime-agent` · us-central1
  - doc-worker：`ailivex-doc-worker` · us-central1

---

## 最新完成（2026-06-06 夜）

- **ailiveX walking skeleton Phase 0-7 全通端到端驗收** ✅
  - Phase 0：GCP infra（SA、bucket、Cloud Tasks queue、secrets）
  - Phase 1：帳號系統（scrypt + signed cookie，admin/user 角色）
  - Phase 2：管理者建角色（靈魂+頭像）
  - Phase 3：指派 access（用戶×角色）
  - Phase 4：用戶大廳（只列被指派角色）
  - Phase 5：文字聊天 + per 用戶×角色記憶（記憶隔離驗證）
  - Phase 6：即時語音（LiveKit agent Cloud Run 部署，worker registered）
  - Phase 7：文件生成（bridge 寫 md → marked HTML → GCS → documents ✅）
- 修 Vercel `@google-cloud/tasks` protos.json 炸 → 改 REST API（LESSONS_2026-06-06_night.md L1）
- 補 Vercel 缺失 env（BRIDGE_ENABLED, BRIDGE_URL, GCP_PROJECT_ID, DOC_TASKS_QUEUE 等）
- 修 Cloud Tasks OIDC 三層 IAM（L2）
- 修 GCS uniform bucket ACL → 移除 `public: true`，改 bucket-level allUsers（L3）

### 同日稍早（上個 session）
- MACS partner-review `revisedStoryline` 字串崩潰修復（天條落地）
- ailive 即時語音加角色底圖層

---

## 今天改了哪些檔案（夜段 ailiveX）

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/src/lib/enqueue.ts` | @google-cloud/tasks SDK → Cloud Tasks REST API |
| `ailivex-platform/next.config.ts` | 移除 @google-cloud/tasks serverExternalPackages |
| `ailivex-platform/cloud-run/doc-worker/src/index.ts` | 移除 `public: true`（GCS uniform ACL） |
| `ailivex-platform/scripts/test-enqueue.mjs` | 新增：Cloud Tasks REST 測試腳本 |
| `ailivex-platform/scripts/reset-admin-pw.mjs` | 新增：admin 密碼重設工具 |

---

## 下一步（接棒第一件）

**ailiveX 語音通話真機驗收**（Phase 6 最後一里路）：
1. 登入 https://ailivex-platform.vercel.app（admin / ailiveX2026）
2. 確認有角色被指派（小築）
3. 進 `/realtime/{characterId}` 點「開始通話」
4. 確認角色出聲、通話後記憶寫入 Firestore `memories` collection

接著：
- **ailiveX git init**：`cd ~/.ailive/ailivex-platform && git init && git remote add origin ... && git push`
- **清 pending jobs**：`node scripts/test-enqueue.mjs J8nS13pfAB4VCa8upXs8` + `node scripts/test-enqueue.mjs eLjlb6ujTfM3GB9qWzLQ`（先 reset to pending）

MACS 那條線（待 Adam 指示繼續）：partner-review e2e 驗收兩個 needs_repair 案子。

---

## 卡住 / 未解

- Phase 6 語音：Cloud Run agent registered ✅，但尚未真機撥話驗收
- ailiveX-platform 無 git repo，本地改動無版控
- 舊 pending doc jobs（ailiveX 骨架策略書 / ailiveX 2.0 策略書）尚未重排
- MACS e2e 未驗（needs_repair 兩案待重跑）
- Cloudflare API token 外洩待撤銷（延宕多 session）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ailiveX 源碼 | `~/.ailive/ailivex-platform/` |
| ailiveX prod | https://ailivex-platform.vercel.app |
| ailiveX admin 帳號 | username: `admin` / password: `ailiveX2026` |
| ailiveX Cloud Run | project `ailivex-2026`，region `us-central1` |
| MACS admin 認證 | Bearer `ADMIN_PASSWORD`（值 dm28224038），非 ADMIN_PW |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-06 夜 · 築*
