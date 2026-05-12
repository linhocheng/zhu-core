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

export interface BridgeCallOpts {
  prompt: string;
  worker_id?: string;
  project?: string;
  purpose?: string;
  model?: string;
  maxTokens?: number;
  system?: string;
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

export declare function bridgeCall(opts: BridgeCallOpts): Promise<string>;
