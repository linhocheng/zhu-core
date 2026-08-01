---
name: skill-cloudrun-version-retirement
description: 版本隔離紀律的缺角——vN 收案當天 v(N-1) 降常駐；LiveKit agent 降 0＝聾不是慢；16 台殭屍燒 $963/月的教訓
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 50b87aad-ff26-4532-9e0c-2506caf4fd7b
---

**規則**：開新版收案的當天，把上一版 Cloud Run 服務 `--min-instances=0`。版本隔離紀律只有「開新版不動舊版」是半套——缺「退役降常駐」這步，每開一版就多養一台 24 小時燒錢的殭屍。

**Why**：2026-07-06 掃全五 project 發現 ailivex base~v15 共 14 台語音服務全部 min-instances=1 + no-throttling 常駐計費，加 jiangbin/ailive 兩台合計 ~$963/月 ≈ NT$30 萬/年，燒了數月沒人看見。帳單曲線一直在漲但沒人問「為什麼」。

**心態**：隔離紀律讓人只想「不碰舊版最安全」——但不碰 ≠ 不管。錢的洩漏跟技術債一樣，不主動掃就隱形。

**How to apply**：
- vN 收案 → `gcloud run services update <v(N-1)> --min-instances=0`（env/image 全留，回滾=一條命令一分鐘熱回）
- **LiveKit agent 特例**：agent 是主動連 LiveKit 領工的，沒有 HTTP 請求會喚醒它——降 0＝聾（電話永遠接不通），不是慢。只適用「確定沒人再打」的版本；現役版和背景 worker（202+setImmediate 天條）必須維持常駐
- 定期掃法：`gcloud run services describe <s> --format="value(spec.template.metadata.annotations['autoscaling.knative.dev/minScale'])"` 逐台看，minScale=1 的每台問一句「誰在用它」

**觸發信號**：開新版本時；看到 Cloud Run 帳單曲線只漲不跌時；`gcloud run services list` 列出超過 5 台服務時。

相關：[[feedback_self_rescheduling_loop_needs_lifecycle_stop]]（版本繁殖複製舊雷的同族——lifecycle 缺角）、[[reference_cloudrun_background_task_sop]]（哪些常駐是天條不能降）。

- 驗證+1:2026-08-01 第5場 — 「LiveKit agent 降0=聾不是慢」一眼解掉「掛斷沒收到」謎題
