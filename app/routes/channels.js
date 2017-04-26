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


module.exports = router;


