'use client';
import { useEffect, useState } from 'react';

interface ZhuTask {
  id: string;
  title: string;
  type: string;
  status: string;
  executionMode?: string;  // 'auto' | 'notify' | 'impossible'
  triggerHour?: number;
  triggerMinute?: number;
  context?: string;
  priority?: string;
  lastRunAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#22c55e',
  blocked: '#f59e0b',
  done: '#6366f1',
  archived: '#52525b',
  completed: '#52525b',
};

const TYPE_LABELS: Record<string, string> = {
  distill: '🧠 記憶蒸餾',
  heartbeat: '💓 心跳任務',
  dev: '🔧 開發任務',
  research: '🔍 研究',
  other: '📌 其他',
};

const EXECUTION_MODES = [
  {
    value: 'auto',
    label: '⚡ 自動執行',
    desc: '讀/寫記憶、提煉洞察、Telegram 通知',
    color: '#22c55e',
  },
  {
    value: 'notify',
    label: '🔔 通知後等確認',
    desc: '會影響 production 資料、角色靈魂、不可逆操作',
    color: '#f59e0b',
  },
  {
    value: 'impossible',
    label: '🚫 目前無法自動化',
    desc: 'Claude Code / deploy / 需要瀏覽器互動',
    color: '#71717a',
  },
];

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);

