var express = require('express');
var router = express.Router();
var socketApi = require('../socketApi');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat', function(req, res, next) {
  res.render('chat/index', { title: 'Express'});
});


router.get('/send', function(req, res, next) {
  let roomId = req.query.roomId;
  let message = req.query.message;
  socketApi.sendNotification(roomId, message);
  res.render('index', { title: 'Express' });
});



module.exports = router;
