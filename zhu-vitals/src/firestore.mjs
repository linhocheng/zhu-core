/**
 * Firestore client + TTL helpers. Lazy init, 跨 worker 共用。
 *
 * 環境變數：FIREBASE_SERVICE_ACCOUNT_JSON（JSON 字串）
 * project_id 必須是 moumou-os（vitals collections 跟 TTL 設在那）— 見 BUILDING_PROTOCOL 未解 #7。
 */
import { readFileSync } from 'node:fs';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const APP_NAME = 'zhu-vitals';
const VITALS_PROJECT = 'moumou-os';

let _db = null;

/**
 * 取得 Firestore client（單例）。沒設 service account 會 throw。
 * 支援兩種 env：
 *   - FIREBASE_SERVICE_ACCOUNT_JSON （inline JSON 字串）
 *   - FIREBASE_SERVICE_ACCOUNT_PATH （JSON 檔絕對路徑）
 */
export function getDb() {
  if (_db) return _db;
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  let raw;
  if (inline) {
    raw = inline;
  } else if (path) {
    try {
      raw = readFileSync(path, 'utf8');
    } catch (e) {
      throw new Error(`[zhu-vitals] FIREBASE_SERVICE_ACCOUNT_PATH 讀失敗 (${path}): ${e.message}`);
    }
  } else {
    throw new Error('[zhu-vitals] FIREBASE_SERVICE_ACCOUNT_JSON 或 _PATH 都未設');
  }
  let sa;
  try {
    sa = JSON.parse(raw);
  } catch (e) {
    throw new Error(`[zhu-vitals] service account JSON parse 失敗: ${e.message}`);
  }
  if (sa.project_id !== VITALS_PROJECT) {
    throw new Error(
      `[zhu-vitals] project_id 必須是 ${VITALS_PROJECT}（vitals collections 在那），目前: ${sa.project_id}`,
    );
  }
  const existing = getApps().find((a) => a.name === APP_NAME);
  const app = existing ?? initializeApp({ credential: cert(sa) }, APP_NAME);
  _db = getFirestore(app);
  return _db;
}

/**
 * 算 expires_at（Date object）。
 * @param {number} days
 */
export function expiresAt(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

/**
 * UUID v4（沒裝 crypto.randomUUID 時的 fallback）。
 */
export function uuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
