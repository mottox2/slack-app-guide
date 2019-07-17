const { WebClient } = require('@slack/web-api')
const token = process.env.SLACK_TOKEN
const web = new WebClient(token)
web.chat
  .postMessage({
    text: 'API でもメッセージを送信したい! ',
    channel: 'slack_test'
  })
  .then(res => {
    console.log(res)
  })
