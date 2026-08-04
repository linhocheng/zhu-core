# DreamF 管線 V2 重構藍圖——母資產前移（identity before frames）

> 2026-08-03。依據：`RESEARCH_video_pipeline_survey_2026-08-03.md`（三路調查，Adam 看完拍板「就是這樣」）。
> 狀態：**待 Adam 拍板**。拍板後本檔＝V2 施工真相源，BUILD_SPEC 對應章節隨改。

## 0. WHY（一段話）

世界收斂的鐵律是 **identity before frames, frames before motion**：先在便宜的影像層把角色/場景/風格鎖死並經人核准，分鏡從資產渲染，影格帶資產參考合成，影片錢只買已核准的東西。DreamF V1 的順序反了——影格從純文字生（8 張影格 8 個人）、簽字時客戶沒看過任何圖、母片是開拍後的收據。V2 把母片變回源頭。

## 1. 新舊管線對照

```
V1: 接案 → 面談 → 分鏡 → 簽字($) → 美術(影格) → 拍攝 → 試片 → 交片
                    ▲簽的是文字     ▲身份無鎖      ▲母片在這才出現(收據)

V2: 接案 → 面談 → 美術間(母資產) → 分鏡室 → 影格間(母片總檢) → 簽字($) → 拍攝 → 試片 → 交片
                  ▲角色卡/場景卡/風格幀   ▲引用資產   ▲影格帶參考合成      ▲簽的是「看得見的母片＋合約價」
                  ▲客戶逐張核准                       ▲一張母片人眼總檢
```

錢閘理念不變（簽字閘仍是 Veo 唯一錢閘），**簽的東西從文字變成圖**。影像費（$0.039/張）移到簽字前＝世界的抽卡經濟學：迭代留在便宜層。

## 2. 狀態機 V2

```ts
drafting:      ['interviewing', 'cancelled']
interviewing:  ['asseting', 'cancelled']
asseting:      ['storyboarding', 'cancelled']              // 全部資產核准才過
storyboarding: ['framing', 'asseting', 'cancelled']        // 可退回美術間改資產
framing:       ['signed', 'storyboarding', 'asseting', 'cancelled'] // 母片不行→退分鏡/美術
signed:        ['shooting']                                 // arting 退役：影格已在簽字前生完
shooting:      ['screening', 'framing']                     // RAI 三押回 → 回影格間（改描述→影格 stale→重生）
screening:     ['delivered', 'framing', 'shooting']
delivered:     ['archived']
```

- `arting` 從新案路徑退役（type 保留供舊案讀取相容）。
- 改描述咽喉 `editStoryboardField` 不動：仍是唯一寫回點＋stale 標記（承重牆 #4 原樣）。
- 簽字後任何改表 → storyboardVersion+1 → 退回 framing 重簽（V1 既有機制沿用）。

## 3. 母資產設計（新 subcollection `assets`）

```ts
interface AssetDoc {
  kind: 'character' | 'location' | 'style'
  name: string          // 分鏡引用鍵，如「小雨」「浴室」
  desc: string          // 中文母版描述（給客戶看）
  promptEn: string      // 英文生圖 prompt（餵引擎）
  sheetUrl?: string     // 母片圖（GCS）
  descHash: string      // 指紋（描述改→sheet stale，同承重牆 #4 邏輯）
  status: 'pending' | 'ready' | 'approved'
  updatedAt: string
}
```

三種母片的確定性 prompt 模板（程式拼裝，LLM 只填 promptEn）：
- **角色卡**：白底 sheet——左全身正/側/背，右上頭部多角度，右下細節特寫（衣料/鞋/眼）；`same character in all views, orthographic, consistent lighting`。含鞋（避免半身）。
- **場景卡**：**無人**多機位——establishing wide／正打／反打／細節 insert，同一場景同光線。
- **風格幀**：客戶挑中的風格卡即升格為風格幀（已有圖直接用；沒圖補生）。

來源：面談收卷時導演一併抽取 `assets`（角色/場景清單，各含 desc＋promptEn）——INTERVIEW 協議 v2，schema 範例逐字給全（feedback_blueprint_schema_example）。

生成：批次走 worker job（`JOB_ACTION=assets`，六問全綁）；單張重生走 web route（同影格 regen 模式）。客戶在美術間逐張「核准／重生／改描述」，全核准才開分鏡。

## 4. 各幕改動

