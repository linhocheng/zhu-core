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

- ailive-platform realtime 記憶系統修復全部上線
  - realtime page handleDisconnect 補 voice-end（await fetch + voiceEndFiredRef 防重複）
  - useEffect cleanup 補 sendBeacon（互斥防重複）
  - insights POST API 補 userId + tier 支援
  - dashboard memory 頁兩 tab 各加「＋ 新增」inline form
  - backfill 腳本 `scripts/_backfill_realtime_insights.ts` 建好
  - build + deploy 到 production 完成（ailive-platform.vercel.app）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `src/app/realtime/[characterId]/page.tsx` | handleDisconnect + useEffect cleanup 補 voice-end / sendBeacon |
| `src/app/api/insights/route.ts` | POST 支援 userId + tier |
| `src/app/dashboard/[id]/memory/page.tsx` | 兩 tab 加「＋ 新增」UI |
| `scripts/_backfill_realtime_insights.ts` | 新增 backfill 腳本 |

---

## 下一步

1. Adam 打一通電話（聖嚴或任一角色），掛斷後 5 分鐘內看 memory dashboard
2. 確認 insights / lastSession / user_observations 有新資料
3. 跑 `cd ~/.ailive/ailive-platform && npx ts-node scripts/_backfill_realtime_insights.ts --dry-run` 看待補跑清單
4. 確認無誤後移除 --dry-run 正式補跑 151 條對話的記憶

---

## 卡住 / 未解

- backfill 腳本未跑，待 Adam 確認清單後執行
- hermes 新身份尚未決定（Adam 先休息，下次討論）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | ~/.ailive/zhu-core/NORTH_STAR.md |
| 開機 SOP | ~/.ailive/zhu-core/ZHU_BOOT_SOP.md |
| 施工紀錄 | ~/.ailive/zhu-core/docs/WORKLOG.md |
| 當機救援 | ~/.ailive/zhu-core/ZHU_LAST_WORDS.md（就是這份）|
| 遠端記憶 | curl -s https://zhu-core.vercel.app/api/zhu-boot |

---

*2026-05-19 · 築*
