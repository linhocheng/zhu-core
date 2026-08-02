# DreamF 完整施工藍圖（接棒工單）v1.0

> 2026-08-02 期 0 全通後立卷。**下一棒開工前必讀三件**：本卷＋`FILM_FACTORY_BUILD_SPEC_v1.md`（架構唯一真相源）＋`~/.ailive/dreamf/poc/`（期 0 驗證線，建材倉庫）。
> 拍板現況：命名 DreamF ✓、地基清單 ✓、期 0 全通 ✓（$3.43、接縫像素級）；**期 1 開工＝等 Adam 看片點頭**（人審閘）。

## 〇、期 0 結案摘要（不重跑）

端到端全通：需求→導演站（bridge＋JSON 骨架咒）→確定性驗證器→Nano Banana 影格（Vertex+ADC，風格錨鎖物件）→大圖分鏡表（sharp）→Veo 3.1 首尾幀 4 段（零 RAI）→ffmpeg 成片 32.03s。
三發現已入 spec：①導演 prompt 必含 JSON 骨架逐字 ②colors＝語意色名自由鍵（追蹤物專屬色）③prompt 全文落檔可稽核（frame-map.json/prompts.jsonl）。
未測遺留：斷點續跑實戰（期 2 主動殺 job 驗）、旁白 TTS 渲染、驗證器休止符正則誤報（否定句/景深詞豁免——期 1 順手修）。

## 一、期 1 施工順序（骨架：大廳＋案子的家＋幕 1-3）

**步驟 1｜Repo 出生**（半天）
- `gh repo create linhocheng/dreamf --private`；Next.js App Router（standalone 輸出，照 UDN 慣例）；`worker/` 同 repo
- 第一 commit 必含：`FOUNDATION.md`（照 BUILD_SPEC §10 抄成帳本）＋`collections.ts`（§4 authoritative）＋`THIRD_PARTY.md`（sharp/ffmpeg 入帳）＋`.github/workflows/ci.yml`（gitleaks/Semgrep/npm audit——第一天）
- 承重牆四條寫進代碼註釋位（§11），各配 pinning test 骨（紅著沒關係，蓋到就轉綠）

**步驟 2｜GCP 出生**（半天）
- project `dreamf-2026`（billing 掛 01FB18）；Firestore（PITR 7d＋每日 export 排程同日）＋GCS bucket＋Secret Manager（BRIDGE_SECRET）
- enable aiplatform 後**等 service agent 佈建幾分鐘**再打（error code 9 雷）；新 project 首次 deploy 雙必踩 IAM（Cloud Build --region、compute SA secretAccessor——記憶 reference_gcp_new_project_iam）
- `deploy.sh` 第一次部署同日進 repo；prod 人閘（Adam GO）

**步驟 3｜建材搬運**（一天）——poc 不是玩具，是 lib 的前身：
| poc 檔 | 搬到 | 改什麼 |
|---|---|---|
| `scripts/validate-storyboard.mjs` | `lib/storyboard.ts`（canonical） | 轉 TS；修休止符正則（否定句/景深豁免）；加 storyboardVersion |
| `scripts/director.mjs` 的 SYSTEM 咒 | `lib/director.ts`＋`director_prompts` collection v1 | 咒文入庫（append-only 版本制，教室出水口） |
| `scripts/gen-keyframes.mjs` | `worker/keyframes.ts` | 幀邏輯照搬（硬切/共用幀/風格錨/prompt 落庫）；Vertex project 換 dreamf-2026 |
| `scripts/gen-segments.mjs` | `worker/scene.ts` | 照搬（含斷點續跑/成本落帳/prompts.jsonl→cost_ledger＋keyframes doc） |
| `scripts/contact-sheet.mjs` | `lib/contact-sheet.ts` | 照搬（SVG 不放底色 rect 的雷已修） |

**步驟 4｜幕 1-3 前台**（三-四天）
- 門禁（user/admin、頁面 API 同鎖、middleware+每 route 自驗——UDN proxy.ts 模式）
- 大廳（今天的桌子）＋`/cases/new`（幕1：需求框＋三下拉＋**簽封頂**）＋案子的家骨架（七幕進度條，只渲染目前幕）
- 幕2 面談 route（bridge、三題上限、三行卷即時成形）；幕3 分鏡室（橫表＋抽屜編輯＋RAI 黃標＋**簽字閘 transaction**：鎖表＋寫 contractUsd＋這是唯一燒錢開閘點——承重牆 #1 的 pinning test 在這裡轉綠）
- UI 皮照 R2 優尼規格（`ROUNDTABLE_film-factory_2026-08-02_R2.md` 優尼段）；設計系統另請 Adam 給稿或沿 claude.ai/design 流程

**步驟 5｜機房/帳房唯讀**（一天）：Jobs 看板＋cost_ledger 流水表（讀同批 doc，不設第二真相）

**期 1 驗收（鑑別信號）**：真帳號走完幕1→3；簽字前 `cost_ledger` 零筆；簽字後 contractUsd 落 doc；schema 退件路真觸發一次（餵一張壞表）；deploy.sh 部署＋traffic revision 對齊。

## 二、期 2 工單（產線：幕 4-7＋Jobs）

worker 上 Cloud Run Jobs（`JOB_ACTION=keyframes/shoot/retake`，六問＋watchdog 同 commit）；幕4 影格牆（雙歸屬標籤/圖已過時/大圖分鏡表）；幕5 攝影棚（三態＋跳錶＋預算閘硬停）；幕6 試片分流門（兩鈕＋連動代價預告＋三次勸回）；幕7 交片＋結案單；教室進水（corrections 掛儲存咽喉）。
**驗收**：一支真片端到端＋**主動殺一次 job 驗斷點續跑**（期 0 未測項）＋跳錶=cost_ledger 對帳。

## 三、期 3 工單（精修）

教室消化/出水（熱區表＋每 10 片盤→prompt vN）；片庫；角色設定卡線（Nano Banana 三視圖＋簽字入卷）；ingredients 生成模式；旁白 TTS 軌（MiniMax，連續音軌蓋 Veo 切點）；優尼生人過堂（零教學走完主動線）。

## 四、施工紀律（每一棒都守）

- 分鏡表 JSON＝唯一真相；確定性歸程式；LLM 輸出必過驗證器（不拿 LLM 修 LLM）
- 簽字閘前分文不燒；預算閘是硬停不是提醒
- 手動改雲端同日改 deploy.sh；帳本（FOUNDATION.md）到期項 lastword 必盤
- Veo 雷區：GA 模型名（-preview 404）、image 欄位 {bytesBase64Encoded,mimeType}、POST fetchPredictOperation、raiMediaFilteredReasons、us-central1
- bridge 契約：只送 model/system/messages、<result> 標籤＋程式抽取；BRIDGE_URL 可能已含 /v1/messages（期 0 踩過）

*v1.0 · 2026-08-02 · 期 0 全通當日立卷。圓桌四席合議＋築工程化。*
