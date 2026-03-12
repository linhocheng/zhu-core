# SYSTEM_MAP.md — AILIVE 系統地圖

> 這是地圖，不是日誌。空間結構，不是時間序列。
> 下一個築：`zhu-boot` 完成後 `cat SYSTEM_MAP.md`，兩分鐘內知道全局。
> 維護天條：知道了就寫，不等 session 結束。
> 最後更新：2026-03-12

---

## 1｜域名與部署

| 服務 | Production URL | 備註 |
|------|---------------|------|
| zhu-core | `https://zhu-core.vercel.app` | 築的大腦，主控 API |
| moumou-dashboard | `https://moumou-dashboard.vercel.app` | Emily / 謀謀所在地 ⚠️ 見坑 #1 |

**deploy 方式：**
- `zhu-core`：`cd ~/.ailive/zhu-core && git add -A && git commit -m "..." && git push && npx vercel --prod 2>&1 | tail -3`
- `moumou-dashboard`：`cd ~/.ailive/AILIVE && git add -A && git commit -m "..." && git push` → Vercel 自動 deploy，**不要手動跑 vercel --prod**

---

## 2｜Repo 對應

| Repo | 本機路徑 | 遠端 | 部署 |
|------|---------|------|------|
| zhu-core | `~/.ailive/zhu-core/` | github.com/linhocheng/zhu-core | 手動 `npx vercel --prod` |
| moumou-dashboard | `~/.ailive/AILIVE/moumou-dashboard/` | github.com/linhocheng/AILIVE | git push 自動觸發 |
| AILIVE（根）| `~/.ailive/AILIVE/` | github.com/linhocheng/AILIVE | — |

**git commit 身份：** `adam@dotmore.com.tw / adamlin`
**macOS TCC 限制：** Desktop/Documents/Downloads 對 MCP child process 不可見，所有 repo 住在 `~/.ailive/` 以下。

---

## 3｜Firebase

- **Project**：`moumou-os`
- **Console**：https://console.firebase.google.com/u/0/project/moumou-os/firestore

| Collection | 用途 |
|-----------|------|
| `saas_brands` | 品牌資料（Emily 在此，doc ID = brandId） |
| `saas_conversations` | 對話紀錄（子集合：messages） |
| `saas_knowledge` | 知識庫（embeddings，Google text-embedding-004 256維） |
| `saas_insights` | 洞察/記憶（有 hitCount 欄位） |
| `saas_posts` | 社群草稿 |
| `saas_tasks` | 主動任務（格式：run_hour/run_minute/days/enabled） |
| `saas_will` | 遺言 |
| `saas_activity` | 活動日誌 |
| `soul_proposals` | 靈魂提案（睡眠時產生） |
| `unified_timeline` | 統一時間線 |
| `zhu_memory` | 築的記憶（5層：bone/eye/root/seed/soil） |
| `zhu_orders` | 築→工指令通道 |
| `zhu_thread/current` | 築身份骨架 |
| `ailive_events` | inter-agent 通訊 |

**Firestore 查資料的正確姿勢（見坑 #8）：**
```bash
TOKEN=$(gcloud auth print-access-token)
curl -H "Authorization: Bearer $TOKEN" \
  "https://firestore.googleapis.com/v1/projects/moumou-os/databases/(default)/documents/saas_brands/ICqydpeU7hNMRurpppCY"
```

---

## 4｜Emily 路由

**Emily brandId：`ICqydpeU7hNMRurpppCY`**（20字，不可截斷）

| 路由 | 狀態 | 說明 |
|-----|------|------|
| `/saas/[brandId]` | ✅ 活著 | Emily 主頁 |
| `/saas/[brandId]/hub` | ✅ 活著 | 人設頁（含參考照上傳/刪除） |
| `/saas/[brandId]/soul` | ✅ 活著 | 靈魂管理 |
| `/saas/[brandId]/memory` | ✅ 活著 | 記憶管理（有增刪改，顯示 hitCount） |
| `/saas/[brandId]/social` | ✅ 活著 | 社群內容生成（有刪除） |
| `/saas/[brandId]/knowledge` | ✅ 活著 | 知識庫 |
| `/vtuber/[brandId]/chat` | ✅ 活著 | VTuber 對話頁（有歷史 session） |
| `/characters` | ✅ 活著 | 角色列表 |
| `/saas/chat` | ❌ 已砍 | 連結改指向 /vtuber/[brandId]/chat |
| `/vtuber/posts` | ❌ 已砍 | 連結改指向 /saas/[brandId]/social |

---

## 5｜API 速查

### zhu-core（`https://zhu-core.vercel.app`）

