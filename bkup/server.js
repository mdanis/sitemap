var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var async = require('async');
app.use(bodyParser.json());

app.use(bodyParser.json({
	type : 'application/vnd.api+json'
}));

app.use(bodyParser.urlencoded({
	extended : true
}));

app.use(methodOverride('X-HTTP-Method-Override'));

app.use('/public', express.static('public'));

app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

var connection = mysql.createConnection({
	host : '10.0.3.99',
	user : 'nemr',
	password : 'nemr',
	database : 'website_nemr',
});
connection.connect();
//all classes of cbse board
var queryString = 'SELECT * FROM resource_rack rr join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "5554" and rack_type_id ="3" ';

app.use("/", express.static(__dirname));

app.get('/home', function(req, res) {
	var classArr = new Array();
	var _counter = 0;
	async.series([
	function(callback) {
		connection.query(queryString, function(err, rows, fields) {
			if (err)
				throw err;

			for (var i in rows) {
				classArr.push({
					"classId" : rows[i].rack_id,
					"className" : rows[i].name
				});
				classArr[i].subjects = new Array();
				

			}
			console.log("function1 called");
			//res.render('content-sitemap', { title: 'Board Details' })
			callback();
		})
	},
	function(callback) {

		if (classArr.length > 1) {
			console.log("function2 called");

			for (var i in classArr) {
				//console.log(i);
				classArr[i].subjects = new Array();
				var subjectQryString = 'SELECT * FROM resource_rack rr join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "' + classArr[i].classId + '" and rack_type_id ="4" ';

				connection.query(subjectQryString, function(err, subjRows, fields) {
					for (var j in subjRows) {
						classArr[i].subjects.push({
							'name' : subjRows[j].name,
							'id' : subjRows[j].rack_id
						});
						//console.log(i);
					}
					
					callback();

				});

			}
			
		}
	}], function(err) {//This function gets called after the two tasks have called their "task callbacks"
		if (err)
			return next(err);
		//Here locals will be populated with 'user' and 'posts'
		console.log(classArr);
		res.render('content-sitemap', {
			title : classArr
		})
	});

	//res.render('content-sitemap', { title: 'Board Details' })
	//connection.end();

	//res.render(__dirname+'/views/content-sitemap.html');
});

function setValue(classArr, fn) {
	for (var i in classArr) {
		classArr[i].subjects = new Array();
		var subjectQryString = 'SELECT * FROM resource_rack rr join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "' + classArr[i].classId + '" and rack_type_id ="4" ';

		connection.query(subjectQryString, function(err, subjRows, fields) {
			for (var j in subjRows) {
				classArr[i].subjects.push({
					'name' : subjRows[j].name,
					'id' : subjRows[j].rack_id
				});
			}

		});

	}

}

app.get('/classDetail', function(req, res) {

	//res.render(__dirname+'/views/sitemap-nursery.html');
	res.render('sitemap-nursery', {
		title : 'class-detail'
	})

});

server.listen(process.env.PORT || 1334);
io.sockets.on('connection', function(socket) {
	socket.on('getClassData', function(username) {
		console.log('load class detail page');
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

// *********************   end my sql ************ //