const axios = require('axios')
const { WebClient } = require('@slack/web-api')

module.exports = async (req, res) => {
  const body = req.body
  const event = body.event

  if (body.type === 'url_verification') {
    return res.status(200).send(body.challenge)
  }
  res.status(200).send()
  const web = new WebClient(process.env.SLACK_TOKEN)

  switch (event.type) {
    // https://api.slack.com/events/reaction_added
    case 'reaction_added':
      if (event.reaction === 'heart') {
        // scopeの設定が足りていることを確認すること
        // https://api.slack.com/methods/channels.history
        const messages = await web.channels.history({
          channel: event.item.channel,
          latest: event.item.ts,
          inclusive: true,
          count: 1,
        })
        const message = messages.messages[0]
        web.chat.postMessage({
          ...message,
          channel: 'share'
        })
      }
      return
    // https://api.slack.com/events/channel_created
    case 'channel_created':
      web.chat.postMessage({
        text: `新しいチャンネル「<#${event.channel.id}>」が作成されました。`,
        channel: '#share'
      })
      return
    default:
      return
  }
}
