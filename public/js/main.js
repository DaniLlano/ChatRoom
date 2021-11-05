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

// enviar mensajes
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // tomar el texto del mensaje
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // emitir el mensaje al servidor
    socket.emit('chatMessage', msg);

    // limpiar input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// enviar mensaje al DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

// agregar el nombre de la sala al DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// agregar a los usuarios al DOM

function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.userName;
        userList.appendChild(li);
    });
}

// alert para el usuario antes de salir
document.getElementById(leave-btn).addEventListener('click', () => {
    const leaveRoom = confirm('Ahhhh, tenes otro grupito de amigues, ok.');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {}
});