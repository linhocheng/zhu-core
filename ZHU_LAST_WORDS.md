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
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`（直連 host `https://bridge-direct.soul-polaroid.work`，VM IP 35.236.185.222）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-10 · ailivex 語音語氣優化）

- ailivex 即時語音 TTS 改成 **MiniMax WebSocket 真串流**（`streaming=True` + `MiniMaxSynthesizeStream`），整段回話一個 WS session → 跨句語調連貫，解掉「每句重音」
- 拆穿「兩種 streaming」混淆：① HTTP SSE（降首音延遲，早做）② LiveKit capability（決定語氣，今天才打開）
- 加 `opencc` 繁→簡硬轉（不靠 LLM prompt，MiniMax 簡體發音才穩、不飄北京腔）
- WS 握手失敗自動退 REST fallback（語音不靜音）
- 全 5 角色 `voiceSettings.emotion` 改 neutral（降戲劇感，Firestore 即時生效）
- 部署 Cloud Run revision `00011-4h5`，前端版本標籤 bump `v2026-06-10c-voice-ws`

---

## 今天改了哪些檔案（2026-06-10）

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/agent/minimax_tts.py` | 早:status==2擋重送；下半場:重寫成 WS 真串流+REST fallback+opencc 硬轉 |
| `ailivex-platform/agent/requirements.txt` | 加 opencc-python-reimplemented |
| `ailivex-platform/src/app/realtime/[characterId]/page.tsx` | 版本標籤 v2026-06-10c-voice-ws |
| Firestore characters（5個） | voiceSettings.emotion = neutral |

---

## 下一步

1. **撥 Lilith 復測**：emotion=neutral 後戲劇感降到位沒？後台 admin/characters 可自助調 emotion/speed/pitch + 試聽
2. **ailivex-platform git init + push GitHub**（最該補的斷點）：今天所有 code 改動只在本機磁碟 + 已部署，沒版控。一旦本機檔案丟失只剩容器內的
3. 若要回滾語音：image tag `voice-ws-stable-20260610`（現役WS）/ `voice-stable-20260610`（REST版）；源碼快照 `~/.ailive/_rollback/`

---

## 卡住 / 未解

- ailivex-platform **無 git repo**（今日 code 改動無版控，斷點）
- emotion=neutral 真機聽感未經 Adam 復測確認

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 踩雷心法附件 | `~/.ailive/zhu-core/docs/LESSONS/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ailivex 平台 | `~/.ailive/ailivex-platform/`（Vercel，agent 在 `agent/`） |
| ailivex 語音 agent | Cloud Run `ailivex-realtime-agent`（asia-east1，revision 00011-4h5） |
| ailivex 語音記憶 | `reference_minimax_realtime_voice_quality.md` + `reference_minimax_streaming_dup_audio.md` |
| MACS 平台 | `~/.ailive/macs-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-10 · 築*