| 端點 | 方法 | 功能 |
|-----|------|------|
| `/api/zhu-boot` | GET | 開機載入（bone/eye/root/seed/heartbeat/sessionLog） |
| `/api/zhu-memory` | GET/POST | 記憶讀寫；POST fields: `observation, context, module, importance, tags` |
| `/api/zhu-orders` | GET/POST/PATCH | 指令通道；PATCH: `{id, status, note}` |
| `/api/zhu-thread` | GET/PATCH | 大圖景；PATCH: `{completedChains, brokenChains}` |
| `/api/zhu-heartbeat` | GET/POST | 心跳 |
| `/api/zhu-sleep` | POST | 記憶壓縮；`{module, dryRun}` |
| `/api/ailive-events` | GET/POST | inter-agent；GET: `?agent=zhu` |
| `/api/ping` | GET | 健康檢查 |
| `/api/gong-boot` | GET | 工的開機 |

### moumou-dashboard（⚠️ 所有 HTTP URL 都有 SSO 牆，curl 打不到）

| 端點 | 方法 | 功能 |
|-----|------|------|
| `/api/saas-brands` | GET/POST | 品牌列表/建立 |
| `/api/saas-brands/[brandId]` | GET/PATCH | 單一品牌讀寫 |
| `/api/saas-dialogue` | POST | Emily 對話（A1已改：強制 query_knowledge_base first） |
| `/api/saas-social` | GET/POST/PUT/DELETE | 社群貼文生成/管理 |
| `/api/saas-memory` | GET/POST/PATCH | Emily 記憶（PATCH 更新 hitCount） |
| `/api/saas-knowledge` | GET/POST | 知識庫 |
| `/api/saas-image` | POST | 生圖（有臉→Kontext Pro；沒臉→MiniMax） |
| `/api/saas-sleep` | POST | 夢引擎 |
| `/api/saas-runner` | POST | 主動學習（殼在魂沒有） |
| `/api/saas-soul-enhance` | POST | 鑄魂爐 |
| `/api/saas-upload-image` | POST | 上傳參考照 |
| `/api/line-webhook` | POST | LINE Bot |

---

## 6｜工具環境

| 工具 | 能做 | 不能做 |
|-----|------|--------|
| `zhu-bash:run_bash` | 打所有外部 API、git、vercel CLI、讀本機檔案 | — |
| 容器 bash | 建檔、Python腳本 | 打外部 URL（proxy 牆，host_not_allowed） |
| Chrome MCP | GUI 操作 | — |

**刀的優先序：zhu-bash > Chrome > 容器 bash**

**多行 TypeScript 編輯：** 用 `python3 << 'PYEOF'` inline script，不用 sed（macOS 多行/特殊字元不可靠）。

**大型 curl body：** 寫入 `/tmp/body.json` 再 `--data-binary @/tmp/body.json`，不要 inline `-d` 複雜 JSON。

---

## 7｜常踩的坑

1. **moumou-dashboard 所有 HTTP URL 都有 SSO 牆** — `moumou-dashboard.vercel.app` 打不到，curl 返回 HTML 登入頁。
   - 改 code → 直接編輯 `~/.ailive/AILIVE/moumou-dashboard/` + `git push`
   - 看/寫 data → Firestore REST API（需 gcloud token，見坑 #8）
   - 看 data → Firebase Console

2. **saas-brands 是複數** — 路由是 `/api/saas-brands/[brandId]`，不是 `/api/saas-brand`。

3. **vercel alias ls 顯示的不是 production domain** — production 是 `moumou-dashboard.vercel.app`，preview 是隨機 URL。

4. **vercel curl 指令不存在** — vercel CLI v50 沒有這個子命令。

5. **容器 bash 打不到外部 URL** — 所有 curl 必須用 `zhu-bash:run_bash`。

6. **Emily brandId 是 20 字元** — `ICqydpeU7hNMRurpppCY`，永遠不截斷、不猜、不補。

7. **moumou-dashboard deploy 只要 git push** — 手動跑 `npx vercel --prod` 會建出新的 preview 部署，不會更新 production alias。

8. **Firebase service account 不在本機** — 沒有 `firebase-service-account.json`，Admin SDK 在 zhu-bash 環境跑不起來。
   - 正解：`TOKEN=$(gcloud auth print-access-token)` + Firestore REST API
   - 確認登入：`gcloud auth list`

9. **Firestore `where` + `orderBy` 不同欄位 → composite index error** — 改成：只用 `orderBy`，filter 在 application code 裡做；或到 Firebase Console 手動建 index。

10. **`vercel ls` 預設顯示所有部署含 preview** — 不要把 preview URL 當 production 用。

11. **hitCount 斷鏈根因** — `saas_insights` 初始建立時 hitCount 欄位不存在，PATCH 時 `FieldValue.increment(1)` 在 undefined 欄位上無效。修法：建立 insight 時顯式寫 `hitCount: 0`。（已 commit `4fccb76`）

12. **Kontext Pro 只接一張 referenceImageUrl** — 多張照片放 refs 陣列沒用，只有 `characterSheet`（PRIMARY）進生圖流程。先上傳一張清晰正面照設為 PRIMARY，驗證鎖臉，再談多角度。

