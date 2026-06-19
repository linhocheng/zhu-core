# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-19 · 第六 session · ailivex）

- 推 `7783bcc`：v13 語音 agent + 讀網址讀完不開口的 Anthropic 400 修正（SanitizingAgent override llm_node，補 `(empty)` 擋 plugin 純空格注入）。
- 推 `fc78a55`：圖庫 `/gallery` + 角色 capabilities 派發任務（製圖/生音/寫文件/搜尋）+ clean-env/safe-json 工具 + embeddings 維度自檢。22 檔，typecheck 過。
- 驗證文字版讀網址：自簽 admin cookie 打 prod `/api/dialogue`（張立）→ 維基百科準確讀到、商周（機房 IP 擋）優雅降級。

---

## 今天改了哪些檔案（第六 session）

| 檔案 | 改了什麼 |
|---|---|
| `agent/realtime_agent_v13.py` | SanitizingAgent override llm_node，trailing-assistant 補 `(empty)` 擋 400 |
| `agent/cloudbuild-v13.yaml` / `agent/main_v13.py` | v13 部署 |
| `src/app/api/livekit/token/route.ts` | v13 分支 + 回傳 webSearch |
| `src/lib/collections.ts` | DEFAULT_VOICE_VERSION→v13、TaskCapability、imageUrl |
| `src/app/realtime{,-v12,-v13}/[characterId]/page.tsx` | webSearch gate 貼網址框 |
| `src/lib/task-dispatcher.ts` + `src/app/api/tasks/callback` + `src/app/{gallery,api/gallery}` | 任務派發 + 圖庫 |
| `src/app/admin/characters/*` | 角色能力勾選 UI + 持久化 |
| `src/lib/{clean-env,safe-json,embeddings}.ts` | 工具 + 維度自檢 |

---

## 下一步

1. **反爬站讀取方案選型**：businessinsider.tw 類站擋 Vercel 機房 IP，文字+語音兩路都讀不到。要 Adam 選方向：browser-level UA / headless（@sparticuz/chromium 已在依賴）/ 住宅代理。
2. **v13 圖庫/任務派發端到端真驗**：目前只驗了 typecheck + 文字讀網址；gallery 產圖鏈（角色 dispatch image_generation → media-worker → /api/tasks/callback 回填 imageUrl → /gallery 顯示）還沒實跑一次。
3. **firestore_loader.py 清理**（working tree 未提交 -47 行）決定是否單獨 commit。

---

## 卡住 / 未解

- 反爬新聞站（商周等）擋機房 IP，未選讀取方案。
- ailivex working tree 仍留：`agent/firestore_loader.py`（-47 清理，刻意未提交）+ 一批 ad-hoc debug scripts（untracked）。下個 session 別誤以為是髒污就洗掉。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| ailivex 語音讀網址三根因 | memory `feedback_voice_url_read_datacenter_block_and_page_agent_split.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-19 · 築*
