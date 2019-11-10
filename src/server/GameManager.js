module.exports = class GameManager {
  constructor(id) {
    this.roomId = id;
    this.players = [];
    this.pucks = [];
    this.hostSocket = null;
  }

  addHostSocket(socket) {
    this.hostSocket = socket;
  }

  addPlayer(player) {
    if (this.players.length < 4) {
      if (!this.players.includes(player)) {
        this.players.push(player);
        return true;
      }
    }
    return false;
  }
};
