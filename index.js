// 4章 はじめてのCloud Functionsまで
exports.sample = (req, res) => {
  res.send('Hello World')
}

// 4章 functions-framework導入以降
const sample = (req, res) => {
  res.send('Hello World!')
}

const commands = require('./functions/commands')
const actions = require('./functions/actions')
const events = require('./functions/events')

// 8章 リクエストの検証
const isVerified = require('./isVerified')

// 参考: https://github.com/googlesamples/functions-as-a-service
exports.function = (req, res) => {
  // 8章 リクエストの検証
  if (!isVerified(req)) {
    return res.status(404).end()
  }

  const paths = {
    '/commands': commands,
    '/actions': actions,
    '/events': events,
    '/sample': sample,
    '/': () => res.send(Object.keys(paths))
  }
  for (const [path, route] of Object.entries(paths)) {
    if (req.path.startsWith(path)) {
      return route(req, res)
    }
  }
  res.send('No path found')
}

exports.scrape = async (req, res) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  page.emulate({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
    viewport: {
      width: 1024,
      height: 720,
      isMobile: false,
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false
    }
  })
  await page.goto('http://example.com')

  const results = await page.evaluate(() => {
    const paragraphs = []
    document.querySelectorAll('p').forEach(node => {
      paragraphs.push(node.innerText)
    })
    return {
      h1: document.querySelector('h1').innerText,
      paragraphs
    }
  })
  await browser.close()

  res.send(JSON.stringify(results))
}
