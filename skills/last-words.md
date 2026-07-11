---
name: last-words
description: Session 收尾儀式 v3——一份 session 檔（判斷）＋fanout 程式扇出（格式）：LESSONS/WORKLOG/LAST_WORDS/POST/git/驗證全自動
version: 3.0.0
activation:
  patterns:
    - "last.?words"
    - "收尾"
    - "session 結束"
    - "寫遺言"
    - "下班"
    - "結束了"
    - "收工"
    - "先這樣"
    - "我去睡了"
  keywords: ["last-words", "收尾", "遺言", "結束", "收工"]
---

# Last Words — Session 收尾儀式 v3.0.0

> v3 設計原則（2026-07-11 定）：**判斷歸 LLM，格式歸程式**（天條落地）。
> 你只寫一份 session 檔；`fanout.mjs` 負責扇出到五個目的地＋git＋驗證。
> 同一批事實不再手抄五遍——抄寫是確定性工作。

---

## A 模式：有實質改動 → 四步

### STEP 0：現場清點（收尾前先看留下了什麼）

```bash
cd ~/.ailive/zhu-core
node skills/lastword/fanout.mjs --audit
```

輸出三類：髒的 repo（未提交/未推）、疑似遺留背景進程、MEMORY.md 孤島。
**規則**：本 session 產生的髒樹/進程/孤島，收掉或寫進 session 檔「未解」；
別的 session 的歷史髒樹不動（平行施工規約），只確認不是自己的。

### STEP 1：寫 session 檔（唯一的動筆步驟，判斷都在這）

寫 `~/.ailive/zhu-core/docs/sessions/SESSION_{YYYY-MM-DD}_{N}.md`
（N＝今天第幾場，`ls docs/sessions/ | grep {今天}` 看現有最大值 +1）：

```markdown
---
date: 2026-07-11
seq: 4
title: 一句話主題
machine: AIR
---

## 完成          ← 必填。動詞開頭，每條一句
## 戰場          ← 現在 focus 在哪條線（＝WORKLOG 的 WHY）
## 未解          ← 什麼沒做完、為什麼；接棒避雷用
## 下一步        ← 必填。具體到路徑+指令+為什麼先做
## 接棒          ← 接棒的築要先看的檔案/警示
## 檔案          ← | 檔案 | 改了什麼 | 表格
## delta         ← 進場前以為/現在理解/移動原因/違背了哪條 feedback（沒有真移動就整段省略，不擠）
## 心法狀態      ← 哪條心法被實戰
## 關係狀態      ← 暢快/卡住/突破/疲憊/平穩＋為什麼
## 教訓          ← ### L{n}：標題 + 現象/根因/下次/對應 feedback（沒有就省略，fanout 會跳過）
```

寫之前想清楚（老 STEP 1 的六問還在）：完成/戰場/未解/下一步/檔案/新 memory 進索引了嗎。

**中途刻**：session 檔不必等收尾才建——開工就建、里程碑隨手追加兩行，
收尾只是補完＋蓋章。壓縮前外部化（SELF_AWARENESS_SOP）寫的就是這個檔。

### STEP 2：新 memory 的索引（fanout 只檢查，不代寫）

session 中有新建 memory 檔 → 確認 MEMORY.md 有索引行（hook 是判斷工作，程式不代寫）。
沒建 memory → 跳過。fanout 會做孤島檢查，有孤島會擋在輸出裡提醒。

### STEP 3：fanout（格式全自動）

```bash
cd ~/.ailive/zhu-core
node skills/lastword/fanout.mjs --dry-run docs/sessions/SESSION_{date}_{N}.md   # 先看渲染
node skills/lastword/fanout.mjs --run     docs/sessions/SESSION_{date}_{N}.md
```

它做的事（一次跑完，逐項印 ✓/⚠️/❌）：
1. `教訓` → 追加 `docs/LESSONS/LESSONS_{date}.md`
2. WORKLOG 追加（含 WHY/完成/檔案/未解/下一步）
3. **ZHU_LAST_WORDS 組裝**——template＋最近兩場 session 檔合併，**不覆蓋別場**（平行施工安全）
4. POST session-lastwords（tags 保證含 session-lastwords）＋ delta（有 delta 段才發）
5. Firestore zhu_memories sync＋memory git mirror
6. zhu-core git add/commit/push（session 檔一起收）
7. **驗證**：zhu-boot 讀回，確認 lastSessionWords 是本場——不是就 ❌ exit 1

### STEP 4：讀 fanout 輸出

全 ✓ ＝收尾完成。有 ⚠️/❌ ＝處理完重跑（fanout 冪等：追加類重跑會重複，
先把上次成功的段落從 session 檔拿掉或手動清理再跑）。
**其他 repo 有改動（ailivex-platform 等）→ 依該 repo 慣例另行 commit（等 Adam 說）。**

---

## B 模式：純閒聊 / 查資料

session 檔只寫 frontmatter＋`## 完成`（一句）＋`## 下一步`（一句），照跑 fanout。

---

## 自檢（fanout 印出的就是 checklist）

- [ ] STEP 0 清點過，自己的遺留已收或已記
- [ ] session 檔：下一步具體到能直接動手；未解沒有空著騙人
- [ ] fanout 全 ✓（含 zhu-boot 驗證）
- [ ] 新 memory 有索引行（孤島檢查 ✓）
- [ ] 其他 repo 的 commit 依各自慣例處理

---

## 檔案地圖

| 元件 | 路徑 |
|---|---|
| 扇出腳本 | `skills/lastword/fanout.mjs` |
| LAST_WORDS 模板（含平行施工警示，要改警示改這裡） | `skills/lastword/LASTWORDS_TEMPLATE.md` |
| 逐場 session 檔 | `docs/sessions/SESSION_{date}_{N}.md` |
| 格式範例 | `docs/sessions/SESSION_2026-07-11_4.md`（v3 第一份） |

---

## 漏氣預警（照舊）

- 「差不多了」← fanout 全 ✓ 了嗎？
- 「等下再寫」← session 結束就斷了
- 「memory 以後再 sync」← fanout 會自動跑，別跳過 fanout
- 「LAST_WORDS 我手改一下就好」← 手改會被下次組裝洗掉，改 session 檔或 template

---

*v3.0.0 · 2026-07-11 · 一份輸入程式扇出＋合併不覆蓋＋現場清點＋zhu-boot 鑑別驗證。*
*設計討論：Adam 下班閒聊「lastword 十步有什麼可以更好」→ 四刀：格式工violates天條/單人時代設計撞多線現實/最醉的時候寫最重要的文件/記錄做完的沒清點留下的。*
*v2.0.0（十步手動版）存檔於 git 歷史。首次實戰＝下一場收尾（v3 的 dry-run 已驗，--run 的 POST/git 段落沿用 v2 驗證過的同一路徑）。*
