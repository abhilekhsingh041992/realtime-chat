/**
 * Created by abhilekhsingh041992 on 4/26/17.
 */
var express = require('express');
var router = express.Router();
var redisApi = require('../redisApi');

router.get('/', function(req, res, next) {
  redisApi.getChannels(function (channels) {
    res.json(channels);
  });
});


router.get('/new', function(req, res, next) {
  var channelId = req.query.channelId;
  redisApi.addChannel(channelId);
  res.json({ msg: 'Added'});
});


router.get('/:channelId/messages', function(req, res, next) {
  let channelId = req.params.channelId;
  let start = req.query.start;
  let stop = req.query.stop;
  
  if(channelId){
    if(start && stop) {
      redisApi.getMessages(channelId, start, stop, function (data) {
        res.json(data);
      });
    } else {
      redisApi.getRecentMessages(channelId, 2, function (messages) {
        res.json(data);
      });
    }
    
  } else {
    res.json("Required parameters not passed");
  }
});


module.exports = router;


