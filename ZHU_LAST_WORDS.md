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
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **監造儀表板**：https://zhu-mid.vercel.app

---

## 最新完成（2026-05-19）

- realtime voice-end 觸發補好（handleDisconnect fetch + voiceEndFiredRef 互斥 + useEffect cleanup sendBeacon）
- insights POST API 補 userId + tier 支援
- dashboard memory 頁兩 tab 各加「＋ 新增」inline form
- backfill 腳本建好並跑完（56/56 voice conv 全有 lastSession）
- 吉娜 crash 修好（Python SERVER_TIMESTAMP → ISO string，Firestore 壞資料 9 筆清掉）
- user-observations listUsers Timestamp→ISO 修好
- 確認今天電話（conv anon-1777305837582-utykl2）insights / lastSession / user_observations 全部正確寫入

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `src/app/realtime/[characterId]/page.tsx` | handleDisconnect + useEffect cleanup 補 voice-end / sendBeacon |
| `src/app/api/insights/route.ts` | POST 支援 userId + tier |
| `src/app/dashboard/[id]/memory/page.tsx` | 兩 tab 加「＋ 新增」UI |
| `scripts/_backfill_realtime_insights.ts` | 新增 backfill 腳本（已執行） |
| `src/app/api/user-observations/route.ts` | listUsers Timestamp → ISO string |
| `agent/firestore_loader.py` | auto_extract_user_profile 兩處 SERVER_TIMESTAMP → ISO string |

---

## 下一步

**聖嚴打兩次招呼的根因還沒找到。**

1. 打一通聖嚴電話，掛斷後立即看 voice-stream log（Vercel function log 或 console）
2. 確認 lastSession block 注入後，LLM 的開場白是否包含兩次問候語
3. 懷疑方向：lastSession block 裡面的 `summary` 包含了上次開場的文字，角色把它當成「上次的模板」重複 → 可試著調整 lastSession block 的 system prompt 提示
4. `src/lib/last-session-block.ts` + voice-stream line 303 是注入點

---

## 卡住 / 未解

- 聖嚴打兩次招呼：lastSession block 格式看過，注入位置在 voice-stream line 303，無明顯重複，根因不明。需要真實電話 + log 對照

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-19 · 築*
