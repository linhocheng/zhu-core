# zhu-vitals

BUILDING_PROTOCOL v0.2 共用基礎建設。

完整規範：`~/.ailive/zhu-core/docs/BUILDING_PROTOCOL.md`

## 提供的東西

| 名稱 | 屬於機制 | 用途 |
|---|---|---|
| `validateManifest()` | A — 結構聲明 | runtime + CI schema check |
| `scripts/check-manifest.mjs` | A | CI 用 validator |
| `withVitals(manifest, handler)` | B — 執行心跳 | 包 entry handler，每跑完寫一筆 `zhu_vitals_runs` |
| `bridgeCall({ prompt, worker_id, project, purpose, ... })` | C — 成本記錄 | 走 bridge HTTP gateway，自動寫一筆 `zhu_vitals_cost` |

## 安裝

zhu-core 內部 workspace，其他 repo 用 git URL（T3.4 決定最終分發）：

```bash
npm install git+ssh://git@github.com:linhocheng/zhu-core.git#main
# package.json 引用：
#   "zhu-vitals": "file:../zhu-core/zhu-vitals"  # 同機
```

`firebase-admin` 是 peer dep，consumer 自帶。

## 環境變數

| 變數 | 必要 | 說明 |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | 是 | JSON 字串，project_id **必須是 `moumou-os`**（未解 #7） |
| `BRIDGE_URL` | bridgeCall 用 | zhu-bridge VM 入口 |
| `BRIDGE_SECRET` | bridgeCall 用 | bridge auth token |

## 範例

```ts
// manifest.mjs
export const manifest = {
  worker_id: 'molowe-cron',
  display_name: 'molowe cron tick',
  env: 'vercel-cron',
  expected_interval_seconds: 300,
  report_cadence_seconds: 300,
  reads_from: ['firestore:kols'],
  writes_to: ['firestore:posts_raw'],
  llm_route: 'bridge',
};

// route.ts
import { withVitals, bridgeCall } from 'zhu-vitals';
import { manifest } from '../manifest.mjs';

export const GET = withVitals(manifest, async () => {
  const text = await bridgeCall({
    prompt: '...',
    worker_id: manifest.worker_id,
    project: 'molowe-platform',
    purpose: 'draft',
  });
  return { status: 'success', items_processed: 1 };
});
```

## 寫入粒度

- `zhu_vitals_runs`: 每 run 一筆 final record（含 started_at + finished_at + status + duration_ms）。TTL 90 天。
- `zhu_vitals_cost`: 每 LLM call 一筆。TTL 365 天。

TTL 已在 `moumou-os` Firestore 上設好（`expires_at` 欄位）。
