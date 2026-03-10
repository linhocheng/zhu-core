'use client';
import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────
interface Memory { id: string; module: string; observation: string; context?: string; tags?: string[]; hitCount?: number; date?: string; }
interface Xinfa { id: string; title: string; principle: string; application?: string; source?: string; tags?: string[]; }
interface Order { id: string; type: string; content: string; status: string; date?: string; }
interface Thread { mission?: string; currentArc?: string; brokenChains?: string[]; completedChains?: string[]; coreInsights?: string[]; }
interface DigestItem { type: 'memory' | 'xinfa'; module?: string; observation?: string; context?: string; title?: string; principle?: string; application?: string; source?: string; tags?: string[]; }

const API = '';
const MODULES = ['bone', 'root', 'eye', 'seed', 'soil'] as const;
const MODULE_COLORS: Record<string, string> = {
  bone: 'bg-amber-900/40 text-amber-300 border-amber-700',
  root: 'bg-green-900/40 text-green-300 border-green-700',
  eye: 'bg-blue-900/40 text-blue-300 border-blue-700',
  seed: 'bg-purple-900/40 text-purple-300 border-purple-700',
  soil: 'bg-stone-800/40 text-stone-300 border-stone-600',
};
const MODULE_DESC: Record<string, string> = {
  bone: '身份（我是誰）', root: '教訓（我學到什麼）', eye: '追蹤（我在做什麼）',
  seed: '北極星（我要去哪）', soil: '今日觀察（短期）',
};

// ─── Tab ─────────────────────────────────────────────────
type Tab = 'vision' | 'memory' | 'xinfa' | 'digest';

