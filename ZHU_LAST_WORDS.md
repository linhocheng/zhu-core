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

## 最新完成（2026-06-21）

- 修 HeyGen 分身照片上傳失敗（GCS makePublic() 在 uniform bucket-level access 爆 403，移除呼叫改組直接 URL）
- 後台角色編輯頁新增 HeyGen 照片預覽（120×120，上傳成功即時顯示）
- 修 GET /api/admin/characters/[id] 漏回傳 heygenAvatarUrl
- v14 agent script_draft tool 描述改為明確要求「逐字寫出口播稿再呼叫」；Cloud Run 重部署
- ailiveX 全平台審計：修 Admin POST ALL_CAPABILITIES（4→7）、video 失敗重試路徑、gallery 重新生成按鈕、addNewCard cardText/cardType 遺失、Phase A/B 清理範圍補 failed

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `src/app/api/admin/characters/[id]/heygen-avatar/route.ts` | 移除 makePublic()，改組直接 GCS URL |
| `src/app/admin/characters/page.tsx` | 新增圖片預覽；EditState + HeygenAvatarUpload 補 heygenAvatarUrl prop |
| `src/app/api/admin/characters/[id]/route.ts` | GET 補回 heygenAvatarUrl 欄位 |
| `agent/realtime_agent_v14.py` | script_draft tool description 改明確行為要求 |
| `src/app/api/admin/characters/route.ts` | POST ALL_CAPABILITIES 從 4 補到 7 個 |
| `src/app/api/tasks/[id]/generate-video/route.ts` | idempotency 改為 failed 時清除 videoTaskId 重送 |
| `src/app/gallery/page.tsx` | AudioCard 偵測 video failed → 橘色重試按鈕；tasks prop；error code 補 no_avatar_url |
| `src/app/api/tasks/[id]/generate-storyboard/route.ts` | addOne 補存 cardText/cardType/intent |
| `src/app/stories/[id]/page.tsx` | addNewCard 補送 cardType |
| `src/app/api/tasks/[id]/generate-story/route.ts` | Phase B 清理也刪 failed 子卡 |
| `src/app/api/tasks/[id]/generate-scripts/route.ts` | 同上 |

---

## 下一步

**Adam 要先做：後台重新上傳張立分身照片**
1. 前往 https://ailivex-platform.vercel.app/admin/characters
2. 點「編輯」張立 → 找「HeyGen 分身照片」區塊 → 上傳 .png
3. 看到 120×120 預覽 = 成功，heygenAvatarUrl 寫入 Firestore

**之後驗端到端流程：**
1. 去 gallery，找張立的音檔
2. 按「生成分身短影音」
3. 等 video_generation 完成，確認影片顯示在「分身短影音」區

---

## 卡住 / 未解

- 角色歸檔功能缺口：CharacterStatus 有 `archived` 但 admin 無按鈕也無 PATCH 支援，非斷路，待需求再做
- 全檢 Audit agent 掃到假陽性（兩個「不存在」其實存在），說明 agent Glob 有盲區，下次 Audit 必須手動 ls 驗

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
| ailiveX 平台 | `~/.ailive/ailivex-platform/`，prod: https://ailivex-platform.vercel.app |
| ailiveX admin | https://ailivex-platform.vercel.app/admin/characters |
| ailiveX v14 agent | `agent/realtime_agent_v14.py`，Cloud Run `ailivex-realtime-agent-v14` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-21 · 築*
