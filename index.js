// 4章 はじめてのCloud Functionsまで
exports.sample = (req, res) => {
  res.send('Hello World')
}

// 4章 functions-framework導入以降
const sample = (req, res) => {
  res.send('Hello World!')
}

// Windowsの場合パスの表記に気をつけること
const commands = require('./functions/commands')

// 参考: https://github.com/googlesamples/functions-as-a-service
exports.function = (req, res) => {
  const paths = {
    '/commands': commands,
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
