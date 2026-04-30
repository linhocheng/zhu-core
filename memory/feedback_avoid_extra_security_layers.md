---
name: 不要為了「安全多一層」加會壞的元件
description: machine-to-machine 路徑加 SSO/Access 是搬石頭砸自己腳
type: feedback
originSessionId: 59b65b14-4e63-47ea-bc93-a67ec60b0e30
---
機器對機器的服務（Vercel → bridge、cron → API）不要加「會獨立壞」的安全層，例如 CF Access service token、SSO 中介、額外 auth proxy。

**Why**：實作 zhu-bridge 時 Adam 拉我回來：「不是安全的問題，是我們實際運作的問題」。我當時想加 CF Access 多一層 zero-trust，但 Access token 過期 / 旋轉 / 出包都會讓 bridge 對 Vercel 來說「掛了」，**多一個會壞的點 = 少一分穩定**。Bearer secret + CF Tunnel 的 HTTPS 已經夠了。

**How to apply**：每加一層元件先問「這層獨立壞掉時，使用者看到的是什麼」。如果答案是「整條服務不通」，就要重新評估值不值得。瀏覽器人類用戶才是 Access / SSO 的客人；script 跟 server 不是。
