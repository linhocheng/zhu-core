#!/bin/bash
# 啟動 openclaw gateway 並自動停用心跳
# 每次重啟後執行這個，不要直接 launchctl bootstrap

echo "$(date '+%Y-%m-%d %H:%M:%S') 啟動 gateway..."
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.openclaw.gateway.plist 2>/dev/null || true
sleep 5

echo "$(date '+%Y-%m-%d %H:%M:%S') 停用心跳..."
openclaw system heartbeat disable

echo "$(date '+%Y-%m-%d %H:%M:%S') 確認狀態..."
openclaw system heartbeat last

echo "完成。Gateway 活著，心跳停了。"