export default function ZhuHub() {
  const [tab, setTab] = useState<Tab>('vision');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-amber-400">築 ZHU-HUB</span>
          <span className="ml-3 text-zinc-500 text-sm">生態系統中台</span>
        </div>
        <div className="flex gap-2">
          {(['vision','memory','xinfa','digest'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded text-sm transition-colors ${tab===t ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
              { t==='vision'?'🏔 遠景任務' : t==='memory'?'🧠 記憶牆' : t==='xinfa'?'⚡ 心法庫' : '✨ 精練' }
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {tab === 'vision' && <VisionTab showToast={showToast} />}
        {tab === 'memory' && <MemoryTab showToast={showToast} />}
        {tab === 'xinfa'  && <XinfaTab  showToast={showToast} />}
        {tab === 'digest' && <DigestTab showToast={showToast} />}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-amber-500 text-black px-4 py-2 rounded shadow-lg font-bold animate-pulse">
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Vision + Task Tab ────────────────────────────────────
function VisionTab({ showToast }: { showToast: (m: string) => void }) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const [newTask, setNewTask] = useState('');
  const [newInsight, setNewInsight] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [t, o] = await Promise.all([
      fetch(`${API}/api/zhu-thread`).then(r=>r.json()),
      fetch(`${API}/api/zhu-orders?limit=50`).then(r=>r.json()),
    ]);
    setThread(t.thread);
    setOrders(o.orders || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveField = async (field: string, val: unknown) => {
    await fetch(`${API}/api/zhu-thread`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ [field]: val }) });
    setEditing(null);
    load();
    showToast('已更新');
  };

  const addInsight = async () => {
    if (!newInsight.trim()) return;
    const cur = thread?.coreInsights || [];
    await saveField('coreInsights', [...cur, newInsight.trim()]);
    setNewInsight('');
  };

  const removeInsight = async (i: number) => {
    const cur = [...(thread?.coreInsights || [])];
    cur.splice(i, 1);
    await saveField('coreInsights', cur);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    await fetch(`${API}/api/zhu-orders`, { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ type: 'order', from: 'adam', content: newTask.trim(), status: 'pending' }) });
    setNewTask('');
    load();
    showToast('任務已建立');
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/zhu-orders`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id, status }) });
    load();
    showToast(`已標記 ${status}`);
  };

  const addBroken = async (text: string) => {
    const cur = thread?.brokenChains || [];
    await saveField('brokenChains', [...cur, text]);
  };

  const removeBroken = async (i: number) => {
    const cur = [...(thread?.brokenChains || [])];
    cur.splice(i, 1);
    await saveField('brokenChains', cur);
  };

  if (loading) return <div className="text-zinc-500">載入中...</div>;

  const pending = orders.filter(o => o.status === 'pending');
  const inProgress = orders.filter(o => o.status === 'in_progress');
  const broken = orders.filter(o => o.status === 'broken');
  const done = orders.filter(o => o.status === 'done').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 遠景 */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-4">
        <div className="text-amber-400 font-bold text-sm tracking-widest">🏔 大遠景</div>

        <EditableField label="使命" value={thread?.mission || ''} field="mission"
          editing={editing} setEditing={setEditing} editVal={editVal} setEditVal={setEditVal} saveField={saveField} />

        <EditableField label="當前弧線" value={thread?.currentArc || ''} field="currentArc"
          editing={editing} setEditing={setEditing} editVal={editVal} setEditVal={setEditVal} saveField={saveField} />

        {/* 核心洞察 */}
        <div>
          <div className="text-zinc-500 text-xs mb-2">核心洞察</div>
          <div className="space-y-1">
            {(thread?.coreInsights || []).map((ins, i) => (
              <div key={i} className="flex items-start gap-2 group">
                <span className="text-amber-500 mt-0.5">·</span>
                <span className="text-zinc-300 text-sm flex-1">{ins}</span>
                <button onClick={() => removeInsight(i)} className="opacity-0 group-hover:opacity-100 text-red-500 text-xs">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input value={newInsight} onChange={e=>setNewInsight(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&addInsight()}
              placeholder="新增洞察..." className="flex-1 bg-zinc-800 text-zinc-200 text-sm px-3 py-1.5 rounded border border-zinc-700 focus:outline-none focus:border-amber-500" />
            <button onClick={addInsight} className="bg-amber-600 hover:bg-amber-500 text-black text-sm px-3 py-1.5 rounded font-bold">+</button>
          </div>
        </div>
      </div>

      {/* 斷鏈（thread 的） */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
        <div className="text-red-400 font-bold text-sm mb-3">🔴 斷鏈 brokenChains</div>
        <div className="space-y-1 mb-3">
          {(thread?.brokenChains || []).map((b, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <span className="text-red-500">·</span>
              <span className="text-zinc-300 text-sm flex-1">{b}</span>
              <button onClick={() => removeBroken(i)} className="opacity-0 group-hover:opacity-100 text-red-500 text-xs">✕</button>
            </div>
          ))}
          {(thread?.brokenChains||[]).length===0 && <div className="text-zinc-600 text-sm">無斷鏈</div>}
        </div>
        <AddBrokenInput onAdd={addBroken} />
      </div>

      {/* 任務看板 */}
      <div>
        <div className="text-zinc-400 font-bold text-sm mb-3">📋 任務看板</div>
        <div className="flex gap-2 mb-4">
          <input value={newTask} onChange={e=>setNewTask(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&addTask()}
            placeholder="新增任務..." className="flex-1 bg-zinc-800 text-zinc-200 text-sm px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:border-amber-500" />
          <button onClick={addTask} className="bg-amber-600 hover:bg-amber-500 text-black px-4 py-2 rounded font-bold text-sm">+ 新任務</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <OrderCol title="⏳ 待辦" orders={pending} color="border-yellow-700" onStatus={updateOrderStatus} statuses={['in_progress','done','broken']} />
          <OrderCol title="🔨 進行中" orders={inProgress} color="border-blue-700" onStatus={updateOrderStatus} statuses={['done','pending','broken']} />
          <OrderCol title="💥 斷鏈" orders={broken} color="border-red-700" onStatus={updateOrderStatus} statuses={['pending','done']} />
        </div>
        {done.length > 0 && (
          <details className="mt-4">
            <summary className="text-zinc-500 text-sm cursor-pointer">✅ 最近完成（{done.length}）</summary>
            <div className="mt-2 space-y-1">
              {done.map(o => <div key={o.id} className="text-zinc-500 text-xs pl-4">· {o.content.slice(0,80)}</div>)}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

function AddBrokenInput({ onAdd }: { onAdd: (t: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <div className="flex gap-2">
      <input value={val} onChange={e=>setVal(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter'&&val.trim()){ onAdd(val.trim()); setVal(''); }}}
        placeholder="記錄斷鏈..." className="flex-1 bg-zinc-800 text-zinc-200 text-sm px-3 py-1.5 rounded border border-zinc-700 focus:outline-none focus:border-red-500" />
      <button onClick={()=>{ if(val.trim()){ onAdd(val.trim()); setVal(''); }}} className="bg-red-800 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded">+</button>
    </div>
  );
}

function EditableField({ label, value, field, editing, setEditing, editVal, setEditVal, saveField }:
  { label: string; value: string; field: string; editing: string|null; setEditing: (f:string|null)=>void; editVal: string; setEditVal: (v:string)=>void; saveField: (f:string,v:unknown)=>void }) {
  const isEditing = editing === field;
  return (
    <div>
      <div className="text-zinc-500 text-xs mb-1">{label}</div>
      {isEditing ? (
        <div className="flex gap-2">
          <textarea value={editVal} onChange={e=>setEditVal(e.target.value)}
            className="flex-1 bg-zinc-800 text-zinc-200 text-sm px-3 py-2 rounded border border-amber-500 focus:outline-none resize-none" rows={3} />
          <div className="flex flex-col gap-1">
            <button onClick={()=>saveField(field, editVal)} className="bg-amber-600 text-black text-xs px-2 py-1 rounded">存</button>
            <button onClick={()=>setEditing(null)} className="bg-zinc-700 text-zinc-300 text-xs px-2 py-1 rounded">取消</button>
          </div>
        </div>
      ) : (
        <div className="text-zinc-300 text-sm cursor-pointer hover:text-amber-300 group flex items-start gap-2"
          onClick={()=>{ setEditing(field); setEditVal(value); }}>
          <span className="flex-1">{value || '（點擊編輯）'}</span>
          <span className="opacity-0 group-hover:opacity-100 text-zinc-500 text-xs">✏️</span>
        </div>
      )}
    </div>
  );
}

function OrderCol({ title, orders, color, onStatus, statuses }:
  { title: string; orders: Order[]; color: string; onStatus: (id:string,s:string)=>void; statuses: string[] }) {
  return (
    <div className={`bg-zinc-900 border ${color} rounded-xl p-4`}>
      <div className="text-xs font-bold text-zinc-400 mb-3">{title} ({orders.length})</div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {orders.map(o => (
          <div key={o.id} className="bg-zinc-800 rounded p-3 text-xs group">
            <div className="text-zinc-300 mb-2 leading-relaxed">{o.content.slice(0,100)}{o.content.length>100?'...':''}</div>
            <div className="flex gap-1 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity">
              {statuses.map(s => (
                <button key={s} onClick={()=>onStatus(o.id, s)}
                  className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-2 py-0.5 rounded text-xs">
                  → {s}
                </button>
              ))}
            </div>
          </div>
        ))}
        {orders.length===0 && <div className="text-zinc-600 text-xs">空</div>}
      </div>
    </div>
  );
}

// ─── Memory Tab ───────────────────────────────────────────
function MemoryTab({ showToast }: { showToast: (m: string) => void }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [activeModule, setActiveModule] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editObs, setEditObs] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newObs, setNewObs] = useState('');
  const [newMod, setNewMod] = useState<string>('soil');

  const load = useCallback(async () => {
    setLoading(true);
    const url = activeModule === 'all' ? `${API}/api/zhu-memory?limit=100&includeEmbedding=false` : `${API}/api/zhu-memory?module=${activeModule}&limit=50&includeEmbedding=false`;
    const r = await fetch(url).then(x=>x.json());
    setMemories(r.memories || []);
    setLoading(false);
  }, [activeModule]);

  useEffect(() => { load(); }, [load]);

  const deleteMemory = async (id: string) => {
    if (!confirm('確定刪除？（已快照版控）')) return;
    await fetch(`${API}/api/zhu-memory`, { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    load(); showToast('已刪除（快照已存）');
  };

  const saveEdit = async (id: string) => {
    await fetch(`${API}/api/zhu-memory`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id, observation: editObs }) });
    setEditing(null); load(); showToast('已更新');
  };

  const addMemory = async () => {
    if (!newObs.trim()) return;
    await fetch(`${API}/api/zhu-memory`, { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ observation: newObs.trim(), module: newMod }) });
    setNewObs(''); setShowAdd(false); load(); showToast('記憶已存入');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setActiveModule('all')} className={`px-3 py-1 rounded text-xs font-bold border ${activeModule==='all'?'bg-zinc-600 border-zinc-500':'bg-zinc-900 border-zinc-700 text-zinc-400'}`}>全部</button>
          {MODULES.map(m => (
            <button key={m} onClick={()=>setActiveModule(m)}
              className={`px-3 py-1 rounded text-xs font-bold border ${activeModule===m ? MODULE_COLORS[m] : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>
              {m} <span className="text-zinc-500 font-normal">— {MODULE_DESC[m]}</span>
            </button>
          ))}
        </div>
        <button onClick={()=>setShowAdd(!showAdd)} className="bg-amber-600 hover:bg-amber-500 text-black text-sm px-3 py-1.5 rounded font-bold">+ 新增記憶</button>
      </div>

      {showAdd && (
        <div className="bg-zinc-900 border border-amber-700 rounded-xl p-4 mb-4 space-y-3">
          <div className="flex gap-2">
            {MODULES.map(m => (
              <button key={m} onClick={()=>setNewMod(m)}
                className={`px-2 py-1 rounded text-xs border ${newMod===m ? MODULE_COLORS[m] : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{m}</button>
            ))}
          </div>
          <textarea value={newObs} onChange={e=>setNewObs(e.target.value)} rows={4}
            placeholder="觀察/洞察（要有態度 WHY + 作法 HOW）..."
            className="w-full bg-zinc-800 text-zinc-200 text-sm px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:border-amber-500 resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={()=>setShowAdd(false)} className="bg-zinc-700 text-zinc-300 text-sm px-3 py-1.5 rounded">取消</button>
            <button onClick={addMemory} className="bg-amber-600 hover:bg-amber-500 text-black text-sm px-4 py-1.5 rounded font-bold">存入</button>
          </div>
        </div>
      )}

      {loading ? <div className="text-zinc-500">載入中...</div> : (
        <div className="space-y-2">
          {memories.map(m => (
            <div key={m.id} className={`border rounded-xl p-4 group ${MODULE_COLORS[m.module] || 'bg-zinc-900 border-zinc-700'}`}>
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold mt-0.5 opacity-60">{m.module}</span>
                <div className="flex-1">
                  {editing === m.id ? (
                    <div className="space-y-2">
                      <textarea value={editObs} onChange={e=>setEditObs(e.target.value)} rows={4}
                        className="w-full bg-zinc-800 text-zinc-200 text-sm px-3 py-2 rounded border border-amber-500 focus:outline-none resize-none" />
                      <div className="flex gap-2">
                        <button onClick={()=>saveEdit(m.id)} className="bg-amber-600 text-black text-xs px-3 py-1 rounded font-bold">存</button>
                        <button onClick={()=>setEditing(null)} className="bg-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded">取消</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{m.observation}</p>
                  )}
                  {m.date && <div className="text-xs opacity-40 mt-1">{m.date} · hits: {m.hitCount||0}</div>}
                </div>
                {editing !== m.id && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>{ setEditing(m.id); setEditObs(m.observation); }} className="text-xs text-zinc-400 hover:text-amber-400">✏️</button>
                    <button onClick={()=>deleteMemory(m.id)} className="text-xs text-zinc-400 hover:text-red-400">🗑</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {memories.length === 0 && <div className="text-zinc-600">這層還沒有記憶</div>}
        </div>
      )}
    </div>
  );
}

// ─── Xinfa Tab ────────────────────────────────────────────
function XinfaTab({ showToast }: { showToast: (m: string) => void }) {
  const [xinfas, setXinfas] = useState<Xinfa[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Xinfa>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newData, setNewData] = useState({ title: '', principle: '', application: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch(`${API}/api/zhu-xinfa?limit=50&includeEmbedding=false`).then(x=>x.json());
    setXinfas(r.xinfa || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const deleteXinfa = async (id: string) => {
    if (!confirm('確定刪除心法？（已快照版控）')) return;
    await fetch(`${API}/api/zhu-xinfa`, { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    load(); showToast('已刪除（快照已存）');
  };

  const saveEdit = async (id: string) => {
    await fetch(`${API}/api/zhu-xinfa`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id, ...editData }) });
    setEditing(null); load(); showToast('心法已更新');
  };

  const addXinfa = async () => {
    if (!newData.title.trim() || !newData.principle.trim()) { showToast('title 和 principle 必填'); return; }
    const r = await fetch(`${API}/api/zhu-xinfa`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(newData) }).then(x=>x.json());
    if (r.action === 'skipped') { showToast('⚠️ 語義重複，已略過'); }
    else { showToast('心法已存入'); }
    setNewData({ title: '', principle: '', application: '' }); setShowAdd(false); load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-zinc-400 text-sm">心法必須有態度（WHY）+ 作法（HOW）</div>
        <button onClick={()=>setShowAdd(!showAdd)} className="bg-amber-600 hover:bg-amber-500 text-black text-sm px-3 py-1.5 rounded font-bold">+ 新增念頭</button>
      </div>

      {showAdd && (
        <div className="bg-zinc-900 border border-amber-700 rounded-xl p-4 mb-4 space-y-3">
          <input value={newData.title} onChange={e=>setNewData({...newData,title:e.target.value})}
            placeholder="標題（一句有力的話）..." className="w-full bg-zinc-800 text-zinc-200 text-sm px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:border-amber-500" />
          <textarea value={newData.principle} onChange={e=>setNewData({...newData,principle:e.target.value})} rows={3}
            placeholder="態度 WHY：為什麼重要？背後的原則是什麼？"
            className="w-full bg-zinc-800 text-zinc-200 text-sm px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:border-amber-500 resize-none" />
          <textarea value={newData.application} onChange={e=>setNewData({...newData,application:e.target.value})} rows={3}
            placeholder="作法 HOW：下次遇到時具體怎麼做？"
            className="w-full bg-zinc-800 text-zinc-200 text-sm px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:border-amber-500 resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={()=>setShowAdd(false)} className="bg-zinc-700 text-zinc-300 text-sm px-3 py-1.5 rounded">取消</button>
            <button onClick={addXinfa} className="bg-amber-600 hover:bg-amber-500 text-black text-sm px-4 py-1.5 rounded font-bold">存入</button>
          </div>
        </div>
      )}

      {loading ? <div className="text-zinc-500">載入中...</div> : (
        <div className="space-y-3">
          {xinfas.map(x => (
            <div key={x.id} className="bg-zinc-900 border border-zinc-700 hover:border-amber-700 rounded-xl p-4 group transition-colors">
              {editing === x.id ? (
                <div className="space-y-2">
                  <input value={editData.title||''} onChange={e=>setEditData({...editData,title:e.target.value})}
                    className="w-full bg-zinc-800 text-zinc-200 text-sm px-3 py-1.5 rounded border border-amber-500 focus:outline-none" />
                  <textarea value={editData.principle||''} onChange={e=>setEditData({...editData,principle:e.target.value})} rows={3}
                    className="w-full bg-zinc-800 text-zinc-200 text-sm px-3 py-1.5 rounded border border-zinc-700 focus:outline-none resize-none" />
                  <textarea value={editData.application||''} onChange={e=>setEditData({...editData,application:e.target.value})} rows={3}
                    className="w-full bg-zinc-800 text-zinc-200 text-sm px-3 py-1.5 rounded border border-zinc-700 focus:outline-none resize-none" />
                  <div className="flex gap-2">
                    <button onClick={()=>saveEdit(x.id)} className="bg-amber-600 text-black text-xs px-3 py-1 rounded font-bold">存</button>
                    <button onClick={()=>setEditing(null)} className="bg-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded">取消</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="text-amber-300 font-bold text-sm mb-2">{x.title}</div>
                    <div className="text-zinc-300 text-sm mb-1"><span className="text-zinc-500 text-xs">WHY </span>{x.principle}</div>
                    {x.application && <div className="text-zinc-400 text-sm"><span className="text-zinc-500 text-xs">HOW </span>{x.application}</div>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>{ setEditing(x.id); setEditData({title:x.title,principle:x.principle,application:x.application||''}); }} className="text-xs text-zinc-400 hover:text-amber-400">✏️</button>
                    <button onClick={()=>deleteXinfa(x.id)} className="text-xs text-zinc-400 hover:text-red-400">🗑</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {xinfas.length === 0 && <div className="text-zinc-600">心法庫是空的</div>}
        </div>
      )}
    </div>
  );
}

// ─── Digest Tab ───────────────────────────────────────────
const ROUND_THRESHOLD = 10;

function DigestTab({ showToast }: { showToast: (m: string) => void }) {
  const [convo, setConvo] = useState('');
  const [preview, setPreview] = useState<DigestItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [rounds, setRounds] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const shouldAlert = rounds >= ROUND_THRESHOLD && !dismissed && !preview;

  const estimateRounds = (text: string) => {
    const markers = (text.match(/^(Human:|Adam:|你:|我:|築:|ZHU:|Assistant:)/gm) || []).length;
    if (markers > 0) return Math.ceil(markers / 2);
    const paras = text.split(/\n{2,}/).filter((p: string) => p.trim().length > 20);
    return Math.ceil(paras.length / 2);
  };

  const handleConvoChange = (val: string) => {
    setConvo(val);
    setRounds(estimateRounds(val));
  };

  const digest = async () => {
    if (!convo.trim()) return;
    setLoading(true); setPreview(null); setDismissed(false);
    const r = await fetch(`${API}/api/zhu-digest`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ conversation: convo }) }).then(x=>x.json());
    if (r.preview) {
      setPreview(r.preview);
      setSelected(new Set(r.preview.map((_: DigestItem, i: number) => i)));
    }
    setLoading(false);
  };

  const confirm = async () => {
    if (!preview) return;
    setSaving(true);
    const items = preview.filter((_, i) => selected.has(i));
    const r = await fetch(`${API}/api/zhu-digest`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ confirm: true, items }) }).then(x=>x.json());
    showToast(`✨ 存入 ${r.saved} 條，已觸發記憶進化`);
    setPreview(null); setConvo(''); setSaving(false); setRounds(0); setDismissed(false);
  };

  const toggleSelect = (i: number) => {
    const s = new Set(selected);
    s.has(i) ? s.delete(i) : s.add(i);
    setSelected(s);
  };

  return (
    <div className="space-y-4">
      {shouldAlert && (
        <div className="bg-amber-950 border border-amber-500 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-amber-400 font-bold text-sm">⚡ 對話已達 {rounds} 輪 — 該精練了</div>
            <div className="text-amber-600 text-xs mt-1">貼入對話後按「精練」，把這段對話的洞察存進築的記憶</div>
          </div>
          <button onClick={() => setDismissed(true)} className="text-amber-700 hover:text-amber-500 text-xs ml-4">忽略</button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="text-zinc-600 text-xs">觸發 B 輪數</div>
        <button onClick={() => setRounds(r => Math.max(0, r-1))} className="w-6 h-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded text-xs">−</button>
        <span className={`text-sm font-bold w-8 text-center ${rounds >= ROUND_THRESHOLD ? 'text-amber-400' : 'text-zinc-400'}`}>{rounds}</span>
        <button onClick={() => { setRounds(r => r+1); setDismissed(false); }} className="w-6 h-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded text-xs">+</button>
        <div className="text-zinc-600 text-xs">/ {ROUND_THRESHOLD} 輪提醒</div>
        {rounds > 0 && <button onClick={() => { setRounds(0); setDismissed(false); }} className="text-zinc-600 hover:text-zinc-400 text-xs">重置</button>}
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
        <div className="text-amber-400 font-bold text-sm mb-1">✨ ConvoDigest — 對話精練</div>
        <div className="text-zinc-500 text-xs mb-3">貼入對話 → 築精練（有 WHY + HOW 才存）→ 你確認 → 存入生態 + 觸發記憶進化</div>
        <textarea value={convo} onChange={e=>handleConvoChange(e.target.value)} rows={10}
          placeholder="貼入對話內容（貼入後自動估算輪數）..." className="w-full bg-zinc-800 text-zinc-200 text-sm px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:border-amber-500 resize-none" />
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-3">
            <div className="text-zinc-600 text-xs">{convo.length} 字</div>
            {rounds > 0 && <div className={`text-xs ${rounds >= ROUND_THRESHOLD ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>偵測約 {rounds} 輪</div>}
          </div>
          <div className="flex gap-2">
            {convo.trim() && <button onClick={() => { setConvo(''); setRounds(0); }} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm px-3 py-2 rounded">清空</button>}
            <button onClick={digest} disabled={loading || !convo.trim()}
              className="bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold text-sm px-5 py-2 rounded transition-colors">
              {loading ? '精練中...' : '✨ 精練'}
            </button>
          </div>
        </div>
      </div>

      {preview && (
        <div className="bg-zinc-900 border border-green-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-green-400 font-bold text-sm">精練結果（{preview.length} 條）— 選擇要存入的</div>
            <div className="flex gap-2">
              <button onClick={()=>setSelected(new Set(preview.map((_,i)=>i)))} className="text-xs text-zinc-400 hover:text-zinc-200">全選</button>
              <button onClick={()=>setSelected(new Set())} className="text-xs text-zinc-400 hover:text-zinc-200">全不選</button>
            </div>
          </div>

          {preview.map((item, i) => (
            <div key={i} onClick={()=>toggleSelect(i)}
              className={`border rounded-xl p-4 cursor-pointer transition-colors ${selected.has(i) ? 'border-green-600 bg-green-950/20' : 'border-zinc-700 bg-zinc-800/30 opacity-50'}`}>
              <div className="flex items-start gap-3">
                <span className={`text-lg mt-0.5 ${selected.has(i)?'':'grayscale'}`}>{selected.has(i)?'✅':'⬜'}</span>
                <div className="flex-1">
                  <div className="flex gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.type==='xinfa'?'bg-amber-900 text-amber-300':'bg-blue-900 text-blue-300'}`}>
                      {item.type==='xinfa'?'⚡ 心法':'🧠 記憶'}
                    </span>
                    {item.module && <span className={`text-xs px-2 py-0.5 rounded border ${MODULE_COLORS[item.module]||''}`}>{item.module}</span>}
                  </div>
                  {item.type === 'xinfa' ? (
                    <>
                      <div className="text-amber-300 font-bold text-sm mb-1">{item.title}</div>
                      <div className="text-zinc-300 text-sm"><span className="text-zinc-500 text-xs">WHY </span>{item.principle}</div>
                      {item.application && <div className="text-zinc-400 text-sm mt-1"><span className="text-zinc-500 text-xs">HOW </span>{item.application}</div>}
                    </>
                  ) : (
                    <div className="text-zinc-300 text-sm">{item.observation}</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <div className="text-zinc-500 text-sm">已選 {selected.size}/{preview.length} 條</div>
            <button onClick={confirm} disabled={saving || selected.size === 0}
              className="bg-green-700 hover:bg-green-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold text-sm px-5 py-2 rounded transition-colors">
              {saving ? '存入中...' : `存入 ${selected.size} 條`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
