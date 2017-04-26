/**
 * Created by abhilekhsingh041992 on 4/26/17.
 */

let redis = require("redis");
let client = redis.createClient();
let socketApi = require('./socketApi');

const ChannelKey = "channels";

// if you'd like
// to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
  console.log("Error " + err);
});


function addChannel(channelName) {
  client.sadd(ChannelKey, channelName);
}

function getChannels(callback) {
  return client.smembers(ChannelKey, function(err, reply) {
    console.log(reply);
    callback(reply);
  });
}


module.exports.addChannel = addChannel;
module.exports.getChannels = getChannels;
