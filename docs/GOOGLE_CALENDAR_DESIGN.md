# Google Calendar 整合設計藍圖

> 狀態：設計完成，待動工
> 日期：2026-03-26

---

## 定位

秘書 + 共生。角色不只幫查行程，也根據行程調整自己的行為。

## 授權方式

Service Account（最短路徑，Adam 自己用）
- Email：`firebase-adminsdk-fbsvc@moumou-os.iam.gserviceaccount.com`
- 不需要 OAuth，不需要建新 SA
- Adam 只需在 Google Calendar 共享給上面這個 email（查看所有活動詳情）

## 電流

```
1. Adam 共享行事曆給 SA email
2. 角色 tools：query_calendar（查行程）+ create_event（建事件）
3. system prompt 天條：有人問行程 → 先 query_calendar
4. runner 共生：每天早上讀今日行程 → 注入 episodicBlock
```

## 待蓋清單

- [ ] Adam 手動共享行事曆給 SA（前置條件）
- [ ] `/lib/google-calendar.ts` — Calendar API 封裝
- [ ] `query_calendar` tool 加進 dialogue（ailive-platform + dreamfactory）
- [ ] `create_event` tool 加進 dialogue
- [ ] runner 讀今日行程注入 episodicBlock
- [ ] `/api/calendar` — 後台預覽行程（可選）

## 行事曆 ID

Adam 的主要行事曆 ID = `adam@dotmore.com.tw`（待確認）