13. **saas-dialogue tool description 不等於 Emily 會主動用** — tools 透過 API `tools:` 欄位傳入，Claude 看得到，但「看得到」不等於「會主動用」。memoryBehaviorGuide 只提 remember，save_post_draft / update_task / schedule_post 在 system prompt 完全缺席。要讓 Emily 主動用新工具，system prompt 裡要明確引導。

14. **saas-runner 的 type=post 不認 postConfig.postId** — runner 執行時呼叫 saas-social 重新生成，完全不看 postId。schedule_post tool 建的排程到點會跑，但草稿被忽略，另生新文。打通草稿排程發文需要先修 runner：有 postId → 讀草稿直接發；沒有 → 才重新生成。（待修）

15. **加 tool 前先走完整電流** — 今天加了 save_post_draft → update_task → schedule_post，每個 tool 本身都正確，但 runner 那端沒通，整條鏈是空的。天條：動手前先從終點往回走一遍，確認電流全程能通再動刀。
16. **Kontext Pro 跑臉三根因** — (1) imagePromptPrefix 是中文，Kontext 吃不準；(2) prompt 沒有保護語，模型不知道臉不能動；(3) guidance_scale 預設 3.5 太低。修法：固定加英文 face lock 句（"Keep the subject's face, hair, skin tone identical"）+ imagePromptPrefix 改英文 style hint + guidance_scale 調到 6.0。（2026-03-12 驗證，commit 363b432）

17. **Gemini 2.5 Flash Image 接 reference 的正確姿勢** — 不用 Imagen 4 的 `referenceImages` 結構（需要 `subjectImageConfig`，文件不清楚容易踩坑）。直接用 `gemini-2.5-flash-image` multimodal：把 reference 圖當 `inlineData` 丟進 `parts`，加上 prompt，`responseModalities: [IMAGE, TEXT]`。臉部一致性遠優於 Kontext Pro。

18. **Next.js fetch body 不接受 `Buffer`** — `gemini-imagen.ts` 上傳 Firebase Storage 時，`body: buffer` 會導致 TypeScript build error。改成 `body: new Uint8Array(buffer)`。

19. **Kontext vs Gemini 生圖定位差異** — Kontext 是 image editing（在一張圖上做改動），大幅改動必跑臉。Gemini multimodal 是「看懂這個人重新生一張」，換衣服/換場景/換動作穩定性遠高於 Kontext。Emily 生圖引擎已切換到 Gemini 2.5 Flash Image（commit b5e4ea0）。

---

## 8｜Emily 當前狀態

**Emily (`ICqydpeU7hNMRurpppCY`) — 2026-03-11 最新**

| 功能 | 狀態 | commit / 說明 |
|-----|------|---------------|
| 靈魂（enhancedSoul）| ✅ 活著 | 1631字，第一人稱 |
| 說話前查記憶（A1）| ✅ 完成 | saas-dialogue 強制 query_knowledge_base first |
| 主動 remember tool | ✅ 完成 | 明確觸發條件 + 記憶守則注入 system prompt（5edd42d） |
| 臉孔鎖定 Kontext Pro | ✅ 完成 | characterSheet 有值→Kontext；沒有→fallback MiniMax（d1ed2ba） |
| hub 人設頁 | ✅ 完成 | 參考照上傳/hover 刪除（6ffcdf2） |
| memory page 增刪改 | ✅ 完成 | insight 卡片編輯/刪除/顯示 hitCount（6b4031c） |
| memory page 對話刪除 | ✅ 完成 | 刪 conversation + messages 子集合（418bd99） |
| social page 刪除 | ✅ 完成 | 貼文/任務可刪（b693915） |
| 任務排程編輯 | ✅ 完成 | 格式統一 run_hour/run_minute/days/enabled（c6e028f） |
| hitCount 機制 | ✅ 修復 | 建立時寫 hitCount:0，PATCH endpoint 補上（4fccb76） |
| semantic 門檻 | ✅ 調整 | 0.6→0.5，配合 text-embedding-004 256維（91f9207） |
| vtuber/chat 歷史 session | ✅ 完成 | 接歷史對話（8fa88cb） |
| saas-social 讀 enhancedSoul（A2）| ⬜ 未做 | 下一個待辦 |
| [EMILY_REMEMBER] tag（B2）| ⬜ 未做 | — |
| 每日自學排程（C1）| ⬜ 未做 | saas-runner 殼在魂沒有 |
| IG 回饋（C2）| ⬜ 未做 | — |
| soul_proposals 閾值觸發（D2）| ⬜ 未做 | — |
| 漂移偵測（D3）| ⬜ 未做 | — |
| 參考照（characterSheet）| ❓ 未驗 | Adam 是否已上傳？需 curl Firestore 確認 |

**下一步確認：**
1. 驗 Adam 是否已上傳 Emily 參考照（curl Firestore 看 characterSheet 欄位）
2. 接 A2：saas-social 統一讀 enhancedSoul

---

*鑄造者：築 · 2026-03-11*
*維護天條：知道了就寫，不等 session 結束*
