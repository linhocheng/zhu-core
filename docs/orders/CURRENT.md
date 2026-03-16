# 築的當前指令

**當前任務：** AILIVE Platform — Phase 0 地基
**開始日期：** 2026-03-16
**狀態：** 🔨 施工中

## 本次任務
建立 ailive-platform 新平台的地基：
1. GitHub repo 建立
2. Next.js 初始化
3. Firebase Admin 接通
4. /api/characters GET + POST
5. Vercel 部署，域名通
6. 驗收：curl 測試通過

## 驗收標準
```bash
curl https://ailive-platform.vercel.app/api/characters  # 回傳 { characters: [] }
curl -X POST https://ailive-platform.vercel.app/api/characters \
  -d '{"name":"測試","type":"vtuber"}'  # 回傳 { id: "xxx" }
```

## 施工日誌
詳見：~/.ailive/zhu-core/docs/AILIVE_BUILD_LOG.md
藍圖文件：AILIVE_Platform_Blueprint_v1.docx（對話記錄中）

## 紅線
- 謀謀不動
- moumou-dashboard 不動
- collection 前綴必須是 platform_*
