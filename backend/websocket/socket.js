const { Server } = require('socket.io');
let io;

function setupWebSocket(server) {
  io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
  });
}

function emitEvent(event, data) {
  if (io) io.emit(event, data);
}

module.exports = { setupWebSocket, emitEvent };