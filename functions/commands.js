// 5章の実装
const axios = require('axios')
// 6章の実装で追加
const { WebClient } = require('@slack/web-api')

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
    // 6章の実装で追加
    case 'dialog':
      const web = new WebClient(process.env.SLACK_TOKEN)
      console.log(body)
      web.dialog.open({
        trigger_id: body.trigger_id,
        dialog: {
          title: 'タスクの追加',
          submit_label: '保存する',
          callback_id: 'task_dialog',
          elements: [
            {
              label: 'タスク名',
              name: 'name',
              type: 'text'
            },
            {
              label: 'チャンネル',
              name: 'channel',
              type: 'select',
              data_source: 'channels'
            }
          ]
        }
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
