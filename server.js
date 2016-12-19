// server.js
var moment = require('moment')
bundleHash = moment().format('YYYY-MM-DD-HH-mm-ss')

var config = require('./gulp-config')

var jsonServer 	= require('json-server')

var server 			= jsonServer.create()
var router 			= jsonServer.router(config.db_json)
var middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)


server.listen(config.port, function () {
  console.log(bundleHash, 'JSON Server is running on port', config.port)
});