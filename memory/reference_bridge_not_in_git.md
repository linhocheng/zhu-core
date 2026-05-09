---
name: zhu-bridge index.js 不在 git，patch SOP
description: bridge index.js source-of-truth 只在 VM，沒版控，改動要 download → edit → grep verify → upload → systemctl restart，沒有 rollback
type: reference
originSessionId: 91f0333f-eb14-44ac-9c73-2121ed2df590
---
`zhu-dev:~/claude-bridge/index.js` 是 molowe / live-media 等 worker 的執行體。它不在任何 git repo（不是 zhu-bridge git 子目錄，是 systemd 起的獨立檔），唯一 source-of-truth 是 VM 上那份。

**含意**：
- 沒有 `git diff` 可看歷史，改錯沒有 rollback
- 兩台機器（AIR / PRO）都不能本地 grep 找 bridge code，必須 ssh 進去
- `EXECUTION_PLAN` 之類的本地文件提到 "bridge index.js:2222-2234" 行號 → 對應的是 VM 那份某個時點的快照，行號隨時可能漂

**改 bridge 的標準 SOP**（任何超過 1 行的改動）：

```bash
# 1. download 到本機暫存
gcloud compute scp zhu-dev:~/claude-bridge/index.js /tmp/bridge-index.js \
  --zone=asia-east1-b --project=zhu-cloud-2026

# 2. 本機 Edit / 多處改動
# 3. grep 驗證所有相關函數還在（feedback_patch_verify_before_upload）
grep -n "<關鍵函數名>" /tmp/bridge-index.js

# 4. 語法檢查
node --check /tmp/bridge-index.js

# 5. 上傳
gcloud compute scp /tmp/bridge-index.js zhu-dev:~/claude-bridge/index.js \
  --zone=asia-east1-b --project=zhu-cloud-2026

# 6. 重啟（不要 killall+nohup，那是 systemd service）
gcloud compute ssh zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026 \
  --command="sudo systemctl restart claude-bridge && sleep 3 && sudo journalctl -u claude-bridge -n 30"
```

**靜默失敗風險**：inline patch（sed / 直接 ssh echo）會吃掉錯誤、靜默失敗，又因為沒 git 看不到 diff → 拉下來在本機改才安全。

**要不要把 bridge 進 git**：是個 open question。優點：可 rollback、雙機器都看得到 code。缺點：deploy 流程變複雜（要 git pull + restart，現在只要 scp + restart）。Adam 知道這個 gap，沒急著修。

**觸發信號**：當築要動 bridge code、或本地文件提到 bridge:行號、或想 git log 找 bridge 歷史時，要記得這條 — 別假設 bridge 跟其他 repo 一樣有版控保護。
