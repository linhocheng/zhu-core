# Firestore 備份與還原 SOP（三平台）

> 2026-07-19 鋪設（平台地基天條第十章「災難與還原」第一次補課）。
> 涵蓋：ailivex-2026（us-central1）、udnnews（asia-east1）、geo-authority-2026（asia-east1）。
> 還原演練：2026-07-19 於 ailivex `drill` 臨時庫真跑過一次（見文末紀錄）。

## 現有防線（兩層）

| 層 | 機制 | 窗口 | 用途 |
|---|---|---|---|
| 1 | **PITR**（DB 層，已開） | 7 天 | 誤刪後快速回讀／匯出「刪除前一刻」的資料 |
| 2 | **每日 export**（Scheduler 03:30 台北） | 30 天（桶生命週期自動清） | PITR 窗口外的還原、整庫災難重建 |

- 備份桶：`gs://{project}-firestore-backups`（與各庫同 region，30 天自動刪舊）
- 排程：各 project 的 Cloud Scheduler `firestore-daily-export`，SA=`firestore-backup@{project}`
  （roles/datastore.importExportAdmin），export 自動建時間戳資料夾
- geo 的排程已收編進 `~/.ailive/geo-authority/deploy.sh`（schedulers 段唯一真相源）；
  ailivex/udnnews 無中央 IaC，排程即真相，本檔為記錄

## 還原劇本

### 情境 A：誤刪 doc／collection，7 天內發現 → 用 PITR

PITR 只能「讀」過去，不能一鍵回滾。路徑＝把刪除前一刻的資料撈出來重寫：

```bash
# 1. 撈時間點資料：export 該時間點的整庫（或用 SDK readTime 讀特定 doc）
gcloud firestore export gs://{project}-firestore-backups/pitr-recovery \
  --snapshot-time='2026-07-19T02:00:00Z' --project={project}
# snapshot-time 必須在 7 天窗口內，且對齊「整分鐘」

# 2. 匯回：先進 drill 庫驗證內容，確認無誤才匯回 (default)（見情境 B 步驟）
```

SDK 級（撈單一 doc/collection，不動全庫）：Firestore read 帶 `readTime`（Admin SDK
`db.recursiveQuery`… 實務上用 export+drill 更穩，別手刻）。

### 情境 B：整庫災難／超過 7 天 → 用每日 export

```bash
# 1. 挑備份（資料夾名＝export 時刻）
gcloud storage ls gs://{project}-firestore-backups/

# 2. 先匯進 drill 庫驗證（不碰生產！）
gcloud firestore databases create --database=drill --location={db-region} --project={project}
gcloud firestore import 'gs://{project}-firestore-backups/{timestamp_folder}/' \
  --database=drill --project={project}
# 3. 用腳本數 doc 數、抽查內容，對得上才進下一步

# 4. 匯回生產。⚠️ import 是 upsert：同 ID 覆蓋、備份後新寫的 doc 不受影響、
#    「備份時不存在但現在存在」的 doc 不會被刪——如果要的是完整回滾，先評估殘留
gcloud firestore import 'gs://{project}-firestore-backups/{timestamp_folder}/' \
  --project={project}
# 可加 --collection-ids=memories,characters 只還原特定 collection

# 5. 清理 drill 庫（按執行儲存計費，用完即刪）
gcloud firestore databases delete --database=drill --project={project}
```

### 情境 C：只還原單一 collection

export 支援 `--collection-ids`，import 也支援——平時每日 export 是整庫，
還原時用 `--collection-ids` 過濾即可，不必整庫匯回。

## 鑑別信號（宣告「還原成功」之前）

- drill 庫 doc 數與預期相符（例：memories 573 條）＋抽查 3 條內容正確
- 匯回生產後，前台真的讀得到（角色記得事、對話有歷史），不是只有 operation SUCCESSFUL

## 已知邊界

- **import 不是回滾**：它是 upsert，不刪「備份後新增」的 doc。要精確回滾得先清目標 collection
  （又是一次資料手術——先 export 現況再動）
- **備份窗口**：最壞情況丟 24h 內的新資料（上次 export 之後寫入的）。PITR 蓋住這段（7 天內）
- **GCS 桶單點**：備份與生產同 project——project 級災難（帳號被鎖）兩者一起沒。
  跨 project 異地備份未做（帳本記低利債，觸發條件：任一平台有真付費客戶）
- Scheduler 失敗**沒有通知**（低利債；geo 有站內通知層可接，另兩台無）

## 演練紀錄

- **2026-07-19**（ailivex）：export `2026-07-19T03:38:35_20876` → 建 `drill` 庫 → import →
  數字比對通過 → 刪 drill。詳見 WORKLOG 2026-07-19。
