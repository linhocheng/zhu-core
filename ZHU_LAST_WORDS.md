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

## 最新完成（2026-07-09）

**一句話**：ailiveX 五層架構補齊——知識庫（著作層）＋方法論（教練框架）上線（v17.2.0，33e3c56），孫武成為全平台第一個滿配角色（soul＋27 塊知識＋「廟算問診法」6 步），流程固化成兩個 zhu-core skill。

- 建 `knowledge_docs`/`knowledge_chunks`/`methodologies` 三 collection＋`src/lib/knowledge.ts`（確定性切塊→Haiku 白話大意 gist→multilingual-002 嵌入→τ=0.68 檢索）＋`src/lib/methodology.ts`（遞招 τ=0.70／`[[METHOD_*]]` 信號／conversation.activeMethodology 程式狀態機）
- 相容開關＝`character.knowledgeChunkCount/methodologyCount`（缺省角色零變化零延遲）；後台新頁「知識與方法」；語音供給端 memory-blocks 回應加 knowledgeBlock（v17 未接線）
- 孫武知識庫三度重建調優：gist 索引解語域坍縮（目標塊 #15→#1）、τ/lex 門檻全用 calibration 量的不用猜的；七題驗收 6/7（剩概念問長尾，可接受）
- 「廟算問診法」是問孫武本人設計的——6 步含完成判準＋收手五條織進步驟；遞招三題全過
- vercel region 遷 hkg1（原美東↔Firestore asia-east1 每輪 300-800ms 地理稅；x-vercel-id 實錘 hkg1）
- 兩個 skill 建檔（29817b2）：`ailivex-knowledge-ingest` / `ailivex-methodology-cocreate`——含可跑腳本原碼＋雷區清單，小白築判準；觸發詞已註冊全局 CLAUDE.md
- 給外部工程師的 TTS 斷句說明（`agent/minimax_tts.py` `_should_flush`：句尾標點＋40字閥＋首段16字特例＋換行折疊＋整段同一 WS session）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform` 16 檔（33e3c56 v17.2.0） | 知識庫/方法論全鏈：lib×2 新建、collections/tool-tags/conversation/dialogue/memory-blocks 接線、admin 頁＋API×4、vercel.json region |
| `ailivex-platform/src/lib/embeddings.ts` | 加 `generateKnowledgeEmbedding`（multilingual-002＋task_type；memories 004 池不動） |
| `zhu-core/skills/ailivex-knowledge-ingest.md` | 新 skill：入庫 SOP 含腳本原碼 |
| `zhu-core/skills/ailivex-methodology-cocreate.md` | 新 skill：共創 SOP，「Adam 過目才入庫」硬步驟 |
| `~/.claude/CLAUDE.md` | 技能觸發區加兩組觸發詞 |
| `memory/skill_cross_register_retrieval_gist_index.md` | 新記憶：語域坍縮＋gist 三雷 |
| Firestore | 孫武 27 塊知識重建×3、廟算問診法 Nq7Y6CwNVSkArU5VlPZs、methodologyCount=1 |

---

## 下一步

**Adam 實測孫武滿配**：文字聊天 ①白話問書裡主張（該引用帶出處）②問域外話題（該用他的口吻認輸）③自然倒苦水不點名方法論（看廟算問診遞招→出招→逐步走→擺爛時收手）。斷點就報，管線都在 `src/lib/knowledge.ts`/`methodology.ts`。

之後的排隊：v17「帶惦記」電話驗收仍懸（過了→v17 升 DEFAULT＋CANARY 拔除＋v16 降 0）→ 語音道接 knowledgeBlock。

---

## 卡住 / 未解

- 知識檢索長尾：概念問撈到同主題非正典塊（將之五德 #15）——grounded 可接受，更準要第二期 rerank/query 擴寫，別在門檻上硬擠
- 方法論一輪最多推一步（已知限制非 bug，兩份 skill 都有標）
- ailivex `scripts/_zhu_verify_batch.ts` 有一個非築建的未追蹤檔，沒動

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

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-09 · 築*
