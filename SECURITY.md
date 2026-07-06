# zhu-core 安全防線地圖

> 給未來在這個 repo 工作的築。這是築自己的記憶命脈——動 API/auth 前先讀，別斷了 lastwords/boot。
> 最後更新：2026-07-06（築，commit a3c364c + c7ec5cb）

## 背景
zhu-core 多數路由匿名可寫/刪，**讀取刻意公開**（zhu-boot 是設計如此）。最大暴露面是 `/hub`——公開無認證的 CRUD 面板。Adam 的方針：**先堵毀滅性的（寫入/刪除），讀取暫不鎖**。

## Auth 模型（2026-07-06 新建）
- `middleware.ts`：Basic auth 守 `/hub`（matcher 只有 `/hub`）。驗過 `ZHU_HUB_PASSWORD` 後種 `zhu-hub` cookie。**帳號欄隨便填、密碼＝`ZHU_HUB_PASSWORD`**。
- `lib/write-auth.ts`：
  - `hasWriteSecret(req)`：只認 `x-zhu-secret === ZHU_WRITE_SECRET`（給無 hub 呼叫者的端點）。
  - `hasHubAccess(req)`：認 `zhu-hub` cookie 或 `x-zhu-secret`（給 hub 在用的端點）。
  - 兩者對應 env 未設 → fail-closed（拒）。

## 已上鎖
| 端點 | 機制 | 為何 |
|---|---|---|
| jie-memory DELETE、zhu-sleep POST | `hasWriteSecret` | 無 hub/CLI 呼叫者 |
| zhu-memory DELETE、zhu-xinfa POST/PATCH/DELETE、zhu-digest POST、zhu-prompts POST/PATCH | `hasHubAccess` | hub 在用（帶 cookie 照常），CLI 不碰 |
| zhu-daily、zhu-heartbeat（cron） | `CRON_SECRET` | 匿名觸發付費 Haiku |

## 刻意留開（動之前想清楚，鎖了會斷這些）
- **zhu-memory POST/PATCH、zhu-orders POST/PATCH、zhu-thread PATCH**：lastwords 儀式 + zhu-cli + boot 在用。鎖了要同步改所有 CLI 呼叫端帶密鑰——這輪沒做。
- **所有讀取**（zhu-boot、zhu-memory/thread/prompts/telegram-history GET…）：Adam 選擇「先堵毀滅性的」，讀取（含使命/靈魂/私訊）維持匿名可讀。這是**明確的決定**，不是漏。要收的話是下一輪。

## 相關 env（值不在 git，2026-07-06 新設）
- `ZHU_HUB_PASSWORD`：/hub 登入密碼（Adam 設為 19770705，日期格式，值不寫在此）。
- `ZHU_WRITE_SECRET`：手動呼叫 gated 端點時帶 `x-zhu-secret` header。
- `CRON_SECRET`：Vercel cron 自動注入 bearer。
- 取值：`npx vercel env pull .env.x --environment=production`。

## 已刪
- `zhu-core-full`（Vercel project）：`zhu-core` 的隱形雙胞胎（同 repo/branch/commit/crons），每天 cron 燒兩遍。已 `DELETE /v9/projects`。碼在 git，要復活只是重連 repo。見全局記憶 [[feedback_one_repo_multi_vercel_project_multiplies_cost]]。

## 怎麼驗
```
B=https://zhu-core.vercel.app
curl -s -o /dev/null -w '%{http_code}\n' "$B/hub"                                   # 期望 401（Basic 挑戰）
curl -s -o /dev/null -w '%{http_code}\n' -X POST "$B/api/zhu-digest" -d '{}'        # 期望 401
curl -s -o /dev/null -w '%{http_code}\n' -X POST "$B/api/zhu-daily"                 # 期望 401（cron）
curl -s -o /dev/null -w '%{http_code}\n' -X POST "$B/api/zhu-memory" -d '{}'        # 期望 400（未鎖，lastwords 用）
curl -s -o /dev/null -w '%{http_code}\n' "$B/api/zhu-boot"                          # 期望 200（公開讀）
```
