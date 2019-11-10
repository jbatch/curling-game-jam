'use strict';

import 'phaser';
import PlayerGameActiveScene from './js/scenes/player-game-active-scene';
import PlayerGameIdleScene from './js/scenes/player-game-idle-scene';
import PlayerLobbyInputScene from './js/scenes/player-lobby-input-scene';
import PlayerLobbyScene from './js/scenes/player-lobby-scene';
import HostGameScene from './js/scenes/host-game-scene';
import HostLobbyScene from './js/scenes/host-lobby-scene';
import StartSceenScene from './js/scenes/start-screen-scene';
import './assets/css/app.css';
import ConnectionManager from './js/util/connection-manager';

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  parent: 'main',
  scene: [
    StartSceenScene,
    HostGameScene,
    PlayerGameActiveScene,
    HostLobbyScene,
    PlayerLobbyInputScene,
    PlayerLobbyScene,
    PlayerGameIdleScene
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true
    }
  },
  dom: {
    createContainer: true
  }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig, mode: string) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'NONE';
  const game = new Game(config, mode);
  const connectionManager = ConnectionManager.getInstance();

  const newGameButton = document.getElementById('new-game');
  const joinGameButton = document.getElementById('join-game');
  newGameButton.addEventListener('click', () => {
    connectionManager.registerHost({});
  });
});

window['joinGame'] = function joinGame(id, player) {
  const connectionManager = ConnectionManager.getInstance();
  connectionManager.joinGame(id, player);
};
