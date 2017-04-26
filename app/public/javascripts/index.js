/**
 * Created by abhilekhsingh041992 on 4/26/17.
 */

$(document).ready(() => {
  
  let remember = $.cookie('remember');
  if (remember === 'true')  {
    window.location.href = '/chat';
  }
  
  
  $("#signup").submit(function() {
    console.log('submit');
    
  });
  

});


$(document).on('click', '#signup', (e) => {
  e.preventDefault();
  
  let username = $('#username').val();
  // set cookies to expire in 14 days
  $.cookie('username', username, { expires: 14 });
  $.cookie('remember', true, { expires: 14 });
  window.location.href = '/chat';
  
  return false;
});

