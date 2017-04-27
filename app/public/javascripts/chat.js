/**
 * Created by abhilekhsingh041992 on 4/26/17.
 */

let socket = io();

const timeout = 5000;
let channels = [];
let currChannelId;
let $channelHtml = $("#channelHtml");
let $chatMessageHtml = $("#chatMessageHtml");
let $chatAreaHtml = $("#chatAreaHtml");

let userId;
let channelOffsets = {};

$(document).ready(() => {
  
  let remember = $.cookie('remember');
  if (remember === 'true')  {
    userId = $.cookie('username');
  } else {
    window.location.href = '../';
  }
 
  $channelHtml.hide();
  $chatMessageHtml.hide();
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
  let $messageSection = $('.message_section');
  
  newChannels.forEach(function (channel) {
    $channelHtml.find('li').attr('id', channel);
    $channelHtml.find('li').attr('onclick', 'selectChannel("'+channel+'")');
    $channelHtml.find('.channelId').html(channel);
    $channelHtml.find('img').attr('src', 'https://api.adorable.io/avatars/285/qwert@' + channel + '.png');
    $channelHtml.find('.unread-count').hide();
    $channels.append($channelHtml.html());
    
    $chatAreaHtml.find('.chat-area').attr('id', getChannelChatId(channel));
    $chatAreaHtml.find('.chat-area').hide();
    $messageSection.append($chatAreaHtml.html());
    channelOffsets[channel] = -1;
    receiveMessage(channel);
  });
  
}

function getChannelChatId(channel) {
    return channel+"chat-area";
}


$('ul').on('click', 'li', (e) => {
  e.preventDefault();
  let $target =  $(e.target);
    console.log($target);
  if($target.is("li")) {
      let newChannelId = $target.find('.channelId').html();
      if(newChannelId !== currChannelId) {
          currChannelId = newChannelId;

          let $currChannelId = $('#' + currChannelId);
          $('.member_list li').removeClass('selected');
          console.log($currChannelId);
          $('.new_message_head .title').text(currChannelId);
          $currChannelId.closest('li').addClass('selected');
          $currChannelId.find('.unread-count').hide();

          $(".chat_area ul").html('');
          return false;
      }
  }



});

function getMessages(channelId) {

}

$(document).on('keypress', '.message-text', (e) => {
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


function selectChannel(newChannelId) {
  if(newChannelId !== currChannelId) {
    currChannelId = newChannelId;
    
    let $currChannelId = $('#' + currChannelId);
    let $currChannelArea = $('#' + getChannelChatId(currChannelId));
    $('.chat-area').hide();
    $currChannelArea.show();
    
    $('.member_list li').removeClass('selected');
    console.log($currChannelId);
    $('.new_message_head .title').text(currChannelId);
    $currChannelId.closest('li').addClass('selected');
    $currChannelId.find('.unread-count').html(0);
    $currChannelId.find('.unread-count').hide();
  
  }
}

function readAndSendMessage() {
  let messageText = $('#' + getChannelChatId(currChannelId)).find('.message-text');
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
    if(channelId !== currChannelId) {
      console.log('Different Channel');
      let unReadCount = $channelId.find('.unread-count');
      let count = unReadCount.text();
      console.log(count);
      console.log(parseInt(count)+1);
      console.log(unReadCount);
      unReadCount.html(parseInt(count)+1);
      unReadCount.show();
    } else {
        console.log('Same Channel');
        let unReadCount = $channelId.find('.unread-count');
        unReadCount.hide();
    }

    let $chatArea =  $('#' + getChannelChatId(channelId)).find(".chat_area ul");
    console.log($chatArea);
    $chatMessageHtml.find('img').attr('src', 'https://api.adorable.io/avatars/285/qwert@' + data.userId + '.png');
    $chatMessageHtml.find('.userId').html(data.userId);
    $chatMessageHtml.find('.message-view').html(data.message);
    $chatArea.append($chatMessageHtml.html());
  
    $('.chat_area').animate({
      scrollTop: $('.chat_area ul li:last-child').offset().top + 'px'
    });
    
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
