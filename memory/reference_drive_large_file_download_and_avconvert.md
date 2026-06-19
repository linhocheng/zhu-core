---
name: 從 Drive 抓大檔(confirm token)+ macOS 原生壓影片(avconvert)
description: 本機沒 gdown/rclone/ffmpeg 時，怎麼把 Drive 公開大檔抓下來、怎麼用 avconvert 壓 mp4、怎麼用純 python 讀 mp4 解析度
type: reference
originSessionId: 08832aa8-fa1e-4887-af87-a80d97ed776a
---
本機(adamlin Mac)**沒有 ffmpeg/ffprobe/gdown/rclone**，gcloud token 對 Drive API 回 403(無 Drive scope)。替代路徑：

**Drive 公開大檔下載(>100MB 會被毒掃確認頁擋)**：
1. `curl -sL -c ck.txt "https://drive.google.com/uc?export=download&id=<ID>"` 拿到 HTML 確認頁。內容含 `Virus` 字樣＝檔案是公開的，只是大檔確認頁。
2. 從 HTML 抓 `name="confirm" value="..."` 與 `name="uuid" value="..."`，再
3. `curl -sL -b ck.txt -G "https://drive.usercontent.google.com/download" --data-urlencode id=<ID> --data-urlencode export=download --data-urlencode confirm=<t> --data-urlencode uuid=<uuid> -o out.mp4`
（MCP `download_file_content` 回 base64，140MB 檔會炸 context，不要用。）

**壓影片**：macOS 有 `/usr/bin/avconvert`。`avconvert -s in.mp4 -p <Preset> -o out.mp4 --replace`。preset 列表用 `avconvert --help`。實測 1080×1920/15Mbps 直向片：
- `Preset1280x720`→720×1280 但碼率高(67s=64MB)
- `Preset960x540`→540×960(67s=42MB)，放 375px 手機框內最銳利的性價比點
- `PresetMediumQuality`→保比例但降到 320×568(7MB，略軟)
- `PresetLowQuality`→124×224(太糊)
avconvert 輸出 H.264 + **moov 在 mdat 前(faststart)**，適合 web Range 串流。無 CRF/bitrate 旗標，只能靠 preset。

**讀 mp4 解析度/時長(無 ffprobe)**：`mdls`/`mdimport` 對 /tmp 檔回 null。改純 python 解 box：moov>trak>tkhd 最後 8 bytes 是 width/height(16.16 fixed)；moov>mvhd 拿 timescale/duration。確定性程式，秒讀。

來源：2026-06-19 udnnews demo 換 3 支講者影片(吳念真/張立/蔣勳)，anita 上傳 1080p 原檔到 Drive，本機抓下壓 540×960 換上 Cloud Run。
