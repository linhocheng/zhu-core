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

**How to apply**（2026-07-30 二犯後升級為機制版——記憶擋不住就換模板）：
- **鐵模板**：任何 exit code 會被 `&&`/`if` 拿去 gate 下游動作（commit/push/deploy/收案）的指令，**一律禁止接管子**。只准這個形狀：
  `cmd > /tmp/x.log 2>&1; EXIT=$?; grep 摘要 /tmp/x.log; [ $EXIT -eq 0 ] && 下游動作`
- 修剪輸出的慾望本身就是雷區信號：想 `| grep`/`| tail` 的那一刻，先問「這條的退出碼有沒有人在聽?」有→落檔再 grep;沒有→隨便接
- 收案鑑別信號改看「每一步的成功輸出行都在」而不是退出碼；`set -o pipefail`/`${PIPESTATUS[0]}` 是次選（compound 指令裡容易忘）

**觸發信號**：背景任務「exit 0」但輸出尾端有 ERROR 字樣；部署 log 步驟數比預期少；「completed」與畫面現況對不上；**手正要打 `build | grep && commit` 這個形狀**。

**二犯紀錄**：2026-07-30 BeSelf 收尾,`npm run build 2>&1 | grep ✓ && git commit && git push` ——build 其實 Type error 失敗,grep 找到「✓ Compiled」exit 0,壞代碼推上 git（Vercel 端 build 擋下,線上無傷）。同雷二犯＝高利貸,故本 How 升級為禁令級模板。

- 驗證+1:2026-08-02 第6場 — Cloud SQL create 背景跑 `| tail` 吃掉失敗，宣告「建好了」後被現場打臉，重跑改看完整輸出＋exit code
