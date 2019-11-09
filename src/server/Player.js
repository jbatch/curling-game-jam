module.exports = class Player {
  constructor(name, socket) {
    this.name = name;
    this.socket = socket;
    this.score = 0;
  }
};
