//var socket = io.connect('/');
/*
module.exports = function(app,io,connection,async){
	var express = require('express');

var queryString = 'SELECT * FROM resource_rack rr join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "5554" and rack_type_id ="3" ';
var _counter = 0;
connection.query(queryString, function(err, rows, fields) {
	if (err)
	throw err;
	else
	var classArr = new Array();
				for (var i in rows) {
					//console.log(i);
					
				classArr.push({
					"classId" : rows[i].rack_id,
					"className" : rows[i].name
				});
				
				var subjectQryString = 'SELECT * FROM resource_rack rr join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "' + rows[i].rack_id + '" and rack_type_id ="4" ';
				classArr[i].subjects = new Array();
				connection.query(subjectQryString, function(err1, subjRows, fields1) {
					console.log(classArr.length, _counter);
					classArr[_counter].subjects = (subjRows);
					//console.log(i);
					if(parseInt(_counter)+1 == rows.length)
					console.log(JSON.stringify(classArr));
					_counter++;
					//console.log(_counter);
							
				});
			}
			
})

	app.use('/public', express.static('public'));
}*/
