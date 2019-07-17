const axios = require('axios')

const payload = {
  text: 'Hello Slack Apps!'
}

const url = process.env.WEBHOOK_URL
console.log(url)
axios.post(url, payload)
