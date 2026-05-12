export type DeployEnv =
  | 'vm-systemd'
  | 'vercel-cron'
  | 'vercel-lambda'
  | 'cloud-run-long'
  | 'cloud-run-job';

export type LlmRoute =
  | 'bridge'
  | 'anthropic-sdk'
  | 'gemini'
  | 'minimax'
  | null;

export interface Manifest {
  worker_id: string;
  display_name: string;
  env: DeployEnv;
  expected_interval_seconds: number | 'on-demand';
  report_cadence_seconds: number;
  reads_from: string[];
  writes_to: string[];
  llm_route: LlmRoute;
  owner_notes?: string;
  /** 此 worker 屬於哪個 repo / app（可選；缺則 cost record 寫 'unknown'） */
  project?: string;
}

export interface RunContext {
  worker_id: string;
  project: string | null;
  run_id: string;
}

export interface BridgeMessage {
  role: 'user' | 'assistant';
  content: string | Array<{ type: 'text'; text: string }>;
}

export interface BridgeCallOpts {
  /** 單 user message 簡易模式（與 messages 擇一） */
  prompt?: string;
  /** 完整 messages array（與 prompt 擇一） */
  messages?: BridgeMessage[];
  system?: string;
  model?: string;
  maxTokens?: number;
  worker_id?: string;
  project?: string;
  purpose?: string;
  /** 覆寫 BRIDGE_URL / BRIDGE_SECRET（用於 VPC internal bridge） */
  endpoint?: { url: string; secret: string };
  /** undici Agent — 長文 LLM call 用（headersTimeout=0 / bodyTimeout=0） */
  dispatcher?: unknown;
}

export interface BridgeCallResult {
  text: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
  };
  stop_reason: string | null;
  model: string;
  elapsed_ms: number;
}

export type ValidateResult =
  | { ok: true }
  | { ok: false; errors: string[] };

export declare function validateManifest(m: unknown): ValidateResult;
export declare const VITALS_COLLECTIONS: Readonly<{
  runs: 'zhu_vitals_runs';
  cost: 'zhu_vitals_cost';
  manifests: 'zhu_vitals_manifests';
}>;
export declare const TTL_DAYS: Readonly<{ runs: 90; cost: 365 }>;

export declare function getDb(): import('firebase-admin/firestore').Firestore;
export declare function expiresAt(days: number): Date;
export declare function uuid(): string;

export declare function getRunContext(): RunContext | null;
export declare function withVitals<TArgs extends unknown[], TRet>(
  manifest: Manifest,
  handler: (...args: TArgs) => Promise<TRet>,
): (...args: TArgs) => Promise<TRet>;

export declare function bridgeCall(opts: BridgeCallOpts): Promise<BridgeCallResult>;
