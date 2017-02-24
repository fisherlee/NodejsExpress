var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('smssend', {sendTitle:'发送短信'});
});

module.exports = router;
