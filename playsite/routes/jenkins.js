var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs'),
  fileList = [];


// function road(){
//   console.log(__dirname);
//   var filePath = path.join(__dirname, './');
//   fs.readdir(filePath, function(err, results){
//     console.log(results);
//   });
// }


//显示文件路径
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    console.log(list);
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      //file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {

            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};


/* GET home page. */
router.get('/', function(req, res, next) {

    console.log(__dirname);
  	//res.send();
  	walk('/Users/liwei/Desktop', function(err, results) {
  		if (err) throw err;
  		//console.log(results);
  		res.render('jenkins', {jenkinsTitle:"Jenkins", ducomentsResult:results});
  	});

    // road();
    // console.log(fileList);

	//console.log('list:' + fileList);
});

router.get('/upload/:id',function(req,res, next){

		var fileName = req.params.fileName;
		var filePath = path.join('/Users/liwei/Desktop', filename);

    res.download('/upload/', 'mobile.csv');

		// var stat = fs.statSync(filePath);
		// if(stat.isFile()) {
		// 	res.set({
		// 		'Content-Type': 'application/octet-stream',
  //  				'Content-Disposition': 'attachment; filename='+fileName,
  // 				 'Content-Length': stats.size
		// 	})
		// 	var fileStream = fs.createReadStream(filePath);
  //       	fileStream.pipe(res);
		// }else {
		// 	res.end(404);
		// }
});

module.exports = router;
