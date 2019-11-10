module.exports = class GameManager {
  constructor(id) {
    this.roomId = id;
    this.players = [];
    this.hostSocket = null;
  }

  addHostSocket(socket) {
    this.hostSocket = socket;
  }

  addPlayer(player) {
    this.players.push(player);
  }
};
