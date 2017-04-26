/**
 * Created by abhilekhsingh041992 on 4/26/17.
 */
var socket_io = require('socket.io');
var redisApi = require('./redisApi');
var io = socket_io();
var socketApi = {};


socketApi.io = io;

io.on('connection', function(socket) {
  console.log('A user connected');
  
  redisApi.getChannels(function (channels) {
    channels.forEach(function (channelId) {
      socket.on(channelId, function (data) {
        console.log(data);
        io.sockets.emit(channelId, data);
      });
    })
  });
  
});

socketApi.sendNotification = function(roomId, message) {
  io.sockets.emit(roomId, {message: message});
};



module.exports = socketApi;


