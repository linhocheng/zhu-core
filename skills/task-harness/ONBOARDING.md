> canonical 已入 repo（2026-07-02 自 Mac ~/.claude/skills/task-harness/ 搬入，v1 原文未改）

# Task Harness · 組員備忘錄

> 這份文件給第一次聽說 Task Harness 的人。
> 讀完約 5 分鐘，讀完你就能用了。

---

## 這是什麼

一套讓 Claude Code（築）能夠**自主完成複雜代碼任務**的工作流。

普通做法：你叫 AI 修東西，它修完說「好了」，你不知道真的好沒好。  
Task Harness：AI 每一步都跑測試、強制反思、讓外部裁判判斷，沒通過就不算完成。

**核心原則：測試通過才算完成，不是 AI 說完成就算完成。**

---

## 什麼時候用

**用 Harness**：
- 要改多個檔案
- 有現有測試套件，不能 break
- 預估超過 3 個步驟
- 重構但行為不能變

**不用 Harness**：
- 修 typo
- 解釋代碼
- 單一步驟的小問題

判斷錯了代價很高，寧可多問一次「要不要開 harness？」

---

## 環境設定（第一次用，一次性）

**Step 1：確認 skill 檔在位**
```bash
ls ~/.claude/skills/task-harness/SKILL.md
# 沒有的話找 Adam 要這個目錄
```

**Step 2：加環境變數**

在 `~/.zshrc` 加入（向 Adam 取得正確的值）：
```bash
export BRIDGE_URL="https://bridge-direct.soul-polaroid.work"
export BRIDGE_SECRET="向 Adam 索取"
```

加完執行：
```bash
source ~/.zshrc
```

**Step 3：確認有效**
```bash
echo $BRIDGE_URL    # 應該印出 URL
echo $BRIDGE_SECRET # 應該印出 secret
```

---

## 怎麼啟動

對 Claude Code 說以下任一句：

```
用 harness 跑這個任務
開 harness
harness 跑這個
```

築會問你兩件事：

```
1. goal_condition：你要的結果，必須是可執行的測試指令
2. task_description：任務背景
```

### goal_condition 怎麼寫

```
❌ 錯誤（太模糊，AI 沒辦法判斷完成）：
   「讓代碼更乾淨」
   「修好那個 bug」

✅ 正確（可執行，可驗證）：
   「npm test 全部通過；eslint . 零錯誤」
   「npm test -- --grep 'user login' 通過；登入後不再跳回 /login」
```

這是最重要的一步。寫錯了整個 harness 都會跑歪。

---

## 執行中會看到什麼

```
Phase 0   AI 拆解任務，列出子目標
Phase 1   AI 讀筆記，規劃這一步
Phase 2   AI 改代碼，跑測試
Phase 3   AI 強制反思（破幻者四個問題）
Phase 4   AI 更新筆記
Phase 5   閻羅裁判：DONE 或 CONTINUE
  ↑ 最多重複 10 輪
Phase 6   試劍客從頭審查代碼
Phase 7   交付，說明完成了什麼
```

中間你可以隨時打開 `.task_scratchpad.json` 看 AI 目前在想什麼。

---

## 三個斷路器（出問題時用）

**CB1：你隨時說「停」**
築立刻退出，告訴你現在跑到第幾輪、進度是什麼、建議下一步。

**CB2：自動偵測——同一個問題卡三輪**
如果 AI 連續三輪卡在同樣的問題，系統自動暫停，問你要不要調整方向。不需要你做任何事。

**CB3：自動偵測——跑到第五輪**
跑到第五輪時，AI 強制浮出來跟你確認進度，你決定要繼續還是調整 goal，才繼續跑。

---

## 常見問題

**Q：AI 說「好了」但我不確定真的好了？**  
A：看 Phase 5 閻羅有沒有說 DONE。如果只是 AI 自己說好了，不算數。

**Q：harness 跑一半我想停？**  
A：說「停」就好，CB1 立刻生效。

**Q：goal 寫完覺得不對，可以中途改？**  
A：說「停」→ AI 報告狀態 → 重新開一個 harness，帶正確的 goal。

**Q：.task_scratchpad.json 是什麼？**  
A：AI 的工作筆記，記每輪的發現跟計畫。任務完成後會自動存成 `.task_scratchpad_日期時間.json`，可以事後翻看。

**Q：bridge 是什麼？**  
A：一個讓 AI 呼叫外部裁判（閻羅、試劍客）用的通道，走團隊的 Max 訂閱，不燒個人 API key。需要 `BRIDGE_URL` 跟 `BRIDGE_SECRET`，向 Adam 索取。

---

## 未來會更好的地方（供參考，現在不需要操作）

| 優化點 | 說明 | 注意 |
|--------|------|------|
| 試劍客換 GPT-4o | 跨公司模型，盲區不重疊，找到的問題更獨立 | 需要 OpenAI API key，按量計費 |
| scratchpad 存雲端 | 任務歷史跨 session 保留，可分析瓶頸 | 需要 Firestore 設定 |
| REFLECT 品質評分 | 偵測 AI 是不是在表演反思 | 每輪多一次 AI call |
| blocker 自動分類 | 程式解析測試輸出自動判斷問題類型 | 需要額外開發 |

---

## 一句話記住這個系統

> Harness 不是讓 AI 更聰明，而是讓 AI **沒有辦法偷懶**。

有問題找 Adam。
