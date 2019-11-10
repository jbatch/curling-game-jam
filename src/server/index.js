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

app.use(express.static(FRONTEND_DIST_DIR));

webSocketServer.on('connection', ws => {
  console.log('New connection created');

  ws.on('client-new-game', (data, ack) => {
    console.log('New host is creating a room');
    if (data.roomId) {
      const game = lobbyManager.getGameById(data.roomId);
      if (!game) {
        console.error('Game not found: ', data.roomId);
      }
      game.addHostSocket(ws);
      ws.join(data.roomId);
      ack({ roomId: data.roomId });
      return;
    }
    const newGame = lobbyManager.createNewGame();
    newGame.addHostSocket(ws);
    const roomId = newGame.roomId;
    ack({ roomId });
    ws.join(roomId);
    console.log('New game: ', roomId);
    console.log(
      'games',
      lobbyManager.games.map(g => ({ id: g.roomId, players: g.players }))
    );
  });

  ws.on('client-player-join', (data, ack) => {
    const { roomId, playerName } = data;
    const success = lobbyManager.addPlayerToGame(roomId, playerName, ws);
    if (!success) {
      return ack({ success: false, error: `Unable to find room with id ${roomId}` });
    }
    console.log(`Player "${playerName}" joined game "${roomId}"`);
    ack({ success: true });
    ws.join(roomId);
    ws.to(roomId).emit('server-player-join', { playerName });
  });

  ws.on('client-player-move', data => {
    const { startX, startY, rotation, power } = data;
    console.log('player move event', data);
    ws.to(data.roomId).emit('server-player-move', data);
  });

  ws.send('Webserver welcomes you', { foo: 'bar' });
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
