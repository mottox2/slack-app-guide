const axios = require('axios')
const token = process.env.SLACK_TOKEN
const api = axios.create({
  baseURL: 'https://slack.com/api',
  headers: {
    Authorization: `Bearer ${token}`
  }
})
api
  .post(`/chat.postMessage`, {
    text: 'API でもメッセージを送信したい! ',
    channel: 'general' // お好きなチャンネルに変更してね
  })
  .then(res => {
    console.log(res.data) // レスポンスを表示
  })
