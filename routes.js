// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

// Use the gravatar module, to turn email addresses into avatar images:

// Export a function, so that we can pass
// the app and io instances from the app.js file:

module.exports = function(app, io, connection) {

	app.get('/cbse', function(req, res) {

		var queryString = 'SELECT * FROM resource_rack rr left join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "5554" and rack_type_id ="3" order by rr.order asc';
		var _counter = 0;
		connection.query(queryString, function(err, rows, fields) {
			if (err)
				throw err;
			else
				var classArr = new Array();
			for (var i in rows) {
				//console.log(i);

				classArr.push({
					"rack_id" : rows[i].rack_id,
					"name" : rows[i].name
				});

				var subjectQryString = 'SELECT * FROM resource_rack rr left join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "' + rows[i].rack_id + '" and rack_type_id ="4" ';
				classArr[i].subjects = new Array();
				connection.query(subjectQryString, function(err1, subjRows, fields1) {
					//console.log(classArr.length, _counter);
					classArr[_counter].subjects = (subjRows);
					//console.log(i);
					if (parseInt(_counter) + 1 == rows.length) {
						res.render('content-sitemap', {
							data : classArr
						});
					}
					//console.log(JSON.stringify(classArr));
					_counter++;
					//console.log(_counter);

				});
			}

		})
	});

	app.get('/cbse/:name/:rack_id', function(req, res) {
    var siteUrl = req.protocol + '://' + req.get('host');

		var rack_id = req.params.rack_id;
		var selectedClass = '';
		var redirectSiteUrl = 'http://www.extramarks.com';
		//----- query for class list ---
		var classQueryString = 'SELECT * FROM resource_rack rr left join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "5554" and rack_type_id ="3" order by rr.order asc';
		var classArr = new Array();
		connection.query(classQueryString, function(err, rows, fields) {
			if (err)
				throw err;

			for (var i in rows) {
				//console.log(i);
				if(rows[i].rack_id == rack_id)
				selectedClass = rows[i].name;
				
				classArr.push({
					"rack_id" : rows[i].rack_id,
					"name" : rows[i].name
				});
			}
           //selectedClass = rows[i].name
		});

		//----- query for subject chapter list --
		var queryString = 'SELECT * FROM resource_rack rr ';
		queryString += 'join rack_name on rack_name.rack_name_id = rr.rack_name_id ';
		queryString += 'where rack_container_id = "' + rack_id + '" and rr.rack_type_id = "4" ';

		var _counter = 0;
		connection.query(queryString, function(err, rows, fields) {
			
			if (err)
				throw err;
			else
				var subjectsArr = new Array();
			for (var i in rows) {
				//console.log(i);

				subjectsArr.push({
					"rack_id" : rows[i].rack_id,
					"name" : rows[i].name
				});

				var chapterQryString = 'SELECT * FROM resource_rack rr ';
				chapterQryString += 'left join rack_name on rack_name.rack_name_id = rr.rack_name_id ';
				chapterQryString += 'where rack_container_id= "' + rows[i].rack_id + '" and rr.rack_type_id ="5" ';

				subjectsArr[i].subjects = new Array();
				connection.query(chapterQryString, function(err1, subjRows, fields1) {
					//console.log(classArr.length, _counter);
					subjectsArr[_counter].subjects = (subjRows);
					//console.log(i);
					if (parseInt(_counter) + 1 == rows.length) {
						//console.log(JSON.stringify(subjectsArr))
						res.render('chapter-sitemap', {
							data : subjectsArr,
							classes : classArr,
							selectedClass: selectedClass,
							redirectSiteUrl:redirectSiteUrl,
							siteUrl:siteUrl,
							rack_id:rack_id
						});
					}

					_counter++;
					//console.log(_counter);

				});

			}

		});
		// Generate unique id for the room
		//res.render('chapter-sitemap');
		// Redirect to the random room
		//res.redirect('/chat/'+id);
	});

	/*
	app.get('/chat/:id', function(req, res) {
			res.render('chat');
		});*/
	

};

