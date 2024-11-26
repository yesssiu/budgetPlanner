const socket = io();

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-box');
const chatUserName = document.getElementById('chat-user-name');
const chatUserId = document.getElementById('chat-user-id');

//Event listener for submitting chat messages
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value;
    const userName = chatUserName.value;
    const userId = chatUserId.value;
    //Send message event to the server with the message content
    socket.emit('message', {
        content: message,
        userName: userName,
        userId: userId
    });
    chatInput.value = '';
});

//Listen for message events
socket.on('message', (message) => {
    const div = document.createElement('div');
    div.textContent = `${message.userName}: ${message.content}`;
    chatBox.appendChild(div);
});

//Listen for loading all messages events
socket.on('load all messages', (data) => {
    data.forEach(message => {
        const div = document.createElement('div');
        div.textContent = `${message.userName}: ${message.content}`;
        chatBox.appendChild(div);
    });
});