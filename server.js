// server.js
let moment = require('moment')
bundleHash = moment().format('YYYY-MM-DD-HH-mm-ss')

let config = require('./gulp-config')

let jsonServer 	= require('json-server')

let server 			= jsonServer.create()
let router 			= jsonServer.router(config.db_json)

Object.keys(router.db.getState())
  .forEach((key) => console.log(`/${key}`))

let middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)


server.listen(config.port, function () {
  console.log(bundleHash, 'JSON Server is running on port', config.port)
});