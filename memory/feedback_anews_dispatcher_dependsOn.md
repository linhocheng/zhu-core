---
name: dispatcher dependsOn 必須同步建立依賴節點
description: workflow_nodes dependsOn 引用的節點若不存在，dispatcher 永遠不排隊
type: feedback
---

在 DISPATCHER_OWNS_SECTION_QA 模式下，section_qa 的 pending 節點用 `dependsOn: [writeNid]`。但 section_write worker 本身不寫 workflow_nodes，導致依賴節點不存在，dispatcher 的 `statusMap.get(dep) === "succeeded"` 永遠 false，section_qa 永遠卡在 pending。

**Why:** 2026-05-25 發現，main article sec[1] 卡了 15+ 分鐘。根因是 section_write_done handler 只寫了 section_qa 節點，忘了先寫 section_write succeeded 節點。

**心態：** 寫 DAG 依賴時要同時建立依賴節點，不能假設「dependency 會自己出現」。

**How to apply:** 任何時候在 orchestrator 創 pending 節點並帶 dependsOn，必須確認所有 dependsOn 節點在 Firestore 裡已存在且是 succeeded 狀態。若依賴已完成（在 callback 裡），同步寫 succeeded 節點。

**觸發信號：** 看到 workflow_node 的 `dependsOn` 清單 → 立刻查這些 nodeId 是否都在 workflow_nodes 裡。
