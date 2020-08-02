const express = require('express');
const app = express();
const uuidV4 = require('./utils/uuidv4')
const { PORT } = require('./config/keys');
const server = require('http').Server(app);
const io = require('socket.io')(server)

app.use(express.static('public'));
app.use(express.json());

app.get('/room', (req, res) => {
  res.json({ ROOM_ID: uuidV4() })
});
app.get('/joinRoom/:roomId', (req, res) => {
  res.json({ ROOM_ID: req.params.roomId })
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(PORT, error => {
  if (error) console.error(`Error to start server: ${error}`);
  console.log(`Server ran on port: ${PORT}`)
})