export default function TasksPage() {
  const [tasks, setTasks] = useState<ZhuTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('heartbeat');
  const [executionMode, setExecutionMode] = useState('auto');
  const [triggerHour, setTriggerHour] = useState(21);
  const [triggerMinute, setTriggerMinute] = useState(0);
  const [context, setContext] = useState('');
  const [priority, setPriority] = useState('normal');
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch('https://zhu-core.vercel.app/api/zhu-tasks');
    const d = await r.json();
    setTasks(d.tasks || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    setAdding(true);
    await fetch('https://zhu-core.vercel.app/api/zhu-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, type, executionMode, triggerHour, triggerMinute,
        context, priority, status: 'pending',
        executor: 'zhu_auto', trigger: 'scheduled',
      }),
    });
    setTitle(''); setContext(''); setAdding(false);
    load();
  };

  const archiveTask = async (id: string) => {
    if (!confirm('封存這個任務？')) return;
    await fetch('https://zhu-core.vercel.app/api/zhu-tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'archived' }),
    });
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch('https://zhu-core.vercel.app/api/zhu-tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  const activeTasks = tasks.filter(t => !['archived', 'completed'].includes(t.status));
  const archivedTasks = tasks.filter(t => ['archived', 'completed'].includes(t.status));

  const getModeInfo = (mode?: string) => EXECUTION_MODES.find(m => m.value === mode) || EXECUTION_MODES[0];

  const inputCls = "w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-amber-500";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 font-mono">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <a href="/hub" className="text-zinc-500 hover:text-zinc-300 text-sm">← hub</a>
          </div>
          <h1 className="text-xl font-bold text-amber-400">⚙️ 築的自動任務排程</h1>
          <p className="text-zinc-500 text-xs mt-1">AutoRun 每 30 分鐘掃一次，執行時間符合的 pending 任務</p>
        </div>

        {/* 邊界說明 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
          <div className="text-zinc-400 font-bold text-xs mb-3">築的執行邊界</div>
          <div className="space-y-2">
            {EXECUTION_MODES.map(m => (
              <div key={m.value} className="flex items-start gap-3">
                <span className="text-sm shrink-0" style={{ color: m.color }}>{m.label}</span>
                <span className="text-xs text-zinc-600">{m.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 新增任務 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <div className="text-zinc-400 font-bold text-sm mb-4">+ 新增任務</div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <label className="text-xs text-zinc-500 block mb-1">任務名稱 *</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="例如：每日遺言洞察提煉"
                className={inputCls} />
            </div>

            {/* 執行方式（最重要的選擇） */}
            <div className="col-span-2">
              <label className="text-xs text-zinc-500 block mb-2">執行方式 *</label>
              <div className="grid grid-cols-3 gap-2">
                {EXECUTION_MODES.map(m => (
                  <button key={m.value} onClick={() => setExecutionMode(m.value)}
                    className="p-3 rounded-lg border text-left transition-all"
                    style={{
                      borderColor: executionMode === m.value ? m.color : '#3f3f46',
                      background: executionMode === m.value ? m.color + '15' : 'transparent',
                    }}>
                    <div className="text-xs font-bold mb-1" style={{ color: m.color }}>{m.label}</div>
                    <div className="text-xs text-zinc-600 leading-tight">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-1">類型</label>
              <select value={type} onChange={e => setType(e.target.value)} className={inputCls}>
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">優先度</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className={inputCls}>
                <option value="urgent">🔴 urgent</option>
                <option value="high">🟠 high</option>
                <option value="normal">🟡 normal</option>
                <option value="low">🟢 low</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">觸發小時（台北）</label>
              <select value={triggerHour} onChange={e => setTriggerHour(+e.target.value)} className={inputCls}>
                {HOUR_OPTIONS.map(h => (
                  <option key={h} value={h}>{String(h).padStart(2,'0')}:xx</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">觸發分鐘</label>
              <select value={triggerMinute} onChange={e => setTriggerMinute(+e.target.value)} className={inputCls}>
                <option value={0}>:00</option>
                <option value={30}>:30</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-zinc-500 block mb-1">任務說明</label>
              <textarea value={context} onChange={e => setContext(e.target.value)}
                rows={3} placeholder="這個任務要做什麼？築執行時會讀這段說明。"
                className={inputCls + ' resize-none'} />
            </div>
          </div>
          <button onClick={addTask} disabled={adding || !title.trim()}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold py-2 rounded text-sm transition-colors">
            {adding ? '新增中...' : '+ 建立任務'}
          </button>
        </div>

        {/* 任務列表 */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-zinc-400 font-bold text-sm">
            執行中任務 <span className="text-amber-400 ml-1">{activeTasks.length}</span>
          </div>
          <button onClick={load} className="text-xs text-zinc-600 hover:text-zinc-400">↻ 刷新</button>
        </div>

        {loading ? (
          <div className="text-zinc-600 text-sm py-8 text-center">載入中...</div>
        ) : activeTasks.length === 0 ? (
          <div className="text-zinc-700 text-sm py-8 text-center border border-dashed border-zinc-800 rounded-xl">
            沒有任務，從上方新增
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {activeTasks
              .sort((a, b) => (a.triggerHour ?? 99) - (b.triggerHour ?? 99))
              .map(task => {
                const modeInfo = getModeInfo(task.executionMode);
                return (
                  <div key={task.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                    style={{ borderLeft: `3px solid ${modeInfo.color}` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-sm">{task.title}</span>
                          <span className="text-xs" style={{ color: modeInfo.color }}>{modeInfo.label}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2 flex-wrap">
                          {task.triggerHour !== undefined && (
                            <span className="text-amber-400 font-mono">
                              ⏰ {String(task.triggerHour).padStart(2,'0')}:{String(task.triggerMinute ?? 0).padStart(2,'0')}
                            </span>
                          )}
                          <span style={{ color: STATUS_COLORS[task.status] }}>● {task.status}</span>
                          <span className="text-zinc-600">{TYPE_LABELS[task.type] || task.type}</span>
                          {task.priority && <span className="text-zinc-700">p:{task.priority}</span>}
                        </div>
                        {task.context && (
                          <div className="text-xs text-zinc-600 bg-zinc-800/50 rounded px-2 py-1 leading-relaxed">
                            {task.context.slice(0, 120)}{task.context.length > 120 ? '...' : ''}
                          </div>
                        )}
                        {task.lastRunAt && (
                          <div className="text-xs text-zinc-700 mt-1">
                            上次執行：{new Date(task.lastRunAt).toLocaleString('zh-TW')}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <select
                          value={task.status}
                          onChange={e => updateStatus(task.id, e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 rounded px-2 py-1 focus:outline-none">
                          <option value="pending">pending</option>
                          <option value="blocked">blocked</option>
                          <option value="done">done</option>
                        </select>
                        <button onClick={() => archiveTask(task.id)}
                          className="text-xs text-zinc-600 hover:text-red-400 border border-zinc-700 rounded px-2 py-1">
                          封存
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* 封存任務 */}
        <button onClick={() => setShowArchived(v => !v)}
          className="text-xs text-zinc-600 hover:text-zinc-400 mb-3">
          {showArchived ? '▲ 隱藏' : '▼ 顯示'} 封存任務（{archivedTasks.length}）
        </button>

        {showArchived && archivedTasks.length > 0 && (
          <div className="space-y-2 opacity-50">
            {archivedTasks.map(task => (
              <div key={task.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-zinc-500">{task.title}</span>
                  <span className="text-xs text-zinc-700 ml-2">{task.status}</span>
                </div>
                <button onClick={() => updateStatus(task.id, 'pending')}
                  className="text-xs text-zinc-600 hover:text-zinc-400">
                  恢復
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
