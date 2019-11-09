'use strict';

import 'phaser';
import ClientGameScene from './js/scenes/client-game-scene';
import HostGameScene from './js/scenes/host-game-scene';
import StartSceenScene from './js/scenes/start-screen-scene';
import './assets/css/app.css';

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  parent: 'main',
  scene: [StartSceenScene, HostGameScene, ClientGameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true
    }
  }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig, mode: string) {
    super(config);
    switch (mode) {
      case 'NONE':
        // this.scene.bringToTop('StartScene');
        // this.scene.resume('StartScene');
        break;
      case 'PLAYER':
        // this.scene.bringToTop('PlayerScene');
        // this.scene.resume('PlayerScene');
        break;
      case 'HOST':
        // this.scene.bringToTop('HostScene');
        // this.scene.resume('HostScene');
        break;
    }
  }
}

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'NONE';
  const game = new Game(config, mode);
});
