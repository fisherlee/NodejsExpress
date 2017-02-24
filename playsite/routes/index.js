var express = require('express');
var router = express.Router();
var os = require('os');


/* GET home page. */
var array = [{phone:'18800000000', area:'中国'}, {phone:'13000000000', area:'中国'}];
router.get('/', function(req, res, next) {


	//第一段判断是否有反向代理IP(头信息：x-forwarded-for)，在判断connection的远程IP，以及后端的socket的IP。
	var client = req.headers['x-forwarded-for'] ||req.connection.remoteAddress ||req.socket.remoteAddress || req.connection.socket.remoteAddress;
  	res.render('index', { title: '小工具', description: client, list: array });
  	//console.log(os.networkInterfaces());
  	
});




module.exports = router;