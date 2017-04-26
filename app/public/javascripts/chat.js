/**
 * Created by abhilekhsingh041992 on 4/26/17.
 */

let socket = io();

const timeout = 5000;
let channels = [];
let currChannelId;
let $channelHtml = $("#channelHtml");
let $chatAreaHtml = $("#chatAreaHtml");
let userId;


$(document).ready(() => {
  
  let remember = $.cookie('remember');
  if (remember === 'true')  {
    userId = $.cookie('username');
  } else {
    window.location.href = '../';
  }
 
  $channelHtml.hide();
  $chatAreaHtml.hide();
  startRefreshForms();
});



function startRefreshForms() {
  setTimeout(startRefreshForms, 2 * 60 * 1000);
  
  if(channels.length === 0) {
    console.log("Calling");
    $.get('/channels', (response, status) => {
      console.log(response);
      setChannels(response);
    });
  }
  
}


function setChannels(newChannels) {
  if(channels.length > 0) return;
  channels = newChannels;
  
  let $channels = $(".channels");
  
  newChannels.forEach(function (channel) {
    $channelHtml.find('li').attr('id', channel);
    $channelHtml.find('.channelId').html(channel);
    $channelHtml.find('img').attr('src', 'https://api.adorable.io/avatars/285/qwert@' + channel + '.png');
    $channelHtml.find('.unread-count').hide();
    $channels.append($channelHtml.html());
    receiveMessage(channel);
  });
  
}


$('ul').on('click', '.channelId', (e) => {
  e.preventDefault();
  let newChannelId = $(e.target).html();
  console.log(newChannelId);
  if(newChannelId !== currChannelId) {
    currChannelId = newChannelId;
    
    let $currChannelId = $('#' + currChannelId);
    $('.member_list li').removeClass('selected');
    console.log($currChannelId);
    $('.new_message_head .title').text(currChannelId);
    $currChannelId.closest('li').addClass('selected');
    $currChannelId.find('unread-count').hide();
  
    $(".chat_area ul").html('');
  }
  return false;
});


$('.message-text').keypress(function (e) {
  const key = e.which;
  console.log(key);
  if(key === 13)  {
    readAndSendMessage();
    return false;
  }
});

$(document).on('click', '.send-message', (e) => {
  e.preventDefault();
  readAndSendMessage();
  return false;
});

function readAndSendMessage() {
  let messageText = $('.message-text');
  let message = messageText.val();
  console.log(message);
  messageText.val(' ');
  sendMessage(currChannelId, message);
}

function receiveMessage(channelId) {
  socket.on(channelId, function (data) {
    console.log('Received Message');
    console.log(data);
    
    $channelId =  $('#' + channelId);
    if(channelId === currChannelId) {
      console.log('Same Channel');
      let unReadCount = $channelId.find('.unread-count');
      unReadCount.hide();
      
      let $chatArea = $(".chat_area ul");
      console.log($chatArea);
      $chatAreaHtml.find('img').attr('src', 'https://api.adorable.io/avatars/285/qwert@' + data.userId + '.png');
      $chatAreaHtml.find('.userId').html(data.userId);
      $chatAreaHtml.find('.message-view').html(data.message);
      $chatArea.append($chatAreaHtml.html());
  
      $('.chat_area').animate({
        scrollTop: $('.chat_area ul li:last-child').offset().top + 'px'
      });

    } else {
      console.log('Different Channel');
      let unReadCount = $channelId.find('.unread-count');
      let count = unReadCount.text();
      console.log(count);
      console.log(parseInt(count)+1);
      console.log(unReadCount);
      unReadCount.html(parseInt(count)+1);
      unReadCount.show();
    }
  });
}


function sendMessage(channelId, message) {
  console.log(channelId, message);
  socket.emit(channelId, { userId: userId, message: message });
}


function makeid()  {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  for(let i=0; i < 7; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
