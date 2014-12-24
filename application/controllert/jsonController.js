module.exports = function(app, connection) {
	var model = require('../model/jsonModel.js')(app, connection);
	//****************************  use Ejs pages for rendering html ********************
	app.get('/', function(req, res) {
	res.redirect('/sitemap/board-papers');
	});
		app.get('/sitemap/board-papers', function(req, res) {
			var siteUrl = req.protocol + '://' + req.get('host');
			res.render('board-paper-service', {
							Title:"Sitemap",
							siteUrl:siteUrl
						});
		});
		
		app.get('/sitemap/board-papers/:boardPaperList/:serviceId', function(req, res) {
			var serviceId = req.params.serviceId;
			var siteUrl = req.protocol + '://' + req.get('host');
			var redirectSiteUrl = 'http://www.extramarks.com';
			var serviceType=req.params.boardPaperList;
			
			if(serviceType == 'standard-Q&As')
			serviceType = 'question';
			else if(serviceType == 'solved-board-paper' || serviceType == 'model-test-paper')
			serviceType = 'titlelist';
			else if(serviceType == 'multiple-choces')
			serviceType = 'testlist';
			var subjectList = {};
		    subjectList.CBSE = new Object();
		    subjectList.ICSE = new Object();
		    var icseSubjectArr = new Object();
		    var cbseSubjectArr = new Object();
			model.getSubjectsFromService(serviceId,function(err,rows){
				//console.log(rows)
				for(var i in rows){
					
					    if(rows[i].board_name == 'CBSE'){
					    	
					    	if(!cbseSubjectArr[rows[i].class_name])
					    	cbseSubjectArr[rows[i].class_name] = new Array();
					    	
					    	cbseSubjectArr[rows[i].class_name][rows[i].subject_name] = new Array();	
					    	
						cbseSubjectArr[rows[i].class_name][rows[i].subject_name]= {
							"subject_id":rows[i].subject_id,
							"subject_name":rows[i].subject_name,
							"chapter": rows[i].chapter_id
							};
						//console.log(subjectArr,"sdsdsd");
						subjectList[rows[i].board_name][rows[i].class_name] = [{
							"class_id":rows[i].class_id,
							"class_name":rows[i].class_name,
							"subject": cbseSubjectArr[rows[i].class_name]
						}];
						
						}
						
						else{
													
													if(!icseSubjectArr[rows[i].class_name])
													icseSubjectArr[rows[i].class_name] = new Array();
											
											
											icseSubjectArr[rows[i].class_name][rows[i].subject_name] = new Array();
											
											icseSubjectArr[rows[i].class_name][rows[i].subject_name]= {
													"subject_id":rows[i].subject_id,
													"subject_name":rows[i].subject_name,
													"chapter": rows[i].chapter_id
													};
												//console.log(subjectArr,"sdsdsd");
												subjectList[rows[i].board_name][rows[i].class_name] = [{
													"class_id":rows[i].class_id,
													"class_name":rows[i].class_name,
													"subject": icseSubjectArr[rows[i].class_name]
												}];
												}
											
								
										}
						
				//console.log(JSON.stringify(subjectList));
				
				
				//console.log(serviceType)
				res.render('board-Class-Subject-List', {
							Title:"Board Class",
							siteUrl:siteUrl,
							subjectList:subjectList,
							redirectSiteUrl:redirectSiteUrl,
							serviceId:serviceId,
							serviceType:serviceType
						});
				
			});
			
		});
		
	app.get('/sitemap', function(req, res) {
		var siteUrl = req.protocol + '://' + req.get('host');
		model.getServices(function(err,rows){
			//console.log(rows)
			res.render('repository', {
							Title:"Sitemap",
							siteUrl:siteUrl,
							services:rows
						});
		})
		
	
	});
	app.get('/sitemap/board-list/:serviceId', function(req, res) {
		var siteUrl = req.protocol + '://' + req.get('host');
		var serviceId = req.params.serviceId;
		model.getBoardList(serviceId, function(err,boardRows){
			if(err)
			res.end(err);
			//console.log(boardRows);
			res.render('board-list',{
				siteUrl:siteUrl,
				boardList:boardRows
			});
		});
	})
	app.get('/sitemap/:board/:containerId', function(req, res) {
		var siteUrl = req.protocol + '://' + req.get('host');
		var boardContainerId = req.params.containerId;
		var boardName = req.params.board;
		model.getClassList(boardContainerId, function(err, rows) {
			model.getSubjectList(rows, function(err1, subjRows) {
				//res.json(subjRows);
				res.render('content-sitemap', {
							data : subjRows,
							siteUrl:siteUrl,
							boardName:boardName,
							boardContainerId:boardContainerId
						});

			});
		});
	});
	
app.get('/sitemap/:board/:name/:containerId/:serviceId', function(req, res) {
        var siteUrl = req.protocol + '://' + req.get('host');
        var boardContainerId = req.params.containerId;
		var boardClassId = req.params.serviceId;
		var boardContainerId = req.params.containerId;
		var redirectSiteUrl = 'http://www.extramarks.com';
		var selectedClass = '';
		var classList;
		var boardName = req.params.board;
		
		//getting classes list
		model.getClassList(boardContainerId, function(err, rows) {
			 classList = rows;
			 for (var i in rows) {
				if(rows[i].rack_id == boardClassId)
				selectedClass = rows[i].name;
			}
		});
		
		//getting subject list and corresponding chapters
		model.getSubjectList(boardClassId, function(err, subjRows){
			
		//console.log(subjRows)
			model.getChapterList(subjRows, function(err, chapterRows){
				// console.log(chapterRows)
							//res.json({classList:classList,chapterDetail:chapterRows});
							res.render('chapter-sitemap', {
							data : chapterRows,
							classes : classList,
							selectedClass: selectedClass,
							redirectSiteUrl:redirectSiteUrl,
							siteUrl:siteUrl,
							rack_id:boardClassId,
							boardName:boardName,
							boardContainerId:boardContainerId
						   });
						});
		});
    });

}
