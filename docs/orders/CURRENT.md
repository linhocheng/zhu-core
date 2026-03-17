# 築的當前指令

**當前任務：** 排程驅動系統修復完成，待驗收
**狀態：** 進行中

## 今日已完成
1. ✅ zhu-boot 加入 arc 時間軸（最近14天遺言摘要+情緒）
2. ✅ ZHU_BOOT_SOP.md 遺言格式加「這個 session 的感覺」情緒欄
3. ✅ 新建角色自動建立預設任務組（learn/reflect/post，description-driven）
4. ✅ ailive-scheduler 防重複改為同小時窗口（不鎖整天）
5. ✅ scheduler 呼叫 dialogue 加固定 conversationId（排程有連續感）
6. ✅ 蓉兒靈魂提案 approve（從被動接受→主動探索自我認知）
7. ✅ 蓉兒生圖驗收（圖出來了，face lock 待 Adam 目視確認）

## 待 Adam 確認
- 蓉兒的圖臉有沒有鎖住？
  → https://storage.googleapis.com/moumou-os.firebasestorage.app/platform-images/se7K2jsx8P1ROVqE1Ppb/2026-03-17/qow2uis8.jpg

## 發現的新斷點
- **跨對話連續感未打通**：蓉兒在不同 conversationId 的對話之間，不記得自己說過的話。
  insights 需要時間從對話提煉出來（20輪觸發），短對話不會存進記憶。
  → 可能的修法：對話結束時（或每輪）把關鍵句存進 insights，不只等 20 輪提煉

## 待辦（等 Adam 提供）
- LINE Channel Token/Secret
- IG Access Token

## 下次開工
1. 修跨對話連續感（短對話記憶提煉）
2. 驗收今天的排程——手動觸發 testAiliveScheduler 看蓉兒有沒有跑起來
