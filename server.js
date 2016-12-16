// server.js
var jsonServer = require('json-server')
var db_file = 'db.js'
var server = jsonServer.create()
var router = jsonServer.router(db_file)

server.use(jsonServer.defaults)
server.use(router)

server.listen(7000);