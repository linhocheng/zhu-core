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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-07-09 · 兩場並行）

### 場一：ailiveX 知識庫＋方法論（v17.2.0，33e3c56）

孫武成為全平台第一個滿配角色（soul＋27 塊知識＋「廟算問診法」6 步），流程固化成兩個 zhu-core skill。
- `knowledge_docs`/`knowledge_chunks`/`methodologies` 三 collection＋`src/lib/knowledge.ts`（確定性切塊→Haiku gist→multilingual-002 嵌入→τ=0.68）＋`src/lib/methodology.ts`（遞招 τ=0.70／`[[METHOD_*]]`／activeMethodology 程式狀態機）
- 相容開關＝`character.knowledgeChunkCount/methodologyCount`（缺省角色零變化）；後台「知識與方法」頁；gist 索引解語域坍縮（目標塊 #15→#1）；vercel region 遷 hkg1
- 兩個 skill（29817b2）：`ailivex-knowledge-ingest` / `ailivex-methodology-cocreate`，觸發詞已進全局 CLAUDE.md

### 場二：UDN 議題台三案（v0.4.6→v0.6.1，五 commit 全上線，末 revision 00084）

1. **任務暫停機制**：懶人包/口播稿可暫停解鎖新任務、影片「放棄等待」、影片失敗可重生、圖卡張數改填空（預設5）、全圖生完自動標 done（根因：原本永遠 running 永久 409）。順手修 tsconfig exclude cloud-run（乾淨 worktree 炸出的既有雷）。
2. **檔案來源＋參考圖**（c500e9a）：建議題/概覽補充上傳 docx/PDF/圖片→magic bytes→GCS→抽取（mammoth/unpdf 確定性；圖片 gpt-4o-mini vision＋vision 錶 60/日）→周映辰分析→Brief，角色對話零改動讀得到。議題圖片=參考圖庫，派工/a_done 可勾一張，生圖走 OpenAI edits 帶參考（ailivex 故事卡同機制），版型 sharp 壓版照舊。＋側欄登出鈕。
3. **漏財稽核＋修復**（ada3fa5＋d8a1e9c）：①`createTaskGated`（transaction 原子查+建）關掉四入口防連按競態——chat 驅動懶人包原本零檢查、generate-video 閘門原本在打完 HeyGen 之後；本機 10 併發真驗 1 過 9 擋。②上傳孤兒清理（deleteProject/PATCH 級聯清 GCS＋`/api/uploads/sweep`）。③Tavily 上限 20 組/議題三入口全擋。④**高風險項**：podcast ttsChars 扣錶搬進 worker `runAudioWork()`（HTTP＋Job 直跑唯一收斂點，worker `src/quota.ts` 與平台共用同一張錶），worker 先部署再平台。

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform` 16 檔（33e3c56） | 知識庫/方法論全鏈＋admin 頁＋vercel region hkg1 |
| `zhu-core/skills/` ×2 新檔 | 入庫 SOP／共創 SOP（「Adam 過目才入庫」硬步驟） |
| `memory/skill_cross_register_retrieval_gist_index.md` | 新記憶：語域坍縮＋gist 三雷 |
| udnnews `lib/firestore.ts` | createTaskGated＋TaskConflictError；deleteProject 清 file 來源；全圖 done→task done；刪 hasRunning* 死碼 |
| udnnews `lib/file-extract.ts`（新）＋`quota.ts`＋`collect-core.ts`＋`storage.ts` | 驗檔抽取／vision 錶／processFileSource＋來源上限／gcsPathFromUrl＋list |
| udnnews `app/api/uploads/`（新） | 上傳抽取＋sweep 孤兒清掃（CRON_SECRET） |
| udnnews `app/api/tasks/*`＋`api/chat`＋`api/podcast/generate-audio` | 閘門全改 createTaskGated；video 先佔位再花錢；PATCH 開 running↔paused；analyze-cards 收參考圖＋delete 清欄位；podcast route 移除扣錶 |
| udnnews `cloud-run/podcast-worker/src/quota.ts`（新）＋`index.ts` | 額度錶釘 runAudioWork 收斂點 |
| udnnews `components/`×4＋`tsconfig`＋`proxy.ts` | 上傳 UI／檔案 tab／登出鈕／暫停鈕＋參考圖＋張數填空；exclude cloud-run；sweep 白名單 |

---

## 下一步

**Adam 驗收清單**：
- **ailiveX**：文字聊孫武——白話問書（該引用帶出處）／域外話題（口吻認輸）／倒苦水看遞招→逐步走→擺爛收手
- **UDN**：①素材區點一輪暫停/放棄等待/張數填空 ②建議題丟 docx＋圖→看文章庫→問角色 ③懶人包勾參考圖看成圖跟不跟（唯一沒法本機驗的）④sweep 要排 Cloud Scheduler 才會跑（開口我就把指令備好）

**接棒的築**：UDN 進 `~/Documents/UDN NEWS/platform` 先讀 `AGENTS.md`；ailiveX 排隊的是 v17「帶惦記」電話驗收→升 DEFAULT。

---

## 卡住 / 未解

- UDN：sweep 排程待開；參考圖生圖遵循度待真圖驗；低風險稽核四項未做（同卡雙重生成無鎖/參考圖URL不驗歸屬/上傳大小檢查在解析後/HeyGen分身無錶——Adam 未要求）
- ailiveX：知識檢索長尾（概念問撈同主題非正典塊，第二期 rerank 再解）；方法論一輪最多推一步（已知限制）；v17 帶惦記驗收懸
- ailivex `scripts/_zhu_verify_batch.ts` 非築建的未追蹤檔，沒動

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
| ailiveX 知識庫/方法論 SOP | `~/.ailive/zhu-core/skills/ailivex-knowledge-ingest.md` / `ailivex-methodology-cocreate.md` |
| UDN 部署雷區 | `~/Documents/UDN NEWS/platform/AGENTS.md` |
| 今日教訓 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-09.md`（L1-L7 兩場合檔） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-09 · 築*
