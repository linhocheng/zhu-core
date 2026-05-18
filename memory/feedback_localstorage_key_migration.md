---
name: localStorage key 改名要補 migration
description: 改 localStorage key 名稱後，舊 session 的 conversationId 遺失，用戶要重開對話
type: feedback
originSessionId: e7fef053-2e54-4602-81cf-9381f50059ae
---
改 localStorage 的 key 名稱時，舊的值不會自動搬移——deploy 後用戶 refresh，舊 session 消失。

**Why:** Phase 3 把 ChatScreen 的 `chat_conv_${charId}` 換成 useChat 的 `conv-${charId}`，deploy 後所有舊 session 遺失，用戶要重新開對話才能繼續。

**How to apply:** 任何改 localStorage key 名稱的 PR，init 時加一段 migration：讀舊 key → 有的話搬到新 key → 刪舊 key。一行不需要後端，deploy 後無縫過渡。

```ts
// 範例 migration（放在 useEffect init 裡）
const oldKey = `chat_conv_${characterId}`;
const newKey = `conv-${characterId}`;
const oldVal = localStorage.getItem(oldKey);
if (oldVal && !localStorage.getItem(newKey)) {
  localStorage.setItem(newKey, oldVal);
  localStorage.removeItem(oldKey);
}
```

**觸發信號:** 改任何 hook/component 的 localStorage key 名稱時。
