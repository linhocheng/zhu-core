---
name: OpenAI 圖片生成 API 參數備查
description: gpt-image-2 與 dall-e-3 的 API 差異、正確參數、size 映射，防止套錯舊參數
type: reference
originSessionId: 70c24f21-d407-49cc-afe3-3cf8cbeaaf7e
---
## gpt-image-2（2026-04-21 發布，當前最新）

**endpoint:** `POST https://api.openai.com/v1/images/generations`

```json
{
  "model": "gpt-image-2",
  "prompt": "...",
  "n": 1,
  "size": "1024x1024",
  "output_format": "png"
}
```

**踩雷：** `response_format` 在 gpt-image-2 是 unknown parameter（這是 dall-e-3 的舊參數）。
**正確：** 用 `output_format: "png"` / `"jpeg"` / `"webp"`，可加 `output_compression: 0-100`。

**支援 size：** `1024x1024`、`1792x1024`（橫）、`1024x1792`（直）。
**回傳：** `data[0].b64_json`（base64，需 `Buffer.from(b64, "base64")`）

**size 映射函數（anews-platform image worker 已實作）：**
```typescript
function mapToDalleSize(size: string): "1024x1024" | "1792x1024" | "1024x1792" {
  const [w, h] = size.split("x").map(Number);
  if (w > h) return "1792x1024";
  if (h > w) return "1024x1792";
  return "1024x1024";
}
```

---

## dall-e-3（舊款，仍可用）

```json
{
  "model": "dall-e-3",
  "prompt": "...",
  "n": 1,
  "size": "1024x1024",
  "response_format": "b64_json"
}
```

---

## 驗證指令（換模型前先試打）

```bash
curl -s -X POST https://api.openai.com/v1/images/generations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-image-2","prompt":"test photo","n":1,"size":"1024x1024","output_format":"png"}' \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('OK' if d.get('data') else d.get('error'))"
```
