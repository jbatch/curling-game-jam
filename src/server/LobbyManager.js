const GameManager = require('./GameManager');

function randomRoomId() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const newId = new Array(4).fill().map(() => letters[Math.floor(Math.random() * letters.length)]);
  return newId.join('');
}

module.exports = class LobbyManager {
  constructor() {
    this.games = [];
    const defaultGame = new GameManager('ZZZZ');
    this.games.push(defaultGame);
  }

  getGameById(id) {
    const game = this.games.find(g => g.roomId === id);
    return game;
  }

  createNewGame() {
    const roomId = randomRoomId();
    const newGame = new GameManager(roomId);
    this.games.push(newGame);
    return newGame;
  }

  addHostToGame(gameId, socket) {
    const game = this.getGameById(gameId);
    if (!game) return;
    game.addHostSocket(socket);
  }

  addPlayerToGame(gameId, playerName, socket) {
    const game = this.getGameById(gameId);
    if (!game) return false;
    game.addPlayer(playerName, socket);
    return true;
  }
};
