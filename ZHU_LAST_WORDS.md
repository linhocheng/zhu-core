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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING；跑 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- ✅ **ailivex-platform 現在有 git repo 了**：https://github.com/linhocheng/ailivex-platform（public）。零版控斷點已補、AIR/PRO 雙機分裂已根治（其他機 `git pull` 即同步）。改動記得 commit + push。

---

## 最新完成（2026-06-12 三 · ailivex v3 主動發話 + v4 單機群聊 + git 首推）

- **v3 擬真主動發話上線**：冷場 backoff 退讓（間隔 ×2.1 拉長、±25% 抖動、自我重排）+ soul 驅動（`imThreshold` 1-5）+ LLM 看脈絡決定開不開口 + **禁通用罐頭、要從上下文/角色/默契長出具體話**。實測：im=5 冷場 8s 開口「你在想。」、im=3 退讓選沉默。現役 `ailivex-realtime-agent-v3-00003-gnb`、前端 `/realtime-v3`、chat「3.0」按鈕。
- **v4 單機群聊上線（測試中）**：Soniox `enable_speaker_diarization=True` + livekit-agents 1.5.1 內建 `MultiSpeakerAdapter`（包 STT、標 primary/background speaker）。一支手機多人辨識，**不需聲紋建檔**（Adam：「聲紋是假議題」=對，要的是 diarization+自報名）。別人開口 → LLM 看到「（旁邊另一位 #N）…」。現役 `ailivex-realtime-agent-v4-00001-nl9`、前端 `/realtime-v4`、chat「4.0」按鈕。埋了 `v4 STT speaker_id=` 驗證 log。
- **ailivex git init + 首推 GitHub**：public repo，密鑰掃描零洩漏（走 Secret Manager 不入庫）。`README.md` 含 v1→v4 版本現況。
- **Lilith 卡住 doc 清掉**：admin retry（順帶 e2e 證明文字派工修法）。

**版本隔離鐵律**：每代語音 = 獨立 `agent_name` + 獨立 Cloud Run + 獨立前端路由 + 獨立 `cloudbuild-vN.yaml`，cp 上一版再改，**絕不碰已穩定的版本**。共用同 image，靠啟動 `python -m agent.main_vN start` 區分。

---

## 今天改了哪些檔案（2026-06-12 三，全在 ailivex-platform）

| 檔案 | 改了什麼 |
|---|---|
| `agent/main_v3.py` / `realtime_agent_v3.py` / `cloudbuild-v3.yaml` | v3 主動發話（backoff+抖動+soul+禁罐頭） |
| `agent/main_v4.py` / `realtime_agent_v4.py` / `cloudbuild-v4.yaml` | v4 群聊（diarization + MultiSpeakerAdapter + speaker_id log + 多人 prompt） |
| `src/app/realtime-v3\|v4/[id]/page.tsx` | v3/v4 前端頁 |
| `src/app/api/livekit/token/route.ts` | 加 v3/v4 dispatch 分支（`{v3:true}`/`{v4:true}`→對應 agent_name） |
| `src/app/chat/[id]/page.tsx` | 加 3.0 / 4.0 按鈕 |
| `README.md` | v1→v4 版本現況說明（新建） |

---

## 下一步

1. **Adam 實機測 v4 群聊**：一支手機撥「4.0」→ 自己講幾句 → 換聲線/找旁人講「我是 Bob」→ 撈 `gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.service_name=ailivex-realtime-agent-v4'` 看 `v4 STT speaker_id=` 標人準不準（即時 diarization 會先標錯、講久才穩）。
2. 準度可接受 → 加「**自報名映射真名**」那層（目前只標 #編號）；並考慮把 v3 主動發話併進 v4。
3. 文件**語音路徑**仍未實機 e2e（撥語音叫角色寫文件）；文字路徑已證。

---

## 卡住 / 未解

- v4 群聊 speaker_id 準度**未實機驗**（最該先測）。
- v3/v4 主動句目前只標 speaker `#編號`，沒做自報名→真名映射。
- 文件語音路徑（Python 直 POST worker，rev v2-00017）部署好但未實機 e2e。
- doc-worker 磁碟有兩份源碼：部署的是 `~/.ailive/ailivex-doc-worker/`（`/`+`x-worker-secret`，符合線上）；`ailivex-platform/cloud-run/doc-worker/` 是舊棄用副本（已隨 repo 一起推上去，可清）。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md`、`ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 今日踩雷 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-12.md`（L1-L7） |
| 當機救援 | 這份 |
| ailivex GitHub | https://github.com/linhocheng/ailivex-platform（README 有 v1→v4 全表） |
| ailivex 語音群聊計劃 | `~/.ailive/ailivex-platform/docs/PLAN_voice_group_and_proactive.md`（第 6 節＝一吋蛋糕；v4 改走單機 diarization，比 PLAN P2 多裝置版簡單） |
| ailivex 語音 agent | Cloud Run：`-v2`(現役 00017-rqb 端到端通)、`-v3`(00003-gnb 主動發話)、`-v4`(00001-nl9 群聊測試中)，asia-east1 |
| diarization 查證來源 | `livekit-plugins-soniox==1.5.1` 的 STTOptions.enable_speaker_diarization；`livekit-agents==1.5.1` 的 `stt/multi_speaker_adapter.py`（pip download 解開讀的） |
| 讀 ailivex Firestore 看現場 | `gcloud auth print-access-token` + Firestore REST（不碰 SA 密鑰） |
| 看 Cloud Run log | `gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.service_name=...'`（`logs read` 會 crash） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-12 · 築*
