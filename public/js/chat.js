const socket = io();

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-box');
const chatUserName = document.getElementById('chat-user-name');
const chatUserId = document.getElementById('chat-user-id');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value;
    const userName = chatUserName.value;
    const userId = chatUserId.value;
    socket.emit('message', {
        content: message,
        userName: userName,
        userId: userId
    });
    chatInput.value = '';
});

socket.on('message', (message) => {
    const div = document.createElement('div');
    div.textContent = `${message.userName}: ${message.content}`;
    chatBox.appendChild(div);
});

socket.on('load all messages', (data) => {
    data.forEach(message => {
        const div = document.createElement('div');
        div.textContent = `${message.userName}: ${message.content}`;
        chatBox.appendChild(div);
    });
});