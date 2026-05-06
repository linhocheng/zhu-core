# launchd 安裝

> Phase 1 的 daemon plist 集中放這。
> Adam 看過後決定要不要 load。

---

## ai.zhu.boot.plist

Boot daemon — 每天 08/14/20 點 + 上線時跑 `boot.mjs`，產出 `state/boot-context.md`。

### 安裝
```bash
cp ~/.ailive/zhu-core/zhu-self/launchd/ai.zhu.boot.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/ai.zhu.boot.plist
launchctl start ai.zhu.boot
```

### 驗證
```bash
launchctl list | grep ai.zhu.boot
cat ~/.ailive/zhu-core/zhu-self/logs/boot.log
ls -la ~/.ailive/zhu-core/zhu-self/state/boot-context.md
```

### 停用
```bash
launchctl unload ~/Library/LaunchAgents/ai.zhu.boot.plist
```

---

## node 路徑注意

plist 中 `/usr/local/bin/node` 是 Intel Mac 的預設。
M1 Mac 通常是 `/opt/homebrew/bin/node`，安裝前先 `which node` 確認，必要時改 plist。

---

*v0.1 · 2026-05-06*
