const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// configuramos la ruta de archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'NucbaChat Bot';

// ejecutar cuando un cliente se conecta
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

    // damos la bienvenida al usuario
    socket.emit('message', formatMessage(botName, 'Alla le estan dando la bienvenida!'));

    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} se sumo a la joda`)
      );

            // enviar usuarios e informacion de la sala
            io.to(user.room).emit('roomUser', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
    });

    // escuchar por mensajes en el chat
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // ejecutar la siguiente funcion cuando un cliente se desconecta
    socket.on('disconect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.userName} ¿seguro que queres irte?, ok.`)
            );
            
            //enviar usuarios e informacion de la sala
            io.to(use.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`))