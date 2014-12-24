var finalhandler = require('finalhandler')
var http = require('http')
var Router = require('router')
var express = require('express');
var app = express();
var router = new Router()
app.use('/public', express.static('public'));
app.use('/public', express.static('public'));
//app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/views'));
app.set('views', __dirname + '/public');
router.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.sendfile(__dirname+'/views/content-sitemap.html');
})

var server = http.createServer(app)

server.listen(1337, function onListening() {
  console.log('http server listening on port ' + this.address().port)
})

function app(req, res) {
	//console.log(res);
  router(req, res, finalhandler(req, res))
}
