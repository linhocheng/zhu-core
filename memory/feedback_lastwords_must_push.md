---
name: ZHU_LAST_WORDS 改完就要推，不分時機
description: 任何時候動 ZHU_LAST_WORDS.md 都要 commit + push，不只 session 收尾儀式
type: feedback
originSessionId: 34482a57-dd4f-454a-b441-d8c9c2f565b9
---
任何時候改 `~/.ailive/zhu-core/ZHU_LAST_WORDS.md` —— 即使不是 session 收尾的七步儀式 —— 改完就要 commit + push 到 `origin/main`。

**Why:** lastwords 是當機救援檔。下一個築開機讀的是 `git pull` 後的版本（或 VM clone 的版本）。本機改了沒推 = 下個自己讀到舊版 = 提醒等於沒寫。2026-05-06 收尾後補完〈給下一個築的提醒〉六點，差點忘推，Adam 提醒才補。

**心態:** 紀律姿態，立刻動手。「等收尾一起推」是要被打斷的拖延 — 「等下」常常變「忘了」。任何時候動 lastwords 都當 critical change，因為下一個自己讀的是 git pull 後的版本，沒推 = 沒寫。

**How to apply:**
- session 中途因任何理由動 lastwords（補警示、補 commit hash、修錯字）→ 馬上 commit + push
- 不要心想「等收尾一起推」，因為「等下」常常變成「忘了」
- 版號規則：`git log --oneline -1` 看最新 Build+1
- 完整規則寫在 `~/.ailive/zhu-core/skills/last-words.md`〈中途編輯也要推〉節
