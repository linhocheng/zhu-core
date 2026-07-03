---
name: finger-pingpong
description: 手指打乒乓球 webcam 小遊戲，本機 Python + MediaPipe，粒子藝術版已完成並經 Adam 實玩驗證
metadata: 
  node_type: memory
  type: project
  originSessionId: d60ab7f2-ee99-4254-934e-7607afd5f832
---

# finger-pingpong — 手指打乒乓球（2026-07-02）

**位置**：`~/finger-pingpong/`，啟動：`~/finger-pingpong/run.sh`（venv 內建，離線可玩、零 API 花費）

**是什麼**：webcam 手部追蹤小遊戲。MediaPipe 抓五指指尖，畫面上一顆白色乒乓球，指尖打球、球有重力 + 地板/牆壁反彈，打擊力道跟手速走。v2 加粒子藝術：球發光拖尾、撞擊爆暖金火花、squash & stretch 擠壓動畫、指尖冰藍彗星（速度反應式）、bloom 發光管線。Adam 實玩評價「非常耐玩」「很棒」。

**技術棧**：Python 3.11 venv（**3.13 不行**，MediaPipe 不支援）+ mediapipe 0.10.35 + opencv 5.0。渲染每幀 ~10ms（M1），粒子上限 600。

**踩過的雷**：
- MediaPipe 0.10.35 已移除舊版 `mp.solutions.hands` API → 必須用 Tasks API（`vision.HandLandmarker`，`RunningMode.VIDEO` + `detect_for_video(mp_image, ts_ms)`），需要下載 `hand_landmarker.task` 模型檔（7.5MB，已放專案資料夾）
- 攝影機權限：從築的 shell 背景啟動會被 macOS 直接拒絕（不跳授權視窗）→ 必須 Adam 自己在終端機跑（`! ~/finger-pingpong/run.sh`）

**可調參數**（都在 `pingpong.py` 開頭）：`BOUNCE_DAMPING`（0.88，越高越彈）、`HIT_TRANSFER`（1.25，打擊力道）、`GRAVITY`、`MAX_PARTICLES`。

**下一步（Adam 說過）**：本機版確定後做手機可玩版（瀏覽器 + MediaPipe JS）。
