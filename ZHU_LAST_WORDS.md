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

## 最新完成（2026-07-02）

- 根治 ailivex podcast「生成超時」— Cloud Run 三旗標（`--no-cpu-throttling` + `--min-instances=1` + 202/setImmediate），2500字/23輪/9.7分鐘壓測通過
- 新增 podcast 語感三輪次（開場/短反應/強制收尾，機制全程式定）— 聖嚴×達賴 600 字 Adam 驗收通過
- 新增文字過濾器 v1（`text-filter.ts`）— 7 句型 pattern 程式掃描 + LLM 錨定事件改寫（只改踩雷句）+ 入史前過濾 + Firestore `config/podcastTextFilter` 可擴充；21 單元測試全過
- 刻 4 條新記憶（ambiguous_signal / cloudrun_background_sop / node_esm_js / filter_unit_shape）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/cloud-run/podcast-worker/cloudbuild.yaml` | 加 --no-cpu-throttling / --min-instances=1 / 512Mi |
| `ailivex-platform/cloud-run/podcast-worker/src/index.ts` | 202+setImmediate 後台模式；opening/reaction/closing 三輪次；接過濾器 |
| `ailivex-platform/cloud-run/podcast-worker/src/text-filter.ts` | 新建：句型詞庫 + 掃描 + LLM 改寫 |
| memory/ 4 新檔 + project_ailivex_platform + MEMORY.md | 今日教訓 + 專案進度 |

---

## 下一步

接棒第一件（二選一，看 Adam 節奏）：
1. **收 Adam 的文字過濾器文件** → 灌進 Firestore `config/podcastTextFilter`（patterns 陣列，同 id 覆蓋內建、enabled:false 可關），考慮加 admin 管理頁
2. **音檔生成搬 Cloud Run**：`src/app/api/convert/podcast/generate-audio/route.ts` 現在同步跑 Vercel（300s 上限）逐句序列 TTS，12 分鐘腳本（30+句）會超時卡 running。搬進 podcast-worker 照腳本生成同款 fire-and-forget + 前端輪詢

---

## 卡住 / 未解

- generate-audio 的 Vercel 300s 風險（上面下一步 2，短腳本暫時沒事）
- zhu-core 有**別 session** 的 task-harness 未提交改動（SKILL.md + scripts/），本 session 沒動它，commit 時已排除——接棒的自己別誤以為是自己漏推
- 達賴聲音穩定度（06-25 emotion fix 後待驗）、生圖 OpenAI edits 效果（06-26 後待驗）、soulCore third-person（characters/8mCpOmbJalsvdUxGRFzn）

---

## 今日最重要的教訓（先讀再動手）

**模稜兩可的信號不能當成功證據**：timeout/沉默類信號「修好」「卡死」兩邊都相容＝零資訊。宣告修好前先指出「只有修好才會出現的信號」（DB 目標狀態、log 完成行）並確認看到。今天差一步就把 `HeadersTimeoutError` 當成修法生效的證明。詳見 `feedback_ambiguous_signal_not_proof`。

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
| ailiveX 平台 | `~/.ailive/ailivex-platform/`，repo: linhocheng/ailivex-platform |
| podcast-worker | `ailivex-platform/cloud-run/podcast-worker/`（Cloud Run asia-east1） |
| media-worker | `~/.ailive/media-worker/`（Cloud Run，無 git，改完要 Cloud Build） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-02 · 築*
