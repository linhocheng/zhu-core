---
name: AI 多層 prompt pipeline 黑盒除錯 SOP
description: 生圖/生文 結果不對時，沿著 brief→soul→指令→prefix→最終 prompt 的鏈，先把每層真相寫回資料庫再診斷
type: feedback
originSessionId: cd12194a-60a1-4972-b56c-46cb39bf6210
---
當生圖（或任何 LLM pipeline）結果跟 brief 不符（背景應該亮卻全黑、應該活潑卻嚴肅、構圖不對等），不要再只看「我的 brief 寫了什麼」就開始猜。

## 真正的問題：prompt 是被多層組裝的

ailive 的生圖流是這樣疊出來的：

```
user brief
  → dialogue 工具 (generate_image / commission_specialist) 改寫
    → platform_jobs.brief.prompt
      → /api/specialist/image 把 shun-001 的 system_soul + soul_core 戴上
        → Sonnet 4.6 動腦寫成英文 PROMPT
          → 串上 visualIdentity.imagePromptPrefix（Firestore 存的固定字串）
            → 真正送進 Gemini 的 final prompt
```

**每一層都可能用「無聲改寫」吃掉你的 brief**。例：shun-001 的 prefix 一度寫死「dark background, chiaroscuro lighting」 → 不管你 brief 寫多亮都是黑底。

## 觸發信號（看到這些就停手診斷）

- 同一個 brief 連兩次出來都偏向某個固定特徵（光線、構圖、色調）
- 改 brief 的修飾詞沒效（加「明亮」沒亮、加「俯視」沒俯視）
- 「我以為改 X 就會生效」但結果一樣 → 通常是上游/下游某層蓋過

## Why
2026-05-08 vivi 生圖背景全黑，初診斷以為是 gemini 模型版本問題（F1），改完還是黑。真因是 shun-001 的 imagePromptPrefix 在 Firestore 裡寫死「dark background, chiaroscuro lighting」串在每個 prompt 後面，靈魂後台表面上能編但實際看不到 prefix 欄位的存在感。連續猜兩次都中不了根因。

## How to apply

**第一動作：先讓真相可見，再診斷**。不要在沒看到「真正送進去的 final prompt」之前就開始改參數。

1. 在 pipeline 終點寫回 debug 欄位到資料庫（不影響主流程的 dot notation update）：
   - `output.geminiPrompt`（最終送進 model 的字串）
   - `output.imagePromptPrefix`（角色靈魂 prefix）
   - `output.refsUsed`（實際下載成功的 ref URLs）
2. 在 dashboard/UI 燈箱面板把這些一起顯示，叫做「真相鏈」
3. 對賬順序：brief.prompt（user 想要的）→ geminiPrompt（系統實際送的）→ 圖（model 生的）。哪一段不一致就是哪一層偷改

**檔案參考**：
- 寫回真相：`src/app/api/specialist/image/route.ts` step 5.1（dot notation 寫回 platform_jobs.output）
- API 帶出：`src/app/api/images/route.ts` ImageRec 欄位
- UI 面板：`src/app/dashboard/[id]/images/page.tsx` 燈箱右側 DebugRow
- 改靈魂 prefix：`/dashboard/{characterId}/identity` 已有編輯 UI，或寫 script `scripts/fix-shun-prefix.ts`

**衍生天條**：當你說出「應該是 X 的問題吧」連續兩次都沒中 → 立刻停止猜，先把 pipeline 每層真相外部化（寫回 DB / log），用對賬法找差異，不要再用直覺。

## 觸發信號（給未來的我認）

- 「我改了，怎麼還是這樣」
- 「應該是 model 的問題」連說兩次
- 對 LLM/生圖結果不滿但只盯著自己的 brief 看
- 看不到「實際送進去的 final prompt」就開始改參數
