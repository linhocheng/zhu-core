---
name: manual-cloud-change-sync-deploy-script
description: 天條：手動改雲端資源（min-instances/CPU/env）後，同一個工作日把 cloudbuild/IaC 改成同狀態並 commit，否則下次 deploy 無聲洗回
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0fb48042-7502-4185-8ecc-51985c11164a
---

**規則**：跑了任何手動 `gcloud run services/jobs update` 之後，檢查部署腳本（cloudbuild.yaml / deploy.sh / IaC）有沒有同名旗標寫著舊值——有就**同日**改掉並 commit。

**Why**：部署腳本就是未來的現場。2026-07-06 費用清理當天，兩個 podcast-worker 的 cloudbuild 都還寫死 `--min-instances=1`——不改的話，當天省下的 ~NT$4,000/月活不過下一次部署，而且會無聲復活（大家都以為降過了，沒人會再查）。

**心態**：「記憶會說謊」的 infra 版。手動指令改的是現在，腳本改的是所有的未來；只改現在＝跟未來的自己埋雷。

**How**：手動 update 完，立刻 `grep -n "min-instances\|cpu\|env-vars" <該服務的 cloudbuild>` 對一遍線上現況；不一致就改＋commit（訊息註明「同步 2026-XX-XX 手動變更」）。

**觸發信號**：剛跑完 `gcloud run services update`；cloudbuild 裡的旗標值跟 `gcloud run services describe` 對不上。

相關：[[standing-cost-only-for-instant-readiness]]、[[feedback_memory_can_lie]]

- 驗證+1:2026-08-02 第3場 — 手動改防火牆（SSH/RDP）＋VM SA grant，同日改 provision.sh 同步

- 驗證+1:2026-08-02 第5場 — VM SA 三 secret 授權手動做完同日進 provision.sh 迴圈；timeout 改的是 deploy.sh 本體

- 驗證+1:2026-08-02 第6場 — 線上設定一律改 deploy.sh 再部署，手動 update 零次

- 驗證+1:2026-08-03 第1場 — 手動 invoker binding／jobs create 當日同步進 deploy.sh 註記與 cloudbuild

- 驗證+1:2026-08-04 第1場 — secrets 用 --update-secrets 掛，cloudbuild 無 env 旗標不會洗掉（驗過形狀才動手）

- 驗證+1:2026-08-05 第5場 — 手動恢復 min=1 後立刻對照 cloudbuild（yaml 本來就設計不帶 min，行為不符→記債不改碼）
