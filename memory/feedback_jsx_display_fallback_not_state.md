---
name: JSX display fallback ≠ React state
description: `value={x ?? 'default'}` 只影響顯示，不寫進 state；用戶不互動就存檔 → default 丟失
type: feedback
---

`<select value={vs.field ?? 'default'}>` 是 controlled component 的顯示值，不是 state 初始值。

**Why:** 2026-06-25 ailivex admin emotion bug：UI 顯示 neutral，但 `voiceSettings.emotion` 是 undefined，存檔後 Firestore 裡 voiceSettings 永遠是 `{}`。用戶以為設定了，其實沒存進去。

**How to apply:** 凡是有 display fallback（`?? 'default'`）的 controlled input，初始化 state 時必須同步填入該 default：
```tsx
// ❌ 錯：只顯示 neutral，不寫進 state
<select value={vs.emotion ?? 'neutral'} ...>

// ✅ 對：初始化就填 default
useState<VoiceSettings>({ emotion: 'neutral' })
setEditing({ voiceSettings: { emotion: 'neutral', ...serverData } })
```
