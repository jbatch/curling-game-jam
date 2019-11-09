const express = require('express');
const io = require('socket.io');
const http = require('http');
const path = require('path');

const port = 3000;
const FRONTEND_DIST_DIR = 'dist/client';

const app = express();
const server = http.createServer(app);
const webSocketServer = io(server);

app.use(express.static(FRONTEND_DIST_DIR));

webSocketServer.on('connection', ws => {
  console.log('Got connection');
  ws.on('message', message => {
    console.log('received: %s', message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  ws.send('Hi there, I am a WebSocket server');
});

app.get('/', (req, res) => res.send('You are being served by the server, not the dist/'));
app.get('/api/fire-event', (req, res) => {
  console.log('event receieved new');
  res.send('Event received!');
});

/**
 * NOTE: Super important that we listen from the http server NOT the express one!
 */
server.listen(port, () => {
  console.log(`Server started, listening on port ${port}`);
});
