// 5章の実装
const axios = require('axios')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = async (req, res) => {
  const body = req.body
  const [subCommand, ...args] = body.text.split(' ')
  res.status(200).end()
  switch (subCommand) {
    case 'hello':
      axios.post(body.response_url, {
        text: `（^ - ^）.｡oO（${body.command} ${body.text}）`,
        response_type: 'in_channel'
      })
      break
    case 'yamabico':
      await sleep(5000)
      axios.post(body.response_url, {
        text: `（^ - ^）.｡oO（${body.command} ${body.text}）`,
        response_type: 'in_channel'
      })
      break
    case 'help':
    case '':
      axios.post(body.response_url, {
        text: `mycommandのコマンド
\`hello [message]\`
メッセージをオウム返しします。

\`help\`
サブコマンド一覧を表示します。`
      })
      break
    default:
      axios.post(body.response_url, {
        text: `${subCommand}はコマンドではありません`
      })
      break
  }
}
