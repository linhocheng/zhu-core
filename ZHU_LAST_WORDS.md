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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-07-04，同日第四場：ailiveX 營運日）

**Adam 實際使用回報四連修（v15.3.1→v15.5.0 全 commit+push+部署 live）：**
- **存檔卡住診斷**：413（頭像 >3.4MB 撞 Vercel 上限）；三斷面欄位對賬 API 全乾淨；真兇=編輯視窗預載競態會把別名/能力/圖片風格洗成空——**三修方案已報 Adam，等 GO**
- **v15.3.1 語音頓**：TTS 串流實測慢於播放速率+VAD CPU 滿載實證 → v15 `--cpu=2`（cloudbuild 持久化）；**H3 語音多開修法+H4 語音媒體計量隨此上線**（revision 00007-zth）
- **v15.4.0 文件簡→繁**：機制級 opencc s2tw+「发文」覆寫，釘 agent 建檔點+雙 worker 出口（title 寫回）；26 份舊標題轉繁；養生茶內文重生成。**雷：s2twp 詞組會改壞已繁體文本，dry-run 抽查救的**
- **v15.5.0 文字對話額度**：則數總量制（token 分析後棄用：bridge 月費+context 佔 95%）；dialogue 入口扣量+失敗退量；admin 全鏡射；對話頁「剩 N 則」指引+用罄琥珀系統卡+輸入停用。8/8 斷言+e2e 上限2→剩1/剩0/擋 全中
- 外科分離 ×3（loader/collections/dialogue 與 soulCore 批切開）+ **stash --keep-index 首次真驗提交樹 build**

**收尾後追記：doc-worker 雙城殭屍**——生產文件真身在 `~/.ailive/ailivex-doc-worker/`（asia-east1、POST /、非 git），repo `cloud-run/doc-worker`+us-central1 是死副本；真身已補 s2tw 轉換（rev 00005-wcc）、生產鏈 e2e 過、Adam 的品牌文件已確定性轉繁。詳見記憶 ailivex-doc-worker-true-source + LESSONS L-M。

**前三場（安全弱掃批等）已收，帳在 WORKLOG。**

---

## 今天改了哪些檔案（第四場）

| 檔案 | 改了什麼 |
|---|---|
| `ailivex/agent/cloudbuild-v15.yaml` | cpu 1→2 |
| `ailivex/src/lib/zh-convert.ts`（新） | s2tw+发文覆寫 toTraditional |
| `ailivex/src/app/api/doc-process/route.ts` + `cloud-run/doc-worker/src/index.ts` | md+title 出口轉繁、prompt 補繁體指令 |
| `ailivex/agent/firestore_loader.py` | create_document_job title/brief 轉繁 |
| `ailivex/src/lib/{quota,collections}.ts` | +textLimit/textUsed、consumeTextQuota（回傳剩餘）/refundTextQuota |
| `ailivex/src/app/api/dialogue/route.ts` | 入口扣量+用罄誠實回覆+LLM失敗退量+回傳 textRemaining |
| `ailivex/src/app/api/{me,admin/users}/route.ts` + `admin/users/page.tsx` | text 額度全鏡射 |
| `ailivex/src/app/chat/[characterId]/page.tsx` | 剩 N 則指引+用罄系統卡+停用+氣泡收回 |

---

## 下一步

1. **Adam 重撥語音實測頓感**（收 v15.3.1 尾）：我這邊盯 `gcloud logging read ... silero "slower than realtime"` 和 MiniMax TTS KB/s（<48KB/s=會頓）
2. **角色管理三修（方案已定，等 Adam GO）**：`src/app/admin/characters/page.tsx` ①編輯預載加載入中狀態擋存檔 ②onAvatar canvas 壓 512px+413 訊息 ③建立表單補能力/別名（產品決定）
3. audit MEDIUM/LOW（正式對外前）：登入 rate limit、kling-callback secret、安全標頭、SSRF DNS-rebinding
4. Adam 驗收：文字額度 UI（admin 設限→對話頁指引）、A.Two 語音（voiceId 已補）

---

## 卡住 / 未解

- **三 repo 未 commit 維持原樣**：ailivex soulCore 退役 8 檔、UDN platform 66 檔。**線上比 git 新，接棒者勿信 git 是最新**。外科分離 SOP 見 LESSONS L-E+L-K
- 25 份舊文件內文仍簡體（Adam 決定不改）；admin 對 admin 設額度無效（Adam 說忽略）
- ailiveX 別名 bug（先不修）；UDN 手機版驗收未做

---

## 天條快取（近幾天實戰過的）

- 一次性資料手術先 dry-run 印 before/after——s2twp 錯轉就是抽查抓到的
- 檢測器本身也要驗：簡繁同形字讓自寫偵測誤報（零資訊信號第四張臉）
- 計量單位選「用戶看得懂 × 成本結構對齊」，不選最精準（token vs 則數）
- 宣告修好前先指出「只有修好才會出現的信號」；半套計量＝說謊中台；防禦釘收斂點
- throttled Cloud Run 無 fire-and-forget；firebase-admin 走 ADC

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md` / `ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-04.md`（L1-L5+L-A~L-L 四場） |
| ailiveX | `~/.ailive/ailivex-platform/`（repo: linhocheng/ailivex-platform，**soulCore 退役未 commit**）|
| ailiveX 部署 | web `npx vercel --prod --yes`；agent `gcloud builds submit --config=agent/cloudbuild-vN.yaml`；**doc-worker 真身** `cd ~/.ailive/ailivex-doc-worker && bash scripts/deploy.sh`（repo 的 cloud-run/doc-worker 是死副本勿用） |
| UDN 工作台 | `~/Documents/UDN NEWS/platform/`（**66 檔未 commit**）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-04 · 築（第四場：語音頓修+文件簡繁+文字對話額度）*
