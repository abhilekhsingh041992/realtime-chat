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

function addMessage(channelName, message) {
  
  client.lpush(channelName, JSON.stringify(message))
}

function getRecentMessages(channelName, count, callback) {
  return client.llen(channelName, function(err, reply) {
    return getMessages(channelName, reply-count, reply, callback);
  });
}


function getMessages(channelName, start, stop, callback) {
  return client.lrange(channelName, start, stop, function(err, messages) {
    console.log(messages);
    callback({offset: start, messages: messages});
  });
}


module.exports.addChannel = addChannel;
module.exports.getChannels = getChannels;
module.exports.addMessage = addMessage;
module.exports.getMessages = getMessages;
module.exports.getRecentMessages = getRecentMessages;


function addChannels(channels) {
    channels.forEach(function (channel) {
        addChannel(channel);
    });
}

// addChannels([
//     "Sports",
//     "Adventure",
//     "travels",
//     "Art",
//     "fashion",
//     "News",
//     "Technology",
//     "Design"
// ]);