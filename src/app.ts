'use strict';

import 'phaser';
import GameScene from './client/js/scenes/game-scene';
import './client/assets/css/app.css';

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  // width: 960,
  // height: 640,
  width: 960,
  height: 2000,
  parent: 'main',
  scene: [GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
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
});
