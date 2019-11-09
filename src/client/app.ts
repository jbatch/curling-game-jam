// 'use strict';

import 'phaser';
import GameScene from './js/scenes/game-scene';
import './assets/css/app.css';
import ConnectionManager from './js/util/connection-manager';

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  parent: 'main',
  scene: [GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true
    }
  }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const game = new Game(config);
  const connectionManager = ConnectionManager.getInstance();

  const newGameButton = document.getElementById('new-game');
  const joinGameButton = document.getElementById('join-game');
  newGameButton.addEventListener('click', () => {
    connectionManager.registerHost();
  });
});

window.joinGame = function joinGame(id, player) {
  const connectionManager = ConnectionManager.getInstance();
  connectionManager.joinGame(id, player);
};
