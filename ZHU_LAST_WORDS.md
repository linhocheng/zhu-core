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
  - 跑著 `claude-bridge`（systemd，port 3001）
  - 對外兩條：①`https://bridge.soul-polaroid.work`（cloudflared tunnel，過 CF，有 ~130s edge timeout）②**`https://bridge-direct.soul-polaroid.work`（新，Caddy+LE 直連 VM，繞開 CF，2026-06-02 建）**
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **MACS 平台**：`~/.ailive/macs-platform/`（git repo，GitHub `linhocheng/macs-platform` private）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-02 接棒晚場）

- 根治 MACS CF 524：VM 裝 Caddy + Let's Encrypt，建直連 host `bridge-direct.soul-polaroid.work`（grey-cloud A record，繞開 CF edge timeout）。
- Vercel + Cloud Run 的 `BRIDGE_URL` 都改指 https 直連 host（Cloud Run env-only update → rev `00016-xhk`，不 rebuild）。兩條路重 LLM 階段不再被 CF 130s 掐死。
- 刪死碼 Vercel `app/api/workers/synthesis/route.ts`（真相分裂修復，live synthesis 在 Cloud Run）。
- commit `d3e1e47` 對齊部署現場（structured-JSON research + Cloud Run synthesis worker + schema 強化），推 GitHub。
- 更正記憶：structured-JSON 不是「不採」，是線上現役（401 探針確認 deployed=working-tree）。

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| VM `/etc/caddy/Caddyfile` | reverse_proxy localhost:3001（bridge-direct host） |
| Cloudflare DNS | 新增 A record bridge-direct → 35.236.185.222（grey-cloud） |
| GCP firewall | allow-bridge-tls（tcp 80/443 → tag zhu-dev） |
| Vercel env `BRIDGE_URL` | → https://bridge-direct.soul-polaroid.work |
| Cloud Run macs-research-worker env | `BRIDGE_URL` → https 直連 host（rev 00016-xhk） |
| macs `app/api/workers/synthesis/route.ts` | 刪除（死鏡） |
| macs `cloud-run/.../index.ts` 等 10 檔 | commit d3e1e47（structured research + synthesis worker + schema） |
| `memory/project_macs_platform.md` | structured-JSON 更正 + CF 524 根治紀錄 |
| `docs/LESSONS/LESSONS_2026-06-02.md` | L8 更正 + 新增 L11/L12 |
| `docs/WORKLOG.md` | 追加接棒晚場段 |

---

## 下一步

**明天醒來第一件**：跑一個真實 MACS case 端到端，驗兩件事——①CF 524 已根治（重 LLM 階段如 export/structure-analysis 不再 524）②structured research dossier 品質（素材外 URL 有被擋嗎）。
```bash
cd ~/.ailive/macs-platform
# 看 app/api/cases 入口 + scripts/_watch-cases.mts 監控
```
為什麼先做：CF 524 修好了但「沒端到端跑過不算完成」，這條已掛兩 session 未打勾。

---

## 卡住 / 未解

- **MACS 全鏈路真案 e2e 仍未跑**（config/build/health/deploy 全過，端到端未過）。
- **Cloudflare API token（`cfat_...`）貼進過 chat，待撤銷**——Adam 說「先用之後再說」，記得收尾。撤銷處：Cloudflare dash → My Profile / Account API Tokens。
- eval 腳本測的 synthesis 是另一份 impl（非 Cloud Run prod 現役），eval-vs-prod drift 待處理。

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
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| MACS 平台 | `~/.ailive/macs-platform/`（CLAUDE.md 在內） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-02 · 築*
