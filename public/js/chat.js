

  document.addEventListener("DOMContentLoaded", function() {
    const chatIcon = document.getElementById("chat-icon");
    const chatWindow = document.getElementById("chat-window");
  
    // Function to check if the click is inside the chat div
    function isInsideChat(element) {
      return chatIcon.contains(element) || chatWindow.contains(element);
    }
  
    // Event listener to open chat window
    chatIcon.addEventListener("click", function() {
      chatWindow.style.display = "block";
    });
  
    // Event listener to close chat window when clicking outside
    document.addEventListener("click", function(event) {
      if (!isInsideChat(event.target)) {
        chatWindow.style.display = "none";
      }
    });
  });

var socket = io();

var button = document.getElementById('send-message');
var input = document.getElementById('user-msg');

button.addEventListener('click',function(e){
    if(input.value){
        socket.emit('chat-message',input.value);
        const MSG = document.createElement('p');
        MSG.classList.add('Own-message');
        MSG.innerText = input.value;
        document.getElementById('chat-messages').append(MSG);
        input.value = '';
    }
});


socket.on('message',(msg)=>{
    console.log(msg);
    const MSG = document.createElement('p');
    MSG.classList.add('message');
    MSG.innerText = msg;
    document.getElementById('chat-messages').append(MSG);
})
  