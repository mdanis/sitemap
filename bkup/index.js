var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mysql = require('mysql');
var path = require('path');


app.use('/public', express.static('public'));
//app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/views'));


 app.get('/', function(req,res) {
  res.sendFile(__dirname+'/views/content-sitemap.html');
});
server.listen(process.env.PORT || 1339);
io.sockets.on('connection', function(socket) {
socket.on('getClassData', function(username) {
	console.log('load class detail page');
 express().get(':/classDetail', function(req, res) {
     res.sendFile(__dirname+'/views/sitemap-nursery.html');
     
 });
	socket.emit('getData', 'data');
});

});
/* var fs = require('fs');
fs.readFile('views/content-sitemap.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    require('http').createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(1339);
});
*/
var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'nodejs',
    }
);
connection.connect();
var queryString = 'SELECT * FROM nodetable';
 
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Name = : ', rows[i].name);
    }
});
 
connection.end();


// *********************   end my sql ************ //