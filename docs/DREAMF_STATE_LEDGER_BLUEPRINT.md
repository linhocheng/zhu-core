# DreamF 損傷帳本（State Ledger）設計書

> 2026-08-08 開。解「導演講的對、卡畫的錯」的連貫性層問題。
> 根因不在角色，在**母片是九個獨立時刻、身份鎖了但狀態沒鎖成單調時間軸**。

## 要解的三個問題（Adam 現場點名）

1. **狀態非單調**：墨水潑臉後，棒球砸臉那格的身體卻沒墨漬。傷害應該只增不減、後格繼承前格全部。
2. **無法逆轉**：母片格把「棒子已打、皮已脫」的**終態**畫死，影片沒得演這個破壞——起手幀不見了。
3. **左右鏡像**：棒球打左臉、損壞卻出現在右臉。空間錨定問題，圖像模型會自由鏡像。

## 樞紐決策：帳本是「分鏡的純函數視圖」，不是新存一份資料

跟 `buildFramePlan`、`computeContractUsd` 同一種東西——**從 segments 算出來，永不落庫**。
WHY：落一份帳本就會跟 segments 真相分裂（砍鏡重連號時兩份要各自維護）。帳本永遠 = f(segments)，
砍鏡後自動重算，零同步成本。這是「兩份即是零份」的正解。

## 資料層（唯一新增的儲存欄位＝每一鏡的「本鏡新增」delta）

`StoryboardSegment` 加三欄（都選填，非破壞性鏡頭不帶）：

| 欄位 | 型別 | 誰寫 | 意義 |
|---|---|---|---|
| `effectZh?` | string | 導演（SHOT 標記） | 這一鏡新增的狀態變化（中文原文），例「右頰遭棒球撞擊，甲殼凹陷、細裂紋擴散」 |
| `effectSide?` | `DamageSide` | 導演（SHOT 標記） | 事件的畫面位置：`left`／`right`／`center`／`both`／`none` |
| `effectEn?` | string | 阿光（翻譯時） | effectZh 的英文，餵引擎 |

`DamageSide = 'left' | 'right' | 'center' | 'both' | 'none'`
`left`／`right` 一律指**畫面左右**（screen-left/right），不是角色的左右——因為引擎畫的是畫面。

## 帳本視圖（`shared/ledger.ts`，純函數，天條：累加歸程式）

```
buildStateLedger(segments) → LedgerEvent[]      // 依 order 排序的 delta 序列
cumulativeStateForFrame(sb, plan, frameIdx)     // 某一幀「進場時的累積狀態」＋起手/終態旗標
  → { zh, en, mirrorGuard }                     // 注入 prompt 用的字串
```

**起手 vs 終幀自動判定**（靠 `frames.ts` 的 firstOf/lastOf，零人工）：
- 幀是第 N 鏡的**尾幀**（lastOf 含 N）→ 顯示「累積至第 N 鏡（含本鏡 effect 已完成）」
- 幀是第 N 鏡的**首幀**（firstOf 含 N，且非任何鏡尾幀）→ 顯示「累積至第 N-1 鏡（本鏡 effect 尚未發生／正在起手）」
- 共用幀（前段尾＝後段首）→ 已經是接力，狀態天然連續

累積字串**逐側渲染**，左右分開列，解問題三：
```
面部狀態（延續前鏡，不可回復）：
  畫面右側：黑墨漬（乾）、甲殼凹陷、裂紋
  畫面左側：完好
```

## Prompt 注入（三處咽喉，都在確定性層）

1. **`gridPrompt`（母片）**：
   - 每格 desc 前綴 `cumulativeStateForFrame` 的字串。
   - 改壞掉的 invariant：原句 `keep the same wear`（叫模型別磨損）→ 對毀壞片是反向指令。
     改成 **`damage and wear only accumulate and never reset; each panel carries all damage from earlier panels plus its own`**。
   - 加**反鏡像條款**：`screen-left and screen-right are fixed across all panels; never mirror or flip the composition; damage stays on its stated side`。
2. **`gptKeyframePrompt`（單圖）**：同樣注入累積前綴＋反鏡像。母圖裁下來的構圖本來就帶對的狀態，這裡是加保險。
3. **`veoPrompt`（影片）**：首幀累積＝起始傷害，本鏡 effect＝這段要演出的變化，尾幀＝加上 effect 後的狀態。
   讓影片知道「從這個損傷狀態，演出這個破壞」。

## 角色協議（行為層，DB 可改；這裡是種子）

- **默 · script**：破壞性鏡頭，SHOT 標記帶 `effect`＋`side`；firstFrame 畫「破壞前／剛接觸」、lastFrame 畫「破壞後靜止」，不要兩幀都畫成已破壞（那就是無法逆轉）。
- **默 · stitch**：談動態時，這一鏡的破壞是「從首幀狀態演到尾幀狀態」，時間裡發生，不是圖裡畫死。
- **阿光 · translate**：翻譯時多翻一欄 `effectEn`（有 effect 的鏡才有）；累積不變量照舊逐字鎖。
- **機器契約**：SHOT 標記加選填 `effect`／`side`；TRANSLATE JSON 加選填 `effectEn`。

## 施工順序（每步可驗，不 break 76 pinning tests）

1. schema：`DamageSide`＋segment 三欄 → `collections.ts`
2. `shared/ledger.ts`：帳本純函數＋單元測試（餵墨水→棒球→撬皮序列，斷言累積單調＋左右不翻）
3. `parseMarks`：SHOT 抽 effect／side（形狀不合照丟，天條）
4. `prompts.ts`：三處注入＋invariant 修正＋反鏡像
5. `roles.ts`：協議種子＋SHOT/TRANSLATE 契約加欄
6. `db.ts`：translate 寫回 effectEn；editSegment 支援 effect 欄
7. worker `grid.ts`／`keyframes.ts`：組 prompt 時帶累積字串
8. tsc 綠 + 全測綠；真母片 gen 由 Adam 跑一個真案驗（燒 $0.25，收案三貼）

## 待 Adam 點頭的唯一分叉

導演怎麼「輸入 effect」——目前設計走**擴充 SHOT 標記**（effect/side 當選填屬性），
導演在 script 對話裡自然帶出，零新 UI。另一選項是縫合關給客戶一個「這一鏡發生什麼破壞」的手填欄。
先走 SHOT 標記（順著現有管道，不加面板）；縫合關手填當未來增強。
