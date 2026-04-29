#!/bin/bash
# sync-memory.sh — 同步 Claude Code 記憶與 zhu-core/memory/ git mirror
# 用法：
#   ./sync-memory.sh push   把 Claude Code memory → zhu-core mirror（之後 git commit & push）
#   ./sync-memory.sh pull   把 zhu-core mirror → Claude Code memory
#
# 工作流：
#   本機改完 → ./sync-memory.sh push → git commit & push
#   VM 開工前 → git pull → ./sync-memory.sh pull

set -e

ZHU_CORE_MEMORY="$HOME/.ailive/zhu-core/memory"

# 偵測 Claude Code 的 memory 目錄（macOS / Linux 路徑不同）
# macOS: ~/.claude/projects/-Users-<user>/memory/
# Linux: ~/.claude/projects/-home-<user>/memory/
# 用 HOME 編碼路徑直指主家，避免抓到子專案 cwd 的 memory（之前 head -1 抓錯過）
# Claude Code 把 cwd 編碼成 project subdir 名稱：/, _, . 全變 -
HOME_ENCODED=$(echo "$HOME" | sed 's|[/_.]|-|g')
CLAUDE_MEMORY="$HOME/.claude/projects/${HOME_ENCODED}/memory"

# 後備：HOME 編碼路徑找不到時，回退到「.md 檔案最多」的那個 memory dir
if [ ! -d "$CLAUDE_MEMORY" ] && [ -d "$HOME/.claude/projects" ]; then
    CLAUDE_MEMORY=$(find "$HOME/.claude/projects" -maxdepth 2 -type d -name memory 2>/dev/null | while read d; do
        count=$(ls -1 "$d"/*.md 2>/dev/null | wc -l)
        echo "$count $d"
    done | sort -rn | head -1 | awk '{ $1=""; sub(/^ /,""); print }')
fi

if [ -z "$CLAUDE_MEMORY" ]; then
    echo "無法決定 Claude Code memory 目錄路徑"
    exit 1
fi
# push 必須要 source 存在；pull 會幫你建（VM 第一次同步用得到）
if [ "$1" = "push" ] && [ ! -d "$CLAUDE_MEMORY" ]; then
    echo "找不到 Claude Code memory 目錄：$CLAUDE_MEMORY"
    echo "如果是新環境，先在 Claude Code 跑一次對話讓它建立目錄"
    exit 1
fi

echo "Claude memory: $CLAUDE_MEMORY"
echo "Mirror:        $ZHU_CORE_MEMORY"

case "$1" in
    push)
        mkdir -p "$ZHU_CORE_MEMORY"
        rsync -av --delete "$CLAUDE_MEMORY/" "$ZHU_CORE_MEMORY/"
        echo ""
        echo "pushed Claude memory -> zhu-core mirror"
        echo "下一步: cd ~/.ailive/zhu-core && git add memory/ && git commit && git push"
        ;;
    pull)
        if [ ! -d "$ZHU_CORE_MEMORY" ] || [ -z "$(ls -A "$ZHU_CORE_MEMORY" 2>/dev/null)" ]; then
            echo "zhu-core mirror 是空的，先在另一端 push 過再 pull"
            exit 1
        fi
        mkdir -p "$CLAUDE_MEMORY"
        rsync -av --delete "$ZHU_CORE_MEMORY/" "$CLAUDE_MEMORY/"
        echo ""
        echo "pulled zhu-core mirror -> Claude memory"
        ;;
    link)
        # 把所有非 canonical 的 project subdir 的 memory/ 改成 symlink → canonical
        # 已是 symlink → skip；real dir 有內容 → 警告 skip（要手動處理）；空或不存在 → 建 symlink
        if [ ! -d "$CLAUDE_MEMORY" ]; then
            echo "canonical memory 不存在: $CLAUDE_MEMORY（先 pull）"
            exit 1
        fi
        canonical_parent=$(dirname "$CLAUDE_MEMORY")
        canonical_name=$(basename "$canonical_parent")
        projects_dir=$(dirname "$canonical_parent")
        echo "Canonical:    $canonical_parent"
        echo "Projects dir: $projects_dir"
        echo ""
        linked=0; skipped_link=0; warn_content=0
        for d in "$projects_dir"/*/; do
            name=$(basename "$d")
            target="${d}memory"
            [ "$name" = "$canonical_name" ] && continue
            if [ -L "$target" ]; then
                echo "[skip-symlink] $name"
                skipped_link=$((skipped_link+1))
                continue
            fi
            if [ -d "$target" ] && [ -n "$(ls -A "$target" 2>/dev/null)" ]; then
                echo "[WARN-content] $name has non-empty memory dir, 手動評估收編 vs 放生"
                warn_content=$((warn_content+1))
                continue
            fi
            [ -d "$target" ] && rmdir "$target"
            ln -s "../$canonical_name/memory" "$target"
            echo "[linked]       $name → ../$canonical_name/memory"
            linked=$((linked+1))
        done
        echo ""
        echo "linked=$linked, already-symlink=$skipped_link, has-content=$warn_content"
        if [ "$warn_content" -gt 0 ]; then
            echo "⚠️  有 non-empty 沒處理，記憶不會共享到那些 cwd"
        fi
        ;;
    *)
        echo "用法: $0 {push|pull|link}"
        echo ""
        echo "push: 本機 Claude memory -> zhu-core/memory/（之後手動 git commit & push）"
        echo "pull: zhu-core/memory/ -> 本機 Claude memory（從 git pull 拉到的版本同步進去）"
        echo "link: 把所有 project subdir 的 memory/ 改 symlink → canonical（多 cwd 共享一份記憶）"
        exit 1
        ;;
esac
