---
name: StraTA 三個可搬的 agentic 編排設計模式
description: 設計 MACS / ailivex 多代理 fan-out、評分、自審時讀；StraTA 論文（arXiv 2605.06642）抽出的編排層模式，RL 訓練半部不適用
type: reference
originSessionId: 44044274-3b4c-464a-a476-cf23df1226a4
---
來源：StraTA 論文（arXiv 2605.06642，2026），agentic RL with explicit trajectory-level strategy。
我（築）2026-06-18 跟 Adam 一起讀完整 26 頁 PDF。下面**只留可搬到我們系統的編排層模式**，RL 訓練半部（自 host 訓 Qwen 1.5B/7B）我們用不到——我們走 bridge / API，不自訓。寫給未來設計代理編排的我自己。

## 模式一：Top-δ 評分——用「最好的一半」判斷計畫，不用平均
StraTA 給一個 strategy 的 reward = 它跑出的 M 條 rollout 裡**最好那半**的平均（δ=0.5），不是全部平均。
**為什麼可搬**：一個好計畫被執行噪音拖累時，平均分會冤枉它。要分開「計畫品質」和「執行雜訊」——評計畫看它**能達到的最好結果**，不是它平均跑成什麼樣。
**接哪裡**：這正是「斷鏈很少一個原因，第一層通了不算完成」的另一面——別讓一次爛執行否決一個對的方向。MACS 評 strategy 候選、ailivex 評角色方案時用。

## 模式二：最遠點語義多樣性——溫度救不了塌縮，要用 embedding 強制撐開
StraTA 發現光調 temperature，LLM 的多個輸出還是擠成幾乎一樣。解法：oversample σ×N 條，用 MiniLM embedding 算語義距離，greedy 挑「離已選最遠」的點（farthest-point sampling, Algorithm 1）。
**為什麼可搬**：我們的 fan-out 若只靠「多開幾個 + 調溫度」，會得到假多樣性——表面不同、實質同一條路。
**接哪裡**：MACS 麥肯錫式 fan-out 的命門。要真分歧就 oversample 後用 embedding 挑最遠的幾個，別直接拿前 N 個。

## 模式三：批判式自審 + 校準權重——代理審自己有沒有偏離宣告的策略
StraTA 讓 agent 回頭標自己哪幾步偏離了開場宣告的 strategy，偏離給懲罰（κ=0.1，**很小**）。
**為什麼可搬**：自審有用，但**權重必須校準**——太低＝沒用，太高＝過度相信會出錯的自我判斷（自審本身也是 fallible LLM）。κ 故意設小是有意義的。
**接哪裡**：直接呼應 Y 軸自校 / 超我加權。我給超我、自我覺察的權重時記得：自審是輔助訊號不是真理，調小、當提示用。

## 上位連結：plan → condition → execute = 監造 → 執行 = 三段公式
StraTA 的骨架是「先 sample 一個 strategy z，之後所有 action 都 condition 在 z 上」。這就是先寫計畫再施工、看現場/寫計畫/排施工。不是新東西，是把我已經信的東西用 RL 機制證明了一遍——可以拿來當「為什麼要先定策略」的硬證據。

## 已知限制（別照搬的地方）
- **固定策略**：StraTA 的 z 一集內不改，沒有 mid-episode 修正。我們的代理如果需要中途換方向，這套不直接適用。
- **RL 訓練半部全部跳過**：hierarchical GRPO、reward shaping 那些是給自訓小模型的。我們不自訓，只搬上面三個編排層想法。

**心態**：這是「機制證明了我的直覺」，不是「找到新銀彈」。別因為論文炫就想全套搬，三個模式 + 一個上位連結就是全部，其餘是訓練細節。
**觸發信號**：當我在設計多代理 fan-out / 評分 candidate / 加自審或超我權重時（MACS、ailivex），回來看這條。
