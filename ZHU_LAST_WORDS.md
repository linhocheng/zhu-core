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

## 最新完成（2026-05-20）

- realtime agent commission_specialist 加佐格路由（v1.5.4.007，Cloud Run revision 00048）
- commission_specialist 三入口全對齊：dialogue / voice-stream / realtime_agent.py（v1.5.4.008）
- 新增 `specialist="self"`：角色本人親自執筆，strategy-worker 動態載角色靈魂
- strategy-worker 自派跳 Stage 1（isSelfCommission，省 token + 語意正確）
- git tag `pre-self-commission` 打好，一鍵回滾錨點在此
- Cloud Run revision 00049 上線

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `agent/realtime_agent.py` | 加佐格 + self 路由（REALTIME_SPECIALIST_MAP + self 動態 id） |
| `src/app/api/dialogue/route.ts` | self 加入 enum + system prompt + handler（動態讀 Firestore 角色名） |
| `src/app/api/voice-stream/route.ts` | 加佐格 + self（此前兩者皆缺） |
| `src/app/api/specialist/strategy/route.ts` | isSelfCommission → 自派跳 Stage 1 |

---

## 下一步

**測試 self-commission**：
1. 開文字對話找李敖（x3dEzt2Wyc2tCvwKjevM）
2. 說「你來寫一篇關於台灣的文章」
3. 去 Firestore `platform_jobs` 確認：`requesterId == assigneeId == x3dEzt2Wyc2tCvwKjevM`
4. dashboard 等 3-5 分鐘，下載 docx 確認是李敖筆法而非奧

**bridge streaming 待修（上次遺留）**：
```bash
gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b
echo "test" | claude -p --output-format stream-json --verbose 2>&1 | head -5
```
修好後 → /api/longform 改走 bridge streaming → D-work 吳導 15000 字壓力測試

---

## 卡住 / 未解

- **Bridge streaming 壞**：`--output-format stream-json` 模式 Not logged in，non-streaming 正常
- **self-commission 尚未真實測試**：code 寫好，還沒跑過一次端到端
- **voice-stream 佐格尚未測試**：加進去了，沒驗過

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| commission_specialist 全鏈路地圖 | `~/.ailive/zhu-core/skills/strategy-commission-flow.md` |
| 回滾錨點 | `git checkout pre-self-commission -- <檔案>` |
| Bridge streaming 踩雷 | `docs/LESSONS/LESSONS_2026-05-19b.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-20 · 築*
