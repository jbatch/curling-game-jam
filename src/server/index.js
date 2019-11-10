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

app.use(express.static(FRONTEND_DIST_DIR));

webSocketServer.on('connection', ws => {
  console.log('New connection created', ws.id);

  ws.on('client-new-game', (data, ack) => {
    const game = data.roomId
      ? lobbyManager.replaceExistingGame(data.roomId)
      : lobbyManager.createNewGame();
    const roomId = game.roomId;
    console.log('Host is creating a new game', roomId);
    if (game.hostSocket) {
      console.error('Host attempted to join an existing game', roomId);
      ack({ success: false, error: 'Attempted to join an existing game' });
      return;
    }
    game.addHostSocket(ws);
    ws.join(roomId);
    ack({ success: true, roomId });

    console.log(
      'Current Games: ',
      lobbyManager.games.map(g => ({ id: g.roomId, players: g.players }))
    );
  });

  ws.on('client-player-join', (data, ack) => {
    const { roomId, playerName } = data;
    const success = lobbyManager.addPlayerToGame(roomId, playerName, ws);
    if (!success) {
      return ack({ success: false, error: `Unable join room ${roomId} with name ${playerName}` });
    }
    console.log(`Player "${playerName}" joined game "${roomId}"`);
    ack({ success: true });
    ws.join(roomId);
    ws.to(roomId).emit('server-player-join', { playerName });
  });

  ws.on('client-lobby-update', data => {
    // TODO: maybe update list of players?
    console.log('player lobby event', data);
    ws.to(data.roomId).emit('server-lobby-update', data);
  });

  ws.on('client-player-move', data => {
    console.log('player move event', data);
    ws.to(data.roomId).emit('server-player-move', data);
  });

  ws.on('client-start-game', data => {
    console.log('client-start-game event', data);
    ws.to(data.roomId).emit('server-start-game', data);
  });

  ws.on('client-next-turn', data => {
    console.log('client-next-turn event', data);
    ws.to(data.roomId).emit('server-next-turn', data);
  });

  ws.on('client-round-end', data => {
    console.log('client-round-end event', data);
    ws.to(data.roomId).emit('server-round-end', data);
  });

  ws.on('client-game-end', data => {
    console.log('client-game-end event', data);
    ws.to(data.roomId).emit('server-game-end', data);
  });

  ws.send('Connection to webserver successful, welcome');
});

app.get('/', (req, res) => res.send('You are being served by the server, not the dist/'));

/**
 * NOTE: Super important that we listen from the http server NOT the express one!
 */
const PORT = process.env.PORT || port;
const version = process.env.GAE_VERSION || 'unknown';
const listener = server.listen(PORT, () => {
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  console.log(`~ Server started, listening on port ${PORT} ~`);
  console.log(`~ Running version: ${version} ~`);
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
});
