const axios = require('axios')
const { WebClient } = require('@slack/web-api')

// 紙面の都合上、1ファイルにしていますが、typeごとに別ファイルに分けるといいです。
module.exports = (req, res) => {
  res.status(200).end()

  const payload = JSON.parse(req.body.payload) // slashComandsとは内容の取り出し方が違うので注意
  const web = new WebClient(process.env.SLACK_TOKEN)
  switch (payload.type) {
    case 'block_actions':
      const action_id = payload.actions[0].action_id
      switch (action_id) {
        case 'complete':
          const messageBlocks = payload.message.blocks
          const now = new Date()
          const responsePayload = {
            blocks: messageBlocks.map(block => {
              return block.block_id !== 'task_actions'
                ? block
                : {
                    type: 'context',
                    elements: [
                      {
                        type: 'mrkdwn',
                        text: `${now.getMonth() + 1}/${now.getDate()}に完了しました`
                      }
                    ]
                  }
            }),
            replace_original: true
          }
          axios.post(payload.response_url, responsePayload)
          break
        case 'delete':
          axios.post(payload.response_url, {
            delete_original: true
          })
          break
      }
      break

    case 'message_action':
      const { team, channel, message_ts, message, response_url } = payload // オブジェクトの分割代入
      const formattedTs = message_ts.replace('.', '')
      const messageURL = `https://${team.domain}.slack.com/archives/${channel.id}/p${formattedTs}`

      web.chat
        .postMessage({
          channel: 'share',
          text: '',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: message.text + `（<${messageURL}|元メッセージ>）`
              }
            },
            {
              block_id: 'task_actions',
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Complete'
                  },
                  action_id: 'complete'
                },
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Delete'
                  },
                  action_id: 'delete',
                  style: 'danger'
                }
              ]
            }
          ]
        })
        .catch(e => {
          console.log(e.data)
        })

      // 反応がないと不安なのでactionsの押されたチャンネルに通知もしておく
      axios
        .post(response_url, {
          text: '#general に投稿しました',
          link_names: 1
        })
        .catch(e => console.log(e.response))
      break
  }
}
