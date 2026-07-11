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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-07-11 第三場 · 監控 Phase 2.5：時間軸＋計費錶＋首音延遲）

- 審計 ailivex 監控中台三層設計（聚合 API/事件脊椎/前端），Adam 認可後 GO 優化批
- **v18.6.0**：`ops_rollups` 每小時快照時間軸＋寬窗改讀 rollup（原始掃描鎖 48h，讀量不隨資料量長大）＋趨勢 sparkline＋**Cloud Run 計費錶真值儀表化**＋abandoned session 清掃＋provider 燈失敗率門檻
- **v18.6.1**：新 cron 被 middleware 登入牆 401——三件套雷已刻 memory `new-cron-three-places`
- **v18.7.0**：首音延遲量測（前端 ActiveSpeakersChanged，**零碰 live agent**），Adam 真實通話收案：**connect 3.3s / 首音 18.0s → 14.7s 在 agent 首回合**
- 計費錶第一天抓到三異常：doc-worker 14.2 實例時/24h、v17 名義冷備 6.4、loadtest 殘留 0.5
- 實測監控整套成本 <$1/月（~55 讀/refresh）；新 memory ×2＋project 進度已更

---

## 今天改了哪些檔案（第三場，ailivex-platform repo）

| 檔案 | 改了什麼 |
|---|---|
| `src/lib/ops-rollup.ts` | 新建：每小時聚合快照（事件窗 [T-1h,T)/任務窗 [T-2h,T-1h) 錯開沉澱、docId=小時鍵冪等、TTL 400d） |
| `src/lib/cloudrun-billing.ts` | 新建：Monitoring API billable_instance_time（ALIGN_RATE=平均計費台數） |
| `src/app/api/cron/ops-rollup/route.ts` | 新建：rollup cron（:05 每小時，wrapCron 心跳） |
| `src/app/api/voice-metrics/route.ts` | 新建：首音延遲回報（session 鑑權+ownership+10min sanity） |
| `src/app/realtime/[characterId]/page.tsx` | ActiveSpeakersChanged 首音量測（不是 TrackSubscribed！）+connectMs |
| `src/app/api/admin/monitor/route.ts` | 寬窗讀 rollup、series、billing、voiceLatency p50/p95、abandoned 處理 |
| `src/app/admin/monitor/page.tsx` | 趨勢/計費錶 section、Spark 元件、首音 stat（p95>15s 警示）、provider 失敗率燈 |
| `src/lib/ops-event.ts` | sweepAbandonedSessions（open>3h 標 abandoned） |
| `src/app/api/cron/voice-auto-off/route.ts` | 併入清掃 |
| `src/middleware.ts` | PUBLIC_PATHS 補 `/api/cron/ops-rollup` |
| `vercel.json` | cron 排程 |

commits：v18.6.0 / v18.6.1 / v18.7.0（全部署 production，未 push GitHub 的話記得 push）

---

## 下一步

**明天第一件：查計費錶三異常。**
```bash
cd ~/.ailive/ailivex-platform
# 1. doc-worker 為何 24h 燒 14.2 實例時（平均 0.59 台）？查 min 與流量
gcloud run services describe ailivex-doc-worker --region=asia-east1 --project=ailivex-2026 | grep -i -A2 scaling
# 2. v17 名義冷備為何有 6.4 實例時？（懷疑：流量釘舊 revision 或 min 沒真降 0——掃 status.traffic）
# 3. loadtest 服務 0.5 實例時——上一場已收案說歸零，去確認是量測窗殘影還是真沒刪乾淨
```
為什麼先做：三個都是正在燒的錢，「已清理」的認知跟計費錶對不上＝真相分裂，放一天多燒一天。

次件：開 `/admin/monitor` 看趨勢區（rollup 已累積 24 點）＋首音樣本分佈。

---

## 卡住 / 未解

- 首音 18s 只有 1 樣本，別急著下結論；14.7s 在 agent 首回合內部，拆解要 agent 打點（下個語音版本帶，本場刻意零碰 live agent）
- /admin/monitor 新 section（趨勢/計費錶/首音）Adam 尚未回報視覺確認
- 監控 Phase 3 未動：LINE/Telegram 告警推播、Soniox agent 側儀表化
- 上半場遺留：開場白 8.3s UX 優化未排期

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

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-11 · 築*
