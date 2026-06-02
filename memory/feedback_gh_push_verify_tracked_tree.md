---
name: 推 GitHub 前驗 git ls-files 不只信 .gitignore
description: gh repo create --push 前要核 git ls-files | grep node_modules/secret，root /node_modules 不擋子目錄
type: feedback
originSessionId: 13a7f36d-0420-4ca0-b0bc-25a96f5d357e
---
推 repo 上 GitHub（尤其 `gh repo create --source=. --push`）前，**不能只信 `.gitignore`，要實際核 `git ls-files`**。

**Why:** 2026-06-02 推 anews-platform 時，root `.gitignore` 寫 `/node_modules`（anchored to root），擋不到 `cloud-run/source-worker/node_modules` → 7124 個函式庫檔被一起推上去。雖然這次沒真密鑰外洩（巢狀 node_modules 裡若有 `.env` 一樣會漏），但 repo 被灌爆。正解：`.gitignore` 用 unanchored `node_modules/`，並在推前驗。

**心態:** 「.gitignore 有擋」是假設不是事實；anchored pattern（開頭 `/`）只擋 root 那層，子目錄同名要 unanchored。

**How to apply:** 推前一律跑 `git ls-files | grep -iE 'node_modules|\.env|secret|\.pem|service.?account'`，看到 node_modules 或密鑰類就先修 .gitignore + `git rm -r --cached`。push 用 HTTPS 失敗（Device not configured）時先 `gh auth setup-git` 設 credential helper。

**觸發信號:** 要把任何 working tree 推上遠端、跑 `gh repo create`、或第一次 `git push` 一個沒 remote 的 repo。
