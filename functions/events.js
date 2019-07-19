const axios = require('axios')
const { WebClient } = require('@slack/web-api')

module.exports = (req, res) => {
  const body = req.body
  console.log(body)

  switch (body.type) {
    case 'url_verification':
      return res.status(200).send(body.challenge)
    default:
      return res.status(200).send()
  }
}
