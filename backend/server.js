const http = require('http');
const app = require('./app');
const { setupWebSocket } = require('./websocket/socket');

const server = http.createServer(app);
setupWebSocket(server);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));