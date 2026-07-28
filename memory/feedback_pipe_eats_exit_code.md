---
name: feedback_pipe_eats_exit_code
description: "接了管子的成功碼不是成功碼——`cmd | tail` 的 exit code 是 tail 的；部署/長腳本要看真實退出碼或看輸出內容"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d1be1fc9-5905-4fa1-b92a-07a9c2bc4fb6
---

**規則**：shell 管道的 exit code 是最後一節的。`./deploy.sh all 2>&1 | tail -30` 半路死在第三步，背景任務照樣回報 exit 0。

**Why**：2026-07-28 GEO 部署，deploy.sh 在 scheduler update 步驟炸掉（`--headers` 旗標 update 不吃），但 `| tail` 讓 harness 回報「completed exit 0」——差點把斷尾部署當全綠收案。模稜兩可信號家族（[[feedback_ambiguous_signal_not_proof]]）的 shell 版。

**心態**：exit 0 只有在「沒有管子」的時候才是那條指令的話；接了管子就要改聽輸出內容說話。

**How to apply**：
- 長腳本/部署跑背景時不接 `| tail`（輸出反正落檔，事後 Read 尾巴）；要接就 `set -o pipefail` 或事後逐步驟核輸出
- 收案鑑別信號改看「每一步的成功輸出行都在」而不是退出碼
- bash 內建 `${PIPESTATUS[0]}` 可救，但最穩是不接管子

**觸發信號**：背景任務「exit 0」但輸出尾端有 ERROR 字樣；部署 log 步驟數比預期少；「completed」與畫面現況對不上。
