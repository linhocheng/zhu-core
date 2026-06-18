# LESSONS 2026-06-18 · ailivex v12 讀網址改版（靜默+主動）

## L1：RPC fire-and-forget 才是正解，不是壞掉要修的
- 現象：v12 RPC 10s timeout → 前端看到「失敗」，但 agent 還在繼續處理
- 根因：原設計 handle_share_source() 同步等 Sonnet 摘要（可能 20-30s），超 LiveKit RPC 預設 timeout
- 下次：async 工作（fetch+LLM）一律 asyncio.create_task() 立刻 return ok→queued，不卡在 RPC 等待
- 對應 feedback：feedback_flagged_risk_must_be_verified（標了風險要真驗）→ 這次是進場前識別出 timeout 風險並直接設計掉

## L2：前端 payload 格式要跟 agent 的 json.loads 對齊
- 現象：frontend 送 `payload: url`（raw string），agent `json.loads(data.payload)` → JSONDecodeError → 空 url → 靜默失敗
- 根因：RPC performRpc payload 是字串，agent 預期 JSON，兩邊各自假設格式沒對齊
- 下次：任何 RPC payload 改設計時，frontend 和 agent 兩邊一起改，grep `json.loads(data.payload)` 確認格式
- 對應 feedback：feedback_backend_client_must_sync

## L3：靜默設計（不說話就去做）比「先 ACK 再跑」更乾淨的語音 UX
- 現象：原設計角色說「我看一下哦」ACK → 然後 set_audio_enabled(False) 等 → 摘要完再說
- 問題：說「我看一下哦」本身也要 TTS 時間，且聽起來像機器人
- 下次：角色打斷話→靜音→火前進背景取資料→完成後主動用 generate_reply 開口，比說 ACK 更自然
- 對應 feedback：feedback_soul_design_narrative_not_schema（角色行為要自然不要 schema 味）

## L4：改功能不等於改了舊 base page，要看現場
- 現象：Adam 說「/realtime/ 貼網址會失效」，查後發現 base page 早就有 URL 框，但用戶進的是 base 頁（dispatch 還是舊版）
- 根因：DEFAULT_VOICE_VERSION 還是 'v3'，用戶頁沒有 v12 的 source_intake；改功能要想清楚「誰真的會吃到這個版本」
- 下次：新功能驗前先看 token route 的版本決策，確認用戶真的拿到有新功能的 agent
- 對應 feedback：feedback_interface_blood_vessel_check（介面建完強制問血管通了嗎）
