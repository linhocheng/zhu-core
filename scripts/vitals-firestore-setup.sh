#!/usr/bin/env bash
# vitals-firestore-setup.sh — T3.0 Firestore 前置
#
# BUILDING_PROTOCOL v0.2 機制 B/C 的儲存基底。
# 在 zhu-cloud-2026 default database 設定兩個 collection 的 TTL：
#   zhu_vitals_runs   → TTL 90 天
#   zhu_vitals_cost   → TTL 365 天
#
# TTL 欄位：expires_at（doc 寫入時必須包含這個 timestamp）
# Collections 不需預建，第一筆 doc 寫進去會自動產生。
# 但 TTL policy 必須先設好，否則之前寫的 doc 不會自動清。
#
# 執行前確認：
#   1. gcloud config get-value project → zhu-cloud-2026
#   2. 已 gcloud auth login（adam@dotmore.com.tw）
#   3. 確認當前 default database 名稱（預設叫 "(default)"）
#
# Dry-run mode：DRY_RUN=1 bash vitals-firestore-setup.sh
# 直接執行：bash vitals-firestore-setup.sh

set -euo pipefail

PROJECT="${PROJECT:-moumou-os}"
DATABASE="${DATABASE:-(default)}"
DRY_RUN="${DRY_RUN:-0}"

# 注意：worker 的 FIREBASE_SERVICE_ACCOUNT_JSON.project_id 是 moumou-os，
# 不是 gcloud config 的 zhu-cloud-2026。2026-05-12 第一次跑 T3.0 踩過。

run() {
  if [ "$DRY_RUN" = "1" ]; then
    echo "[DRY-RUN] $*"
  else
    echo "[RUN] $*"
    "$@"
  fi
}

echo "Project: $PROJECT"
echo "Database: $DATABASE"
echo "DRY_RUN: $DRY_RUN"
echo ""

# 1. 確認 project 與 db
echo "── 確認 project ──"
gcloud config set project "$PROJECT"

echo ""
echo "── 確認 database ──"
gcloud firestore databases list --project="$PROJECT" --format="value(name,locationId,type)"

# 2. 列出現有 TTL 設定（看有無衝突）
echo ""
echo "── 現有 TTL 設定 ──"
gcloud firestore fields ttls list --project="$PROJECT" --database="$DATABASE" 2>&1 || echo "(no TTLs configured yet)"

# 3. 設 TTL：zhu_vitals_runs / expires_at（90 天 = 自然過期）
echo ""
echo "── 設定 zhu_vitals_runs TTL ──"
run gcloud firestore fields ttls update expires_at \
  --collection-group=zhu_vitals_runs \
  --database="$DATABASE" \
  --project="$PROJECT" \
  --enable-ttl

# 4. 設 TTL：zhu_vitals_cost / expires_at（365 天）
echo ""
echo "── 設定 zhu_vitals_cost TTL ──"
run gcloud firestore fields ttls update expires_at \
  --collection-group=zhu_vitals_cost \
  --database="$DATABASE" \
  --project="$PROJECT" \
  --enable-ttl

echo ""
echo "✓ T3.0 Firestore 前置完成。"
echo ""
echo "下一步（T3.1）：worker wrapper 寫 doc 時 expires_at 設法："
echo "  zhu_vitals_runs: expires_at = now + 90d"
echo "  zhu_vitals_cost: expires_at = now + 365d"
echo ""
echo "驗證 TTL 有開："
echo "  gcloud firestore fields ttls list --project=$PROJECT --database=\"$DATABASE\""
