const proxy = require('http-proxy-middleware')
const url = process.env.NODE_ENV == 'development' ? 'https://jsonplaceholder.typicode.com' : 'http://admin.syang.wang/api'
console.log("🚀 ~ file: setupProxy.ts ~ line 3 ~ url", url);
module.exports = function (app) {
  app.use(proxy('/custom', {
    target: url,
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      "^/custom": "/"
    }
  }))
}