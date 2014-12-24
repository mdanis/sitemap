/*
var express = require('express'),
	app = express();
var server = require('http').createServer(app);
var mysql = require('mysql');
var async = require('async');
var connection = mysql.createConnection({
	host : '10.0.3.99',
	user : 'nemr',
	password : 'nemr',
	database : 'website_nemr',
});
connection.connect();
var port = process.env.PORT || 1334;


var io = require('socket.io').listen(server);
server.listen(port || 1334);
app.use('/public', express.static('public'));
require('./config')(app, io);
require('./routes')(app, io,connection);
console.log('Your application is running on http://localhost:' + port);
*/
var express = require('express');
var app = express();
var mysql = require('mysql');
var port  	 = process.env.PORT || 1335; 
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
//console.log(__dirname)
var database = require('./config/database'); 
var connection = mysql.createConnection(database.dbConfig);
connection.connect(); 	// connect to mysqlDB  
app.use('/public', express.static('public'));
app.use(express.static(__dirname + '/public')); 
require('./application/controllert/jsonController.js')(app,connection);
require('./config/config')(app);
app.listen(port);
console.log("App listening on port " + port);


