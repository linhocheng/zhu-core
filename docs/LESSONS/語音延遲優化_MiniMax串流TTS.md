# 語音延遲優化 — MiniMax 串流 TTS 設定與踩雷

> 踩雷心法附件 · 2026-06-10 · 築
> 場景：LiveKit 即時語音 agent，想降低「角色開口的首音延遲」。
> 適用：ailivex / ailive / 任何用 MiniMax T2A v2 做即時 TTS 的專案。

---

## 一、為什麼要串流（優化目標）

非串流 TTS：送一整句 → 等 MiniMax 把**整句**合成完 → 一次拿回全部音訊 → 才開始播。
句子越長，使用者等越久才聽到第一個字（首音延遲高）。

串流 TTS（`stream:true`）：MiniMax 邊合成邊用 SSE 逐塊吐音訊 → 第一塊到就立刻推給 LiveKit 播 → **首音延遲大幅下降**，使用者幾乎一說完就聽到角色開口。

---

## 二、正確設定（MiniMax T2A v2 串流）

API：`POST https://api.minimax.io/v1/t2a_v2?GroupId=<GroupId>`

關鍵 payload 欄位：

```jsonc
{
  "text": "...",
  "model": "speech-02-turbo",
  "stream": true,
  "stream_options": { "exclude_aggregated_audio": true },  // ★ 必加，見第三節
  "voice_setting": {
    "voice_id": "...",
    "speed": 1.0,   // ★ float（0.5–2.0），不可 int() cast，否則 0.9→0 念太慢/不發聲
    "vol":   1.0,   // ★ 同樣 float
    "pitch": 0      // pitch 才是 int（-12 ~ 12）
  },
  "audio_setting": { "sample_rate": 24000, "format": "pcm" }
}
```

SSE 解析：逐行讀 `data:` 開頭，`[DONE]` 結束，每行是一個 JSON chunk，音訊在 `chunk.data.audio`（hex 字串，`bytes.fromhex()` 轉 PCM）。

---

## 三、★ 最大的坑：最後一塊會把「整句」再送一次 → 角色說兩次

### 現象
改成串流後，每一句 agent 語音都**重複播放兩次**，打招呼、正常回應都一樣，100% 必現。聽起來像「說完整句，又從頭說一遍」（序列重複，不是同時 echo）。

### 根因
MiniMax T2A v2 串流的每個 SSE chunk 帶一個 `data.status`：

| `data.status` | 意義 | `data.audio` 內容 |
|---|---|---|
| `1` | 串流中的逐塊音訊 | 該塊的增量音訊 |
| `2` | **最後一塊** | **整句的完整音訊（前面所有塊的總和，整包再送一次）** |

MiniMax 這樣設計，是為了讓「不想處理串流」的人能直接拿最後一塊就好。
但如果你**逐塊 push** 又**沒跳過 status==2**，就會：
逐塊播完整句 → 最後再把整句 push 一次 → **播兩遍**。

### 實測證據（本機探針，真實數據）
```
chunk#0  status=1  audio 15572 bytes
chunk#1  status=1  audio 30650 bytes
chunk#2  status=1  audio 40680 bytes
chunk#3  status=1  audio 79692 bytes
chunk#4  status=1  audio 32 bytes
chunk#5  status=1  audio 0 bytes
chunk#6  status=2  audio 166626 bytes  ← 等於前面全部加總 166626，整句重送
```

### 修法（兩層，確定性）
1. **payload 加 `stream_options.exclude_aggregated_audio: true`** → 請 API 不要送最後那包整句（status==2 的 audio 會變 0）。省頻寬，官方建議做法。
2. **解析迴圈仍硬擋 `data.status == 2`** → 即使某帳號/版本不認上面那參數，程式層也保證不會 push 整包。

> 為什麼兩層都要：天條「確定性的工作用程式保證，不要拜託 API 自律」。
> 只靠 ① 是「拜託 API 別送」，萬一被忽略就破功；② 是程式級兜底，100% 不重複。

```python
# 解析迴圈內
data = chunk.get("data", {}) or {}
if data.get("status") == 2:      # ← 最後一塊是整句，跳過
    continue
audio_hex = data.get("audio", "")
if not audio_hex:
    continue
output_emitter.push(bytes.fromhex(audio_hex))
```

---

## 四、診斷心法（為什麼這次繞了遠路）

問題是「改串流之後」出現的，卻先往**前端**（livekit 雙 AudioContext）查了四輪沒中。教訓：

- **「改了 X 之後壞」→ 第一件事是 diff X 的前後版本（.bak），不是先理論推前端。** 這次有 `minimax_tts.py.bak`，一 `diff` 就看到 `stream:false→true` + 逐塊 push，根因區域立刻縮到 `_run()`。
- **本機重現勝過遠端 cycle**：寫一支 50 行探針，import 真實協定、實打 MiniMax、印出每塊 status + bytes，當場證實「最後一塊＝整句」。比「改 code → 部署 → 撥電話聽 → 猜」快十倍，而且是數據不是猜。
- **能動的對照組是金線索**：ailive（同 livekit 版本、同 attach pattern）不重複。把「能動 vs 壞」逐行 diff，差異就是答案的邊界——這次反而證明前端那段不是元兇（能動版也有它）。

對應 feedback memory：
- `能本機重現就不要等遠端 cycle`
- `決策前先問：解決問題還是繞開根本問題`
- `天條：確定性的工作用程式不要丟 LLM`（這裡延伸成「不要拜託 API 自律」）

---

## 五、一句話總結

> MiniMax 串流 TTS 要降延遲，記得 `exclude_aggregated_audio:true` + 程式硬擋 `status==2`，
> 否則最後一塊整句重送，角色會說兩次。
