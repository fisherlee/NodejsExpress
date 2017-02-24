var express = require('express');
var router = express.Router();
var readline = require('line-read');
var fs = require('fs');
var readline = require('linebyline');
var csv = require('node-csv').createParser('\t');
var Phone = require('./model/phonelocation.js');
var formidable = require('formidable');

var upload_floder = '/upload/';
var mobile_title = '手机号码归属地查询';


router.get('/', function(req, res, next) {
    res.render('mobile', {mobileTitle:mobile_title, upload_success:''});
});

router.get('/mobile_original', function(req, res, next){

  var path = '/Users/liwei/Project/playsite/public/upload/mobile.csv';

  var inputArray = [];

  if (path.length > 0) {

    csv.parseFile(path, function(err, data) {
    
    console.log('data, length', data, data.length);   

    for (var i = data.length - 1; i >= 0; i--)  {
      
      var line = data[i];
      
      if (line.length > 0) {

          var string = line[0];
          var array = string.split(',');

          array.forEach(function(mobile) {
            
            var reg = /^1\d{10}$/;
            if (reg.test(mobile)) {
              inputArray.push(mobile);
            
            }
          });
        };
    };
    console.log('mobiles = ', inputArray);
    
   // for (var i = inputArray.length - 1; i >= 0; i--) {
   //          var mobile = inputArray[i]
   //          var subString = mobile.substring(0,7)

   //            if (subString === phone) {
   //              console.log('subString', mobile);
   //            };
   //        };

    Phone.getallone(inputArray, function(err, location){
      
      if (err) {
        console.log('phone error', err);
      }else {
        

        if (location != null) {
          if (location.length > 2) {
            console.log('getallone', location, inputArray.length);
            
            console.log('----',location);
            res.send(location);
            res.end();
          }
          res.send(location);
        };

      }

    });

  });
  };
  

  //res.end();
});

router.get('/queryData', function(req, res, next){

  Phone.get(1300001, function(err, location){
    if (err) {
      console.log('phone error', err);
    }else {
      var data = location.phone+','+location.com+','+location.area+','+location.city;
      res.send(data);
      res.end();
    }
  });

  //res.send('abcd');
  //res.redirect('/mobile');
  console.log('abcd');

});

router.post('/', function(req, res) {

  //上传之前删除所有文件
  fs.readdir('/Users/liwei/Project/playsite/public/upload/', (err, data) => {
    if (data.length > 0) {
      for (var i = data.length - 1; i >= 0; i--) {
        var uplodFile = '/Users/liwei/Project/playsite/public/upload/'+data[i];
        fs.unlink(uplodFile);
        console.log('successfully deleted /tmp/hello');
      };
    };
    console.log(data);
  });

  //上传
  var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';    //设置编辑
    form.uploadDir = 'public' + upload_floder;  //设置上传目录
    form.keepExtensions = true;  //保留后缀
    form.maxFieldsSize = 50 * 1024 * 1024;   //文件大小

  form.parse(req, function(err, fields, files) {

    if (err) {
      res.locals.error = err;
      res.render('mobile', {  });
      return;   
    }  
     
    console.log('files.csvFile type', files.csvFile.name)
    var extName = '';  //后缀名
    switch (files.csvFile.type) {
      case 'text/csv':
        extName = 'csv';
        break;     
    }

    if(extName.length == 0){
        res.send('只支持csv格式文件');
        res.end();
        return;          
    }

    var avatarName = 'mobile'+'.'+extName; //files.csvFile.name;//Math.random() + '.' + extName;
    var newPath = form.uploadDir + avatarName;
    uploadPath = newPath;
    console.log(newPath);
    fs.renameSync(files.csvFile.path, newPath);  //重命名
  });

  res.render('mobile', {mobileTitle:mobile_title, upload_success:'上传成功'});
  res.redirect('mobile');
  res.end;
});


module.exports = router;