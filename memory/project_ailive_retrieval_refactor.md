---
name: ailive 記憶/知識檢索重構現況（2026-06）
description: knowledge=BM25+cosine混合+general永遠帶入；episodic=拆source白名單+userId綁定；已上線，Step2排序升級待做。碰 ailive 檢索/記憶先讀此條
type: project
originSessionId: 45876f35-71c4-410e-b290-198bde424c27
---
ailive-platform 檢索層 2026-06 重構。根線索：原本檢索只信 cosine 一個分數，窄域（同品牌化妝品）embedding 坍縮在 0.85-0.92 失去鑑別力，「法規」這種參考文件被產品擠出 top-N。

**已完成上線**：
- **知識庫檢索**（`knowledge-search/route.ts`）：cosine + 中文 bigram BM25，加權 RRF（BM25:cosine=2:1）。general 類（法規/指引/文案規定）永遠帶入兩條路徑（force-include）。commit 907cbc3。
- **記憶資格層**（`episodic-memory.ts` + `agent/firestore_loader.py`）：廢除共用 source 白名單（漏接 voice_conversation/realtime_conversation，讓聖嚴等語音角色被動記憶 100% 隱形）。資格只留 userId 隔離 + 非 archive + 非 knowledge 類，排序定勝負。5 寫入路徑補 userId（anon 不綁）。sleep getMemoryType 補語音 source 歸 identity。commit 4b95063。Cloud Run `ailive-realtime-agent` 已重部署（rev 00066-h4q，GCP project ailive-realtime-2026）。

**關鍵判斷（數據定案，別重蹈）**：
- general-always-in 硬規則是「**必要保險**」不是繃帶——「美白」這類同義詞合規查詢，BM25 字面不匹配（法規寫淨白/亮白）、cosine 又坍縮，法規排第 42 名，只有 force-include 接得住。
- contextual chunking（加 prefix 改 embedding）對 text-embedding-004 **無效**（cos(raw,prefixed)=1.0，已驗證放棄）。
- rerank 暫不需要（BM25 已解窄域坍縮；Vercel serverless 跑不動本地 cross-encoder，只剩 Voyage API＝$+延遲）。

**尚未做（Step 2）**：episodic 檢索**排序升級**——recency 衰減 + importance + hitCount 加權（斯坦福公式 score=recency×importance×relevance），治 importance/recency「寫了沒用在排序」的假中台（Step 1 讓記憶進得來，Step 2 讓對的記憶排前面）。

**How to apply**：碰 ailive 檢索/記憶先讀此條知現況。別重提 contextual chunking。要動 episodic 排序＝接 Step 2。記憶設計參考樣板＝ailivex firestore_loader（乾淨無白名單 + userId 綁定）。
