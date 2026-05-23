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

## 最新完成（2026-05-23）

- 四段二分法確認 librosa numba JIT 是 ailive 即時語音 CPU 殺手（S1-S3 乾淨，S4 ca59d4b 爆炸）
- 改寫 `agent/voice_identifier.py`：librosa MFCC 52-d → 純 numpy ZCR+FFT 20-d，無 JIT
- Cloud Run revision 00059-x6n 穩定上線，吉娜 + 福哥實測通過
- 研究 Soniox STT 中英文雙語方案（language_hints=["en","zh"]），等 API key

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `agent/voice_identifier.py` | 完整改寫：librosa MFCC → 純 numpy FFT 20-d，閾值 0.75→0.92 |
| `agent/requirements.txt` | 移除 librosa>=0.10.0 |
| `zhu-core/docs/LESSONS/LESSONS_20260523.md` | 新建：4 條教訓（librosa/bisect/Deepgram/numpy） |

---

## 下一步

**Soniox STT 中英文雙語（等 Adam 申請 API key）**

1. 確認 livekit-plugins-soniox STTOptions 裡 `interim_results` 等效參數名稱（先查源碼再動手）
2. `agent/requirements.txt` 加 `livekit-plugins-soniox==1.5.1`，移除 `livekit-plugins-deepgram==1.5.1`
3. `agent/realtime_agent.py` 換 import：`from livekit.plugins import soniox`
4. STT 初始化改 `soniox.STT(model="stt-rt-v4", language_hints=["en","zh"])`
5. Secret Manager 加 `SONIOX_API_KEY` → Cloud Run env → deploy
6. 回滾快照：commit `5901180`，revision `00059-x6n`（一鍵可回）

---

## 卡住 / 未解

- **Soniox API key**：Adam 尚未申請，等到手才能動手換 STT
- **ANEWS pipeline 卡死**（F9u8lHZCief2bTN6ztAO）：kick endpoint 已建，但今天沒測試
- **QA 嚴格度**：section-qa word_count 80% + no_unsupported_claims 過高

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ailive agent | `~/.ailive/ailive-platform/agent/` |
| 聲紋識別 | `~/.ailive/ailive-platform/agent/voice_identifier.py` |
| Cloud Run stable | revision `00059-x6n`（純 numpy，無 librosa） |
| Soniox 研究結論 | `zhu-core/docs/LESSONS/LESSONS_20260523.md` L3+L4 |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-23 · 築*
