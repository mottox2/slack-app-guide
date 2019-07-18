const axios = require('axios')

module.exports = (req, res) => {
  const payload = JSON.parse(req.body.payload) // slashComandsとは内容の取り出し方が違うので注意

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

  res.status(200).end()
}
