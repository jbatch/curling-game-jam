const express = require('express');
const io = require('socket.io');
const http = require('http');
const path = require('path');
const LobbyManager = require('./LobbyManager');

const port = 3000;
const FRONTEND_DIST_DIR = 'dist/client';

const app = express();
const server = http.createServer(app);
const webSocketServer = io(server);

const lobbyManager = new LobbyManager();
const defaultGame = lobbyManager.getGameById('ZZZZ');
console.log(defaultGame);

app.use(express.static(FRONTEND_DIST_DIR));

webSocketServer.on('connection', ws => {
  console.log('New connection created');

  ws.on('new-host', (data, ack) => {
    console.log('New host is creating a room');
    const newGame = lobbyManager.createNewGame();
    newGame.addHostSocket(ws);
    const roomId = newGame.roomId;
    ack({ roomId });
    console.log('New game: ', roomId);
    console.log('games', lobbyManager.games);
  });

  ws.on('add-player', (data, ack) => {
    const { roomId, playerName } = data;
    const success = lobbyManager.addPlayerToGame(roomId, playerName, ws);
    if (!success) {
      return ack({ error: `Unable to find room with id ${roomId}` });
    }
    ack({ msg: 'nice' });
  });

  ws.send('Webserver welcomes you');
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
