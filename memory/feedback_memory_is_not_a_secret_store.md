---
name: secret-store
description: 記憶檔看起來像本機筆記，實際上每 6 小時入庫 Firestore、有第二份副本、且那份在 public repo；記密鑰名稱與去處，永不記值
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4001f2fe-3ac7-4715-b1ca-451d95aa1b28
---

**規則**：記憶記「這把 key 叫什麼、去哪拿、沒有會怎樣」，**永遠不記值**。記憶庫不是 secret store——它是一條**會自動扇出的發佈管道**。

**Why**：2026-08-06。`GEMINI_API_KEY` 完整明文寫在 `reference_zhu_migrate_plist_keys.md` 裡 **91 天**。而記憶庫：
- (a) 每 6 小時被 `zhu migrate` 讀去入庫 Firestore
- (b) 有第二份實體副本在 `~/.ailive/zhu-core/memory`
- (c) **那份在 git，而且 repo 是 PUBLIC**

一份明文散佈到三個地方，最後被 Google 的洩漏掃描器抓到並**自動停用**。連帶災情：整個記憶向量索引已經死了一段時間沒人發現（`ok=0 fail=292`）——**安全事故的第一個症狀不是被入侵，是自己的系統靜悄悄壞掉**。

**心態**：寫那條記憶當下的心智模型是「記下來免得忘記」，那是**本機筆記本的心智模型**。實際上這裡的每個檔案都是要出版的。危險的不是我不知道規則，是我沒把這個目錄想成「對外」。

**How to apply**：
- 新增／編輯任何記憶檔時，**看到 40 字元以上的隨機字串就停**——那形狀就是 key，不管它叫什麼
- 要記憑證，只准記三件事：**名稱**（`GEMINI_API_KEY`）、**去哪拿**（`~/.ailive/zhu-core/zhu-self/.env` 第 1 行 / GCP Secret Manager 哪個 secret）、**沒有會怎樣**（migrate 全 fail）
- **寫記憶前問一次血管三問的反向**：這條會流到哪裡？誰會讀到？——[[feedback_interface_blood_vessel_check]] 平常問「血管接通了嗎」，這裡要問「**血管通到不該通的地方了嗎**」
- 掃明文一律用 `/usr/bin/grep`：這台機器的 `grep` 是 ugrep，**預設跳過隱藏檔**，`.env` 類整批掃不到（[[feedback_ambiguous_signal_not_proof]] 的陽性對照）

**觸發信號**：正要把一個值貼進記憶檔／WORKLOG／session 檔「以免忘記」；心裡冒出「這只是本機筆記」；看到自己寫的記憶裡有 `=` 後面接一長串亂碼。

**家族**：[[feedback_gh_push_verify_tracked_tree.md]]（推之前掃 tracked tree）是出口那一端的防線，本條是**源頭**那一端——東西根本不該進來。
