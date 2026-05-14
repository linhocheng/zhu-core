---
name: 靜默失敗用「缺席的 log」診斷
description: 連續兩次等不到 log 要主動停下來宣告靜默失敗，不是繼續刷新
type: feedback
originSessionId: 1f508fc4-3965-4471-a5fd-c41836c621c1
---
連續兩次等不到預期的 log 出現，要主動停下來說：「有某個地方在靜默失敗，我要系統性地找根因」，而不是繼續刷新等待。

**Why:** 今天 lmHttp 用了 `catch { resolve({}) }` 把所有 HTTP/parse 錯誤都吞掉，導致 editor worker 靜默返回空陣列。六個重啟循環、兩個 PID，靠「為什麼沒有 poll error log」這個缺席訊號才定位到根因。繼續刷新只會浪費時間，缺席的 log 本身就是信號。

**心態:** 偵探姿態，把「缺席」當訊號。連續兩次等不到預期的 log 不是「再等等」，是「立刻停下找根因」。`catch { resolve({}) }` 吞錯誤的反射要被打斷 — 改成 `catch(e) { console.warn(...) }`，不影響流程但讓錯誤可追。沉默的工具是要被質疑的，不是要被信任的。

**How to apply:** Worker 沒有預期輸出時，第一步問「它是靜默成功（找到 0 筆）還是靜默失敗（錯誤被吞）」。`catch { resolve({}) }` 這類寫法在 fire-and-forget worker 裡要改為 `catch(e) { console.warn(...); resolve({}) }` — 不影響流程，但讓錯誤有跡可查。
