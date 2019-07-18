const axios = require('axios')

// https://api.slack.com/reference/messaging/blocks
// https://api.slack.com/reference/messaging/block-elements

const payload = {
  blocks: [
    {
      block_id: 'task_name',
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '本を読む'
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
}

const url = process.env.WEBHOOK_URL
axios
  .post(url, payload)
  .then(value => {
    console.log('Done:', value.data)
  })
  .catch(e => {
    console.error('Error:', e.response.data)
  })
