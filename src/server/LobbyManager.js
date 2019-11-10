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

  createNewGame(forcedId) {
    const roomId = forcedId || randomRoomId();
    const newGame = new GameManager(roomId);
    this.games.push(newGame);
    return newGame;
  }

  // This is hack used in testing so that we can blow away games in development
  replaceExistingGame(roomId) {
    this.deleteGameById(roomId);
    return this.createNewGame(roomId);
  }

  deleteGameById(roomId) {
    this.games = this.games.filter(game => game.id === roomId);
  }

  addHostToGame(gameId, socket) {
    const game = this.getGameById(gameId);
    if (!game) return;
    game.addHostSocket(socket);
  }

  addPlayerToGame(gameId, playerName, socket) {
    const game = this.getGameById(gameId);
    if (!game) return false;
    return game.addPlayer(playerName, socket);
  }
};
