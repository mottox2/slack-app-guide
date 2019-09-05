// 8章

// 参考コード
// https://glitch.com/edit/#!/slack-clipit-simplified?path=src/verifySignature.js

const crypto = require('crypto')
const timingSafeCompare = require('tsscmp')

const isVerified = req => {
  const signature = req.headers['x-slack-signature']
  const timestamp = req.headers['x-slack-request-timestamp']
  if (!signature || !timestamp || !process.env.SLACK_SIGNING_SECRET) {
    return false
  }
  const hmac = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
  const [version, hash] = signature.split('=')

  // タイムスタンプの確認
  const fiveMinutesAgo = ~~(Date.now() / 1000) - 60 * 5
  if (timestamp < fiveMinutesAgo) return false

  hmac.update(`${version}:${timestamp}:${req.rawBody}`)

  // 期待している値と一致しているか確認
  return timingSafeCompare(hmac.digest('hex'), hash)
}

module.exports = isVerified
