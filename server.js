// server.js
var port = 7001

var jsonServer 	= require('json-server')

require('./db');

var server 			= jsonServer.create()
var router 			= jsonServer.router('db.json')
var middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)


server.listen(port, function () {
  console.log('JSON Server is running on port', port)
});