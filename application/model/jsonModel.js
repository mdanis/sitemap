module.exports = function(app, connection) {
	return {

		getClassList : function(boardContainerId, callback) {

			var queryString = 'SELECT * FROM resource_rack rr left join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "' + boardContainerId + '" and rack_type_id ="3" order by rr.order asc';
			
			connection.query(queryString, function(err, rows, fields) {
				callback(err, rows);
			});

		},
		getSubjectList : function(classObj, callback) {
			var _counter = 0;
			if ( classObj instanceof Array) {

				var classArr = new Array();
				for (var i in classObj) {

					classArr.push({
						"rack_id" : classObj[i].rack_id,
						"name" : classObj[i].name
					});
					classArr[i].subjects = new Array();
					var subjectQryString = 'SELECT * FROM resource_rack rr left join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "' + classObj[i].rack_id + '" and rack_type_id ="4" ';

					connection.query(subjectQryString, function(err, subjRows, fields) {
						classArr[_counter].subjects = (subjRows);
						if (parseInt(_counter) + 1 == classObj.length) {
							callback(err, classArr)
						}
						_counter++;
					});
				}

			} else {

				var queryString = 'SELECT * FROM resource_rack rr left join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "' + classObj + '" and rack_type_id ="4" order by rr.order asc';
				connection.query(queryString, function(err, rows, fields) {
					callback(err, rows);
				});
			}
		},

		getChapterList : function(subjObj, callback) {
			//console.log("ANIS"+JSON.stringify(subObj))
			var _counter = 0;
			if ( subjObj instanceof Array) {

				var chapterArr = new Array();
				for (var i in subjObj) {

					chapterArr.push({
						"rack_id" : subjObj[i].rack_id,
						"name" : subjObj[i].name
					});
					chapterArr[i].chapters = new Array();
					var chapterQryString = 'SELECT * FROM resource_rack rr left join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_container_id= "' + subjObj[i].rack_id + '" and rack_type_id ="5" ';

					connection.query(chapterQryString, function(err, chapterRows, fields) {
						chapterArr[_counter].chapters = (chapterRows);
						if (parseInt(_counter) + 1 == subjObj.length) {
							callback(err, chapterArr)
						}
						_counter++;
					});
				}
			} else {
				//console.log("inside");
			}
		},
		getServices : function(callback) {
			var queryString = 'SELECT * FROM services where parent_service_id = "0" and status = "1" ';
			connection.query(queryString, function(err, rows, fields) {
				callback(err, rows);
			});
		},
		getBoardList : function(serviceId, callback) {

			var queryString = 'SELECT * FROM resource_rack rr left join rack_name on rack_name.rack_name_id = rr.rack_name_id  where rack_type_id ="2"  and rr.client_status = "1" and rr.status="1" order by rr.order asc';
			//console.log(queryString);
			connection.query(queryString, function(err, rows, fields) {
				
				callback(err, rows);
			});

		},
		getSubjectsFromService: function(serviceId,callback){
			var query = "SELECT chapter.rack_id as chapter_id, rack_name.name as subject_name,rr.rack_id as subject_id, class_name.name as class_name,class.rack_id as class_id, board_name.name as board_name, board.rack_id as board_id FROM resource_rack rr ";
				query += "left join resource_rack chapter on chapter.rack_container_id = rr.rack_id and chapter.rack_type_id = '5' "
				query += "join resource_rack class on class.rack_id = rr.rack_container_id ";
				query += "join rack_name class_name on class_name.rack_name_id = class.rack_name_id ";
				query += "join resource_rack board on board.rack_id = class.rack_container_id ";
				query += "join rack_name board_name on board_name.rack_name_id = board.rack_name_id ";
				query += "join rack_name on rack_name.rack_name_id = rr.rack_name_id ";
				query += "join repository_board_tagging rbt on rbt.board_container_id = rr.rack_id ";
				query += "join main_content on main_content.container_id = rbt.repository_container_id ";
				query += "join repository_board_service_tagging rbst on rbst.repository_service_id = main_content.service_id "; 
				query += "join services on services.service_id = rbst.board_service_id "; 
				query += "where rr.rack_type_id = '4' and rr.client_status = '1' and rr.status = '1' and services.service_id = '"+serviceId+"' ";
				query += " and class.rack_id in (5561,11115,5563,11117) "
				query += " group by rr.rack_id order by board_name,class_name ";
			//console.log(query);
			connection.query(query, function(err, rows, fields) {
				if(err)
				throw err;
				//console.log(rows);
				callback(err, rows);
			});
		}
	}

};
