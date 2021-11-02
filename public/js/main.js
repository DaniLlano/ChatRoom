const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById(users);

// vamos a traer el usuario y la sala desde a URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})

const socket = io();

// unir a la sala de chat
socket.emit('joinRoom', {username, room});

// buscar una sala y sus usuarios
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

// mensaje del servidor
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // manejar el scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
});