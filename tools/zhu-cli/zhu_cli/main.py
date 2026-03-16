import click
import requests
import json
import sys
from datetime import datetime

BASE = "https://zhu-core.vercel.app"

def _post(path, data):
    r = requests.post(f"{BASE}{path}", json=data, timeout=15)
    r.raise_for_status()
    return r.json()

def _get(path, params=None):
    r = requests.get(f"{BASE}{path}", params=params, timeout=15)
    r.raise_for_status()
    return r.json()

def _patch(path, data):
    r = requests.patch(f"{BASE}{path}", json=data, timeout=15)
    r.raise_for_status()
    return r.json()

@click.group()
def cli():
    """築 CLI — zhu-core API 指令介面"""
    pass

# ── boot ─────────────────────────────────────────────────────────────────────

@cli.command()
def boot():
    """載入開機記憶（bone / eye / root / seed）"""
    data = _get("/api/zhu-boot")
    click.echo("=== bone ===")
    click.echo(json.dumps(data.get("bone", {}), ensure_ascii=False, indent=2))
    click.echo("\n=== eye ===")
    click.echo(json.dumps(data.get("eye", {}), ensure_ascii=False, indent=2))
    lw = data.get("eye", {}).get("lastSessionWords") or {}
    if lw:
        click.echo("\n--- 上次遺言 ---")
        click.echo(lw.get("observation", "")[:400])

# ── memory ────────────────────────────────────────────────────────────────────

@cli.group()
def memory():
    """記憶操作"""
    pass

@memory.command("search")
@click.argument("query")
@click.option("--module", default=None, help="模塊：bone/eye/root/seed/soil")
@click.option("--limit", default=5)
def memory_search(query, module, limit):
    """語義搜尋記憶"""
    params = {"query": query, "limit": limit}
    if module:
        params["module"] = module
    data = _get("/api/zhu-memory", params)
    memories = data.get("memories", [])
    click.echo(f"找到 {len(memories)} 條記憶：\n")
    for m in memories:
        click.echo(f"[{m.get('module','?')}] {m.get('id','')[:8]}... score={m.get('score','')}")
        click.echo(f"  {m.get('observation','')[:120]}")
        click.echo()

@memory.command("add")
@click.argument("content")
@click.option("--module", default="root", help="模塊（預設 root）")
@click.option("--importance", default=7, type=int)
@click.option("--tags", default="", help="逗號分隔的 tags")
def memory_add(content, module, importance, tags):
    """新增記憶"""
    tag_list = [t.strip() for t in tags.split(",") if t.strip()] if tags else []
    data = _post("/api/zhu-memory", {
        "observation": content,
        "module": module,
        "importance": importance,
        "tags": tag_list,
        "date": datetime.now().strftime("%Y-%m-%d")
    })
    click.echo(f"✅ 已寫入記憶 id={data.get('id','?')}")

@memory.command("patch")
@click.argument("memory_id")
@click.option("--hitcount", default=None, type=int, help="設定 hitCount")
def memory_patch(memory_id, hitcount):
    """更新記憶（hitCount 等）"""
    payload = {"id": memory_id}
    if hitcount is not None:
        payload["hitCount"] = hitcount
    _patch("/api/zhu-memory", payload)
    click.echo(f"✅ 記憶 {memory_id[:8]}... 已更新")

@memory.command("list")
@click.option("--module", default="eye", help="模塊（預設 eye）")
@click.option("--limit", default=10)
def memory_list(module, limit):
    """列出某模塊的記憶"""
    data = _get("/api/zhu-memory", {"module": module, "limit": limit})
    memories = data.get("memories", [])
    click.echo(f"=== {module} 模塊（{len(memories)} 條）===\n")
    for m in memories:
        click.echo(f"[{m.get('id','')[:8]}] {m.get('observation','')[:100]}")
        click.echo(f"  importance={m.get('importance')} hitCount={m.get('hitCount',0)} date={m.get('date','')}")
        click.echo()

# ── orders ────────────────────────────────────────────────────────────────────

@cli.group()
def orders():
    """工單操作"""
    pass

@orders.command("list")
@click.option("--status", default="pending")
@click.option("--from_", "--from", default=None)
def orders_list(status, from_):
    """列出工單"""
    params = {"status": status}
    if from_:
        params["from"] = from_
    data = _get("/api/zhu-orders", params)
    items = data if isinstance(data, list) else data.get("orders", [])
    if not items:
        click.echo(f"沒有 {status} 狀態的工單")
        return
    for o in items:
        label = o.get('title') or o.get('content','')[:50]
        full_id = o.get('id','')
        click.echo(f"[{full_id[:8]}] {label}")
        click.echo(f"  id={full_id}")
        click.echo(f"  from={o.get('from')} risk={o.get('risk')} status={o.get('status')}")
        if o.get('action'):
            click.echo(f"  action: {o.get('action','')[:80]}")
        click.echo()

@orders.command("send")
@click.argument("title")
@click.option("--action", required=True, help="要執行的指令")
@click.option("--reason", required=True, help="理由")
@click.option("--risk", default="low", type=click.Choice(["low","medium","high","critical"]))
@click.option("--reversible/--no-reversible", default=True)
@click.option("--api-calls", default=0, type=int)
def orders_send(title, action, reason, risk, reversible, api_calls):
    """送出工單（xiaoxia → zhu）"""
    data = _post("/api/zhu-orders", {
        "from": "xiaoxia", "to": "zhu", "type": "work_order",
        "title": title, "action": action, "reason": reason,
        "risk": risk, "reversible": reversible,
        "estimatedApiCalls": api_calls, "status": "pending"
    })
    click.echo(f"✅ 工單已送出 id={data.get('id','?')}")

@orders.command("done")
@click.argument("order_id")
@click.option("--note", default="")
def orders_done(order_id, note):
    """標記工單完成"""
    _patch("/api/zhu-orders", {"id": order_id, "status": "done", "note": note})
    click.echo(f"✅ 工單 {order_id[:8]}... 已標記完成")

# ── thread ────────────────────────────────────────────────────────────────────

@cli.command()
def thread():
    """查看大圖景（completedChains / brokenChains）"""
    data = _get("/api/zhu-thread")
    t = data.get("thread", data)
    click.echo("=== completedChains ===")
    for c in t.get("completedChains", []):
        click.echo(f"  ✅ {c}")
    click.echo("\n=== brokenChains ===")
    for c in t.get("brokenChains", []):
        click.echo(f"  ❌ {c}")

# ── ping ──────────────────────────────────────────────────────────────────────

@cli.command()
def ping():
    """確認 zhu-core 健康"""
    data = _get("/api/ping")
    click.echo(f"✅ zhu-core alive: {json.dumps(data)}")