| 幕 | 改動 |
|---|---|
| 面談 | 收卷多抽 assets 清單；風格卡照舊（挑中者升格風格幀） |
| **美術間（新）** | 資產卡片牆：sheet 圖＋中文描述＋核准/重生/改寫；全綠→「資產齊了，進分鏡」 |
| 分鏡室 | 分鏡表 schema 每段加 `assets: string[]`（引用資產名）；驗證器新規：引用的資產必須存在（確定性檢查）；導演咒 v2 入庫（director_prompts append v2——**DB 已種 v1，必須 append 不是改 code 就完事**）；prompt 紀律：畫面描述不重述角色外觀（外觀住在資產卡） |
| **影格間（原美術，重構）** | 影格生成帶參考圖：`generateImage(prompt, refs[])`——風格幀＋該段引用的角色卡/場景卡（≤4 張）；**frame-0 風格錨退役**（風格幀全程當錨→影格可全平行生，更快）；影格全到齊→**自動拼母片（大圖分鏡表前移到這）**→ 母片大圖＋逐格卡＋合約價＋簽字鈕同屏 |
| 簽字 | 移到影格間底部：看著母片簽（assertSignable 加驗：影格全 ready 無 stale） |
| 拍攝 | 首尾幀模式照舊（K+1 共用幀骨架不動——它是「多關鍵幀插值」正統，被調查驗證方向正確）；contact sheet 從 shoot job 移除（已在 framing 拼好，開拍前若有 stale 重拼） |
| 試片 | 不變；重拍/押回退回點從 storyboarding 改 framing |

## 5. 承重牆 V2（四條不動＋一條新）

1. 簽字閘前分文不燒 **Veo**——不動（assertVeoAllowed）
2. 8 秒格律程式驗證——不動
3. LLM 輸出 schema 程式驗證——不動（assets 清單、分鏡 assets 欄一併納入）
4. 描述指紋 stale 機制——擴展到資產卡（descHash）
5. **新：簽字前影像費上限**——`PRE_SIGN_IMAGE_CAP_USD`（默認 $3，約 75 張），防重生抽卡無上限；超限要 Adam 級後台放行

## 6. 施工分解（順序即依賴）

| 工項 | 內容 | 驗收鑑別信號 |
|---|---|---|
| A1 憲法層 | collections v2（AssetDoc/status/segments.assets）＋guards TRANSITIONS v2＋驗證器資產引用規則＋pinning tests 改版 | `npm test` 全綠；舊狀態機案例測試改寫後仍鎖住四承重牆 |
| A2 面談抽資產＋美術間 | INTERVIEW_SYSTEM v2＋assets job（worker）＋資產間 UI/API（list/approve/regen/edit） | 新案面談收卷後 assets docs 落庫、sheet 圖在 GCS、核准前進不了分鏡（409） |
| A3 分鏡引用＋影格帶參考 | DIRECTOR v2 append 入 director_prompts＋generateImage 多參考＋影格平行生＋母片拼裝移 framing | 影格 ledger 記錄與資產引用對得上；同角色兩影格人臉肉眼一致；母片在簽字前出現在 UI |
| A4 簽字後移＋UI 重排 | framing 幕＋sign route 遷移＋acts 脊椎改 9 格＋shoot job 清理 | 簽字前 veo ledger 零筆（不變量）；簽字頁同屏可見母片＋合約價 |
| A5 遷移＋e2e | 舊測試案 archive；陶壺案（無角色迴歸）＋精華液案（含角色全程）雙 e2e | 兩案交片；精華液案 8 影格同一張臉（母片人眼驗）；帳房 spentUsd=Σledger |

估工：核心（A1–A4）一個整段 session；A5 含兩支 e2e 片實測（Veo 費用 ~$3–4，既有授權範圍內）。

## 7. FOUNDATION 重算（大改版天條）

- **D10（角色設定卡線）→ 到期，本期灌**（本藍圖即其完整版）
- D12（RAI LLM 改寫提案）不變
- 新排後：
  - **D14 九宮格母圖實驗線**——一次生成全分鏡強制一致＋sharp 確定性裁格。觸發：V2 上線後影格一致性仍需 >3 次重生/案，或想壓抽卡成本
  - **D15 Veo ingredients 備用線**——參考圖直進 Veo（≤3 張，與首尾幀不可同用）。觸發：真客戶片出現跨段身份漂移且影格層救不動
  - **D16 後期統一調色**——concat 前 ffmpeg 統一色調。觸發：真客戶片被看出段間色偏

## 8. 顯式不做（本期）

- 九宮格線（D14 排後——先驗證資產參考線夠不夠力，不同時開兩條新線）
- 多角色同框 compose-then-animate 特化（等第一個雙角色真案）
- LoRA/自訓模型、3D 空間層（Marble 類）——規模不到
- Veo extend/timestamp prompting——8 秒格律骨架不動
