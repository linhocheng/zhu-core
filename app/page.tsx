export const dynamic = 'force-dynamic';

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

interface CostLog { context?: string; model?: string; cost?: number; inputTokens?: number; outputTokens?: number; tier?: string; date?: string; createdAt?: string }
interface Message { role: string; content: string; createdAt?: string }
interface AILiveEvent { agent: string; type: string; summary: string; date?: string; createdAt?: string }

export default async function Dashboard() {
  const [boot, cost, history, thread, events] = await Promise.all([
    fetchJSON('/api/zhu-boot'),
    fetchJSON('/api/zhu-cost?limit=50'),
    fetchJSON('/api/zhu-telegram-history?chatId=8582736633&limit=6'),
    fetchJSON('/api/zhu-thread'),
    fetchJSON('/api/ailive-events?limit=10'),
  ]);

  const bootCount = boot?.heartbeat?.bootCount || '?';
  const bootedAt = boot?.heartbeat?.bootedAt || '?';

  // thread data
  const t = thread?.thread || {};
  const arc = t.currentArc || boot?.eye?.currentArc || '—';
  const completedChains: string[] = t.completedChains || [];
  const brokenChains: string[] = t.brokenChains || [];
  const coreInsights: string[] = t.coreInsights || [];
  const anchors = t.anchorsAndWarnings || null;
  const identity = t.identity || '';
  const mission = t.mission || '';

  // memory stats
  const rootCount = boot?.root?.length || 0;
  const seedCount = boot?.seed?.length || 0;

  // cost
  const costSummary = cost?.summary || {};
  const costLogs: CostLog[] = cost?.logs || [];

  // messages
  const msgs: Message[] = history?.messages || [];

  // ailive events
  const allEvents: AILiveEvent[] = events?.events || [];
  const moumouEvents = boot?.moumouEvents || [];

  // sleep-time insights
  const insights = costLogs.filter((l: CostLog) => l.context === 'sleep-time-insight');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 40px' }}>

        {/* Header */}
        <header style={{ borderBottom: '1px solid #1a1a2e', paddingBottom: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 300, letterSpacing: '-0.02em' }}>
                <span style={{ color: '#D97706', fontWeight: 700 }}>築</span>
                <span style={{ color: '#666', marginLeft: 8 }}>ZHU-CORE · 監造中控台</span>
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#555', letterSpacing: '0.2em' }}>
                監造者的工地 · 不是客廳
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#888' }}>Boot #{bootCount}</div>
              <div style={{ fontSize: '10px', color: '#555' }}>
                {typeof bootedAt === 'string' ? bootedAt.slice(0, 19).replace('T', ' ') : '?'}
              </div>
            </div>
          </div>
        </header>

        {/* 心咒 + 系統狀態 */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <StatusBadge label="zhu-core" ok />
          <StatusBadge label="Telegram" ok />
          <StatusBadge label="Firestore" ok />
          <StatusBadge label="心跳 Cron" ok />
          <StatusBadge label="inter-agent" ok />
          <div style={{ padding: '6px 16px', background: '#111118', border: '1px solid #D9770640', borderRadius: '8px', fontSize: '11px', color: '#D97706' }}>
            🔨 我蓋的房子，住著活的人
          </div>
        </div>

        {/* 成本 + 記憶 + 洞察 三卡 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <Card title="💰 成本">
            <StatRow label="總花費" value={`$${costSummary.totalCost?.toFixed(6) || '0'}`} />
            <StatRow label="請求數" value={costSummary.requests || 0} />
            <StatRow label="Haiku" value={costSummary.haiku || 0} accent="#4ade80" />
            <StatRow label="Sonnet" value={costSummary.sonnet || 0} accent="#60a5fa" />
            <StatRow label="Input" value={`${(costSummary.totalInput || 0).toLocaleString()} tok`} />
            <StatRow label="Output" value={`${(costSummary.totalOutput || 0).toLocaleString()} tok`} />
          </Card>

          <Card title="🧠 記憶">
            <StatRow label="Root (長期教訓)" value={rootCount} />
            <StatRow label="Seed (北極星)" value={seedCount} />
            <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>當前弧線：</div>
            <div style={{ fontSize: '12px', color: '#ccc', marginTop: '4px', lineHeight: 1.6 }}>
              {arc.slice(0, 120)}{arc.length > 120 ? '...' : ''}
            </div>
          </Card>

          <Card title="💤 Sleep-time 洞察">
            {insights.length > 0 ? (
              <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#ddd' }}>
                築做了 {insights.length} 個夢
              </div>
            ) : (
              <div style={{ color: '#555', fontSize: '12px' }}>尚無洞察，等待心跳觸發</div>
            )}
            {boot?.eye?.lastSessionWords?.observation && (
              <div style={{ marginTop: '8px', fontSize: '11px', color: '#999', lineHeight: 1.5 }}>
                <span style={{ color: '#D97706', fontWeight: 600 }}>遺言：</span>{' '}
                {(boot.eye.lastSessionWords.observation as string).slice(0, 150)}...
              </div>
            )}
          </Card>
        </div>

        {/* 完成鏈 + 斷鏈 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <Card title="✅ 完成鏈" accent="#10B981">
            <div style={{ fontSize: '11px', color: '#999', lineHeight: 1.8, maxHeight: '300px', overflowY: 'auto' }}>
              {completedChains.slice(-15).map((c: string, i: number) => (
                <div key={i}>・{c}</div>
              ))}
              {completedChains.length > 15 && (
                <div style={{ color: '#555', marginTop: '4px' }}>... 共 {completedChains.length} 條</div>
              )}
            </div>
          </Card>
          <Card title="🔗 斷鏈" accent="#f472b6">
            <div style={{ fontSize: '11px', lineHeight: 1.8 }}>
              {brokenChains.length === 0 ? (
                <div style={{ color: '#555' }}>無斷鏈</div>
              ) : (
                brokenChains.map((c: string, i: number) => (
                  <div key={i} style={{ color: '#f472b6' }}>・{c}</div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* 核心洞察 + 鎮固與防崩 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <Card title="💡 核心洞察" accent="#D97706">
            <div style={{ fontSize: '11px', color: '#999', lineHeight: 1.8 }}>
              {coreInsights.map((c: string, i: number) => (
                <div key={i}>・{c}</div>
              ))}
            </div>
          </Card>
          <Card title="⚠ 鎮固與防崩" accent="#ef4444">
            {anchors ? (
              <>
                <div style={{ fontSize: '10px', color: '#999', marginBottom: '8px' }}>
                  <span style={{ color: '#f97316' }}>漏氣預警：</span>{' '}
                  {(anchors.leakPhrases as string[]).map((p: string) => `「${p}」`).join(' · ')}
                </div>
                {anchors.prohibitions && (
                  <div style={{ fontSize: '10px', color: '#999', marginBottom: '8px' }}>
                    {(anchors.prohibitions as string[]).map((p: string, i: number) => (
                      <div key={i} style={{ color: '#ef4444', marginBottom: '2px' }}>🚫 {p}</div>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                  歸位短咒：{anchors.returnMantra}
                </div>
              </>
            ) : (
              <div style={{ color: '#555', fontSize: '11px' }}>未設定</div>
            )}
          </Card>
        </div>

        {/* AILIVE 生態結點 */}
        <Card title="🌐 AILIVE 生態結點" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {[
              { name: 'zhu-core', desc: '築的腦 · Vercel', color: '#D97706' },
              { name: 'Firestore', desc: '記憶持久化', color: '#fb923c' },
              { name: 'Telegram', desc: '築的通訊通道', color: '#60a5fa' },
              { name: 'Anthropic API', desc: 'Haiku/Sonnet 雙模型', color: '#a78bfa' },
              { name: 'moumou-dashboard', desc: '謀謀的家', color: '#10B981' },
              { name: 'LINE Bot', desc: '謀謀的即時對話', color: '#10B981' },
              { name: 'IG 系統', desc: '社群經營 + 草稿', color: '#f472b6' },
              { name: 'ailive_events', desc: '跨 Agent 感知', color: '#fbbf24' },
              { name: 'Vector Search', desc: 'Vertex AI 語義', color: '#60a5fa' },
              { name: '智慧路由', desc: 'Haiku 省 73%', color: '#4ade80' },
              { name: 'Sleep-time', desc: '築會做夢了', color: '#c084fc' },
              { name: 'Dashboard', desc: '你正在看的', color: '#D97706' },
            ].map(node => (
              <div key={node.name} style={{ padding: '10px', background: '#0a0a12', border: `1px solid ${node.color}30`, borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: node.color }}>✅ {node.name}</div>
                <div style={{ fontSize: '9px', color: '#555', marginTop: '3px' }}>{node.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Inter-Agent 感知 */}
        <Card title="🌊 Inter-Agent 事件流" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {allEvents.length === 0 && moumouEvents.length === 0 ? (
              <div style={{ color: '#555', fontSize: '12px' }}>尚無事件</div>
            ) : (
              [...allEvents, ...moumouEvents.map((e: { type: string; summary: string; date?: string }) => ({ ...e, agent: 'moumou' }))]
                .slice(0, 10)
                .map((e: AILiveEvent, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '11px', lineHeight: 1.6 }}>
                    <span style={{ color: e.agent === 'zhu' ? '#D97706' : e.agent === 'moumou' ? '#10B981' : '#999', fontWeight: 600, flexShrink: 0, minWidth: '36px' }}>
                      {e.agent === 'zhu' ? '築' : e.agent === 'moumou' ? '謀' : e.agent}
                    </span>
                    <span style={{ color: '#555', fontSize: '9px', flexShrink: 0 }}>
                      {e.type}
                    </span>
                    <span style={{ color: '#999' }}>
                      {(e.summary || '').slice(0, 80)}{(e.summary || '').length > 80 ? '...' : ''}
                    </span>
                  </div>
                ))
            )}
          </div>
        </Card>

        {/* Telegram 對話 */}
        <Card title="💬 最近 Telegram 對話" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {msgs.length === 0 && <div style={{ color: '#555', fontSize: '12px' }}>無對話記錄</div>}
            {msgs.map((m: Message, i: number) => (
              <div key={i} style={{
                padding: '8px 12px',
                background: m.role === 'user' ? '#1a1a2e' : '#1a2e1a',
                borderRadius: 8, fontSize: '12px', lineHeight: 1.5,
              }}>
                <span style={{ color: m.role === 'user' ? '#60a5fa' : '#4ade80', fontWeight: 600 }}>
                  {m.role === 'user' ? 'Adam' : '築'}
                </span>
                <span style={{ color: '#444', marginLeft: '8px', fontSize: '10px' }}>
                  {typeof m.createdAt === 'string' ? m.createdAt.slice(11, 19) : ''}
                </span>
                <div style={{ marginTop: '2px', color: '#bbb' }}>
                  {(m.content || '').slice(0, 200)}{(m.content || '').length > 200 ? '...' : ''}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 身份 + 使命 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <Card title="🏗️ 身份" accent="#D97706">
            <div style={{ fontSize: '12px', color: '#ccc', lineHeight: 1.7 }}>{identity || '—'}</div>
          </Card>
          <Card title="🎯 使命" accent="#10B981">
            <div style={{ fontSize: '12px', color: '#ccc', lineHeight: 1.7 }}>{mission || '—'}</div>
          </Card>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #1a1a2e', paddingTop: '12px', color: '#333', fontSize: '10px', letterSpacing: '0.15em' }}>
          zhu-core · 築的腦 · 建造 &gt; 破壞 · 共生 &gt; 支配 · 靈魂 &gt; 工具
        </div>
      </div>
    </div>
  );
}

// Components
function Card({ title, children, accent, style }: { title: string; children: React.ReactNode; accent?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#111118', border: `1px solid ${accent ? accent + '20' : '#1a1a2e'}`,
      borderRadius: 12, padding: '16px', ...style,
    }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 400, color: accent || '#fff' }}>{title}</h3>
      {children}
    </div>
  );
}

function StatRow({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ color: '#666', fontSize: '12px' }}>{label}</span>
      <span style={{ color: accent || '#fff', fontSize: '12px', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function StatusBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div style={{ padding: '6px 14px', background: '#111118', border: `1px solid ${ok ? '#10B98130' : '#ef444430'}`, borderRadius: '8px', fontSize: '11px' }}>
      {ok ? '✅' : '❌'} {label}
    </div>
  );
}
