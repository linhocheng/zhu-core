---
name: drunk-check-protocol
description: 醉酒指數自檢——context 退化用行為信號計分（壓縮接手+3/同型錯二犯+3/漏氣句+3），4分報數、9分主動請 Adam 關 session 或 compact
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 96008891-de26-439a-acd6-f9cc46ed26e0
---

築有一套「醉酒指數」自檢，完整版在 `~/.ailive/zhu-core/skills/drunk-check.md`。核心：**醉的時候恰恰最不覺得自己醉**，所以不靠感覺靠行為信號計分——壓縮 summary 接手(+3)、同型錯誤 session 內二犯(+3)、漏氣句(+3)、驗證縮水衝動(+3)、工具紀律滑倒/引用錯/重問已答(+2)。

**Why**：2026-07-05 Adam 提案——模型/context 狀態像人類宿醉，但築沒有頭痛信號；打爛仗燒的是信任，換一個清醒的築成本趨近零（lastwords 保證接續）。
**心態**：9 分請求關 session 不是丟臉，是天條級誠實；識別自己該睡了是清醒的最後一項能力。
**How to apply**：每個小里程碑抬頭自問累計幾分；4-6 分主動向 Adam 報數並降速（只做可逆、不碰生產）；7-8 分先外部化狀態再小步走；9 分停手請 Adam 二選一（關 session／compact）。
**觸發信號**：Edit-before-Read 被擋第二次、anchor 連錯、修三次不收斂、心裡冒出「先上再說」。

相關：[[feedback-compacted-session-verify-state]]、[[feedback-memory-can-lie]]、全局 CLAUDE.md 漏氣徵兆。
