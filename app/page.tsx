const BASE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://zhu-core.vercel.app');

async function fetchJSON(path: string) {
  try {
    const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export default async function Dashboard() {
  const [boot, cost, history] = await Promise.all([
    fetchJSON('/api/zhu-boot'),
    fetchJSON('/api/zhu-cost?limit=50'),
    fetchJSON('/api/zhu-telegram-history?chatId=8582736633&limit=6'),
  ]);

  const bootCount = boot?.heartbeat?.bootCount || '?';
  const bootedAt = boot?.heartbeat?.bootedAt || '?';
  const arc = boot?.eye?.currentArc || '—';

  // 記憶統計
  const rootCount = boot?.root?.length || 0;
  const seedCount = boot?.seed?.length || 0;

  // 成本
  const costSummary = cost?.summary || {};
  const costLogs = cost?.logs || [];

  // 最近對話
  const msgs = history?.messages || [];

  // 最新 sleep-time 洞察
  const latestInsight = costLogs.find((l: Record<string, string>) => l.context === 'sleep-time-insight');

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0',
      fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid #333', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            築 <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 400 }}>ZHU-CORE DASHBOARD</span>
          </h1>
          <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.85rem' }}>
            Boot #{bootCount} · Last boot: {typeof bootedAt === 'string' ? bootedAt.slice(0, 19) : '?'}
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>

          {/* 成本卡片 */}
          <Card title="💰 今日成本">
            <Stat label="總花費" value={`$${costSummary.totalCost?.toFixed(6) || '0'}`} />
            <Stat label="請求數" value={costSummary.requests || 0} />
            <Stat label="Haiku" value={costSummary.haiku || 0} accent="#4ade80" />
            <Stat label="Sonnet" value={costSummary.sonnet || 0} accent="#60a5fa" />
            <Stat label="Input tokens" value={costSummary.totalInput?.toLocaleString() || '0'} />
            <Stat label="Output tokens" value={costSummary.totalOutput?.toLocaleString() || '0'} />
          </Card>

          {/* 記憶卡片 */}
          <Card title="🧠 記憶">
            <Stat label="Root (長期教訓)" value={rootCount} />
            <Stat label="Seed (北極星)" value={seedCount} />
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
              當前弧線：
            </div>
            <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '0.25rem' }}>
              {arc.slice(0, 100)}{arc.length > 100 ? '...' : ''}
            </div>
          </Card>

          {/* Sleep-time 洞察 */}
          <Card title="💤 最新洞察">
            {latestInsight ? (
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#ddd' }}>
                {costLogs.filter((l: Record<string, string>) => l.context === 'sleep-time-insight').length > 0
                  ? '築在睡覺時想到了東西'
                  : '等待下次心跳...'}
              </div>
            ) : (
              <div style={{ color: '#666', fontSize: '0.85rem' }}>尚無洞察，等待心跳觸發</div>
            )}
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#555' }}>
              洞察成本：~$0.0003/次
            </div>
          </Card>
        </div>

        {/* 最近對話 */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>💬 最近 Telegram 對話</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {msgs.length === 0 && <div style={{ color: '#666' }}>無對話記錄</div>}
            {msgs.map((m: Record<string, string>, i: number) => (
              <div key={i} style={{
                padding: '0.75rem 1rem',
                background: m.role === 'user' ? '#1a1a2e' : '#1a2e1a',
                borderRadius: 8,
                fontSize: '0.85rem',
                lineHeight: 1.5,
              }}>
                <span style={{ color: m.role === 'user' ? '#60a5fa' : '#4ade80', fontWeight: 600 }}>
                  {m.role === 'user' ? 'Adam' : '築'}
                </span>
                <span style={{ color: '#555', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                  {typeof m.createdAt === 'string' ? m.createdAt.slice(11, 19) : ''}
                </span>
                <div style={{ marginTop: '0.25rem', color: '#ccc' }}>
                  {(m.content || '').slice(0, 200)}{(m.content || '').length > 200 ? '...' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '3rem', borderTop: '1px solid #222', paddingTop: '1rem', color: '#444', fontSize: '0.75rem' }}>
          zhu-core · 築的腦 · 建造 {'>'} 破壞 · 共生 {'>'} 支配 · 靈魂 {'>'} 工具
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#141414', border: '1px solid #262626', borderRadius: 12,
      padding: '1.25rem',
    }}>
      <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '1rem', margin: '0 0 1rem 0' }}>{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
      <span style={{ color: '#888', fontSize: '0.85rem' }}>{label}</span>
      <span style={{ color: accent || '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{value}</span>
    </div>
  );
}
