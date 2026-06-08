---
name: LiveKit agent「沒有聲音」可能是跨 region 重複 Cloud Run 殭屍
description: 同 agent_name + min-instances=1 的重複服務部到不同 region，會變隱形殭屍 worker 偷走一半 LiveKit dispatch，初始化失敗就「沒聲音」
type: reference
originSessionId: d44171fd-41c9-4648-9b8d-6bd6aaaee3ef
---
LiveKit explicit dispatch 靠 agent_name 註冊 worker。若同一個 agent（如 `ailivex-realtime`）的 Cloud Run 服務**被部署到兩個 region**（例：asia-east1 + us-central1），兩個 instance 都以同 agent_name **向外註冊**成 worker，LiveKit 把 dispatch 在它們之間負載平衡。

**症狀**：即時語音「沒有聲音」約一半機率 —— 健康的 region 接到的通話正常，殭屍 region 接到的通話因 job 子進程 init 失敗（舊 code initialize_timeout=10s、SIGUSR1 signal 10 殺進程）spawn 不出 agent → 該通無聲。

**為什麼難抓**：
- `gcloud run services list --region=X` 只列單一 region，看不到別 region 的重複服務 → 以為只有一個。
- **正確診斷**：`gcloud run services list --project=P`（不帶 --region）會列出所有 region；同名服務出現兩列 + 不同 revision = 跨 region 重複。
- min-instances=1 讓殭屍永不縮容，可活數小時～無限，不是 drain_timeout（30min）能解，因為它根本沒收到 SIGTERM、是獨立活著的服務。

**修法**：`gcloud run services delete <name> --region=<殭屍 region>`。刪完用 until-loop poll 殭屍 revision 的 log 停掉確認死亡，再請使用者重撥。

**How to apply**：LiveKit agent 行為異常（間歇沒聲、一半通話失敗）第一步先 `gcloud run services list`（全 region）看有沒有跨 region 重複註冊同 agent_name 的服務。2026-06-08 ailiveX 即時語音「沒聲音」的真正根因。
