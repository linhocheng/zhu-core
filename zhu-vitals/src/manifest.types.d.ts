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
}
