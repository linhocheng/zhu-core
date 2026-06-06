# Skill：MACS 新增 Tavily API Key

**觸發詞**：「新增 Tavily key」「加 Tavily key」「加一把 key」「Tavily 額度又滿了」

---

## 前提
- GCP project：`zhu-cloud-2026`
- Cloud Run service：`macs-research-worker`（asia-east1）
- 現有 key 命名：`TAVILY_API_KEY`（原始）、`TAVILY_API_KEY_1`、`TAVILY_API_KEY_2`（之後按號碼加）
- Cloud Run compute SA：`754631848156-compute@developer.gserviceaccount.com`

---

## STEP 1：驗 key 有效
```bash
CODE=$(curl -s -o /dev/null -w "%{http_code}" https://api.tavily.com/search \
  -H "Authorization: Bearer <NEW_KEY>" -H "Content-Type: application/json" \
  -d '{"query":"test","search_depth":"basic","max_results":1}')
echo "HTTP $CODE"   # 200 = 有效, 401 = key 錯, 432 = 已滿
```

---

## STEP 2：存進 Secret Manager
```bash
N=3   # 下一個號碼（目前用到 2，下次給 3，再下次給 4）
printf '%s' "<NEW_KEY>" | gcloud secrets create TAVILY_API_KEY_${N} \
  --data-file=- --project zhu-cloud-2026 2>/dev/null \
  || printf '%s' "<NEW_KEY>" | gcloud secrets versions add TAVILY_API_KEY_${N} \
     --data-file=- --project zhu-cloud-2026
```

---

## STEP 3：IAM 授權（新 secret 必做）
```bash
gcloud secrets add-iam-policy-binding TAVILY_API_KEY_${N} \
  --member="serviceAccount:754631848156-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project zhu-cloud-2026 --quiet
```

---

## STEP 4：注入 Cloud Run env
```bash
gcloud run services update macs-research-worker \
  --region asia-east1 --project zhu-cloud-2026 \
  --update-secrets="TAVILY_API_KEY_${N}=TAVILY_API_KEY_${N}:latest"
```

---

## STEP 5：改 research worker 程式碼
`cloud-run/research-worker/src/index.ts` 的 `getTavilyKeys()`：

```ts
function getTavilyKeys(): string[] {
  return [
    process.env.TAVILY_API_KEY_1,
    process.env.TAVILY_API_KEY_2,
    process.env.TAVILY_API_KEY_3,   // ← 加這行
    process.env.TAVILY_API_KEY,     // 原始 key 墊底
  ].map((k) => (k ?? "").trim()).filter(Boolean);
}
```
每加一把就照號碼依序加一行。

---

## STEP 6：Deploy
```bash
cd ~/.ailive/macs-platform/cloud-run/research-worker
gcloud run deploy macs-research-worker --source . --region asia-east1 --project zhu-cloud-2026 --quiet
```

---

## 輪用邏輯說明
- 每個 query 靠 hash(query string) % 總 key 數選定主力 key（分散負載）。
- 若主力 key 返回 429/432（額度滿），自動 fallover 到下一把，直到試完所有 key 才拋錯。
- 只要照號碼加 key 變數、程式碼加進陣列，不用改其他地方。

---

## 診斷：哪把 key 滿了
```bash
# 每把都打一發
for k in KEY1 KEY2 KEY3; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" https://api.tavily.com/search \
    -H "Authorization: Bearer $k" -H "Content-Type: application/json" \
    -d '{"query":"test","search_depth":"basic","max_results":1}')
  echo "${k:0:12}… → $CODE"
done
```
200 = 有額度 / 432 = 滿 / 401 = key 壞掉

---

*MACS Tavily key rotation skill · 2026-06-06 · 築*
