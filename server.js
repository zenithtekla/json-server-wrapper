// server.js
var port = 7000

var jsonServer 	= require('json-server')

var server 			= jsonServer.create()
var router 			= jsonServer.router('db.json')
var middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)


server.listen(port, function () {
  console.log('JSON Server is running on port', port)
});