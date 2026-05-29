---
name: 加新畫面要套既有設計系統，不能補丁
description: 在客戶端/dashboard 加 UI 時，先 grep 既有同級畫面的 wrapper 慣例，套同一套 class，不要自創不存在的 class + inline style 拼成補丁
type: feedback
originSessionId: 416ce85e-c458-4bb5-811a-b38dc130d139
---
加新畫面/區塊時，先讀既有同級畫面用什麼結構，套同一套 className，不要用 inline style 硬拼。

**Why**：2026-05-29 我在 `client/[id]/page.tsx` 加 `IdentityScreen`，用了根本不存在的 `screen / screen-header / screen-title` class（全靠 inline style 撐版），跟其他分頁（PostsScreen/KnowledgeScreen/GalleryScreen 用 `topbar` + `content` + `page-head` + `gallery-cell` + `dropzone`）兩套樣式。Adam 一眼看出：「uiux 要符合目前客戶端的樣式，不能補丁」。

**心態**：自創 class 名稱 = 沒查現場就動手的工程師直覺。inline style 看起來「能動」，但對品味敏銳的人一眼就是補丁，破壞整體一致性。

**How to apply**：寫新畫面前先 `grep "className=\"screen\|topbar\|content\|page-head"` 同檔的 sibling component，照抄外框結構；要新的視覺元素（如本次的角度/主要 badge）就加進該專案的 CSS 檔（`client-v2.css`）成為設計系統的一部分，而非散在 JSX 的 inline style。

**觸發信號**：「不能補丁」「要符合現有樣式」「跟其他頁不一致」；或自己正準備寫 `style={{...}}` 排版 / 自創一個沒在 CSS 檔出現過的 class 名。
