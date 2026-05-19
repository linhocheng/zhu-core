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

## 最新完成（2026-05-19）

- /client/ middleware 修好，客戶端不再跳主站登入（v1.5.4.005）
- commission_specialist 加佐格哲學路由 Phase 1（v1.5.4.004）
- 新建 /api/longform 長文場域（v1.5.4.006）
- Bridge streaming 現場勘查完成，確認 streaming 路徑壞掉（Not logged in）
- 確認 bridge non-streaming 走 Max OAuth，990s + 47K tokens 能跑完

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailive-platform/src/middleware.ts` | /client/ 加入 PUBLIC_PREFIXES |
| `ailive-platform/src/app/api/dialogue/route.ts` | 加佐格路由 Phase 1 |
| `ailive-platform/src/app/api/longform/route.ts` | 新建，長文場域 |
| `zhu-core/skills/strategy-commission-flow.md` | 佐格計畫寫入（untracked，待 commit）|

---

## 下一步

**修 bridge streaming auth**：
```bash
gcloud compute ssh zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026
# 調查：為何 streaming 模式 claude CLI 顯示 Not logged in
echo "test" | claude -p --output-format stream-json --verbose 2>&1 | head -5
# 如果還是 Not logged in，看 ~/.claude/oauth_token 是否存在
# 試 export ANTHROPIC_CLAUDE_CODE_OAUTH_TOKEN=$(cat ~/.claude/oauth_token)
```
修好後 → /api/longform 改走 bridge streaming → 壓力測試吳導 15000 字

---

## 卡住 / 未解

- **Bridge streaming 壞**：`--output-format stream-json` 模式 claude 顯示 Not logged in，non-streaming 正常。兩條 auth 路徑不同，待查機制
- **D-work 架構待定**：Max + streaming 解法等 bridge 修好才能確認

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| Bridge streaming 踩雷 | `docs/LESSONS/LESSONS_2026-05-19b.md` |
| D-work 長文場域 | `ailive-platform/src/app/api/longform/route.ts` |
| 佐格路由計畫 | `skills/strategy-commission-flow.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-19b · 築*
