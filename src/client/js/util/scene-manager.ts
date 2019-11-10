'use strict';

import 'phaser';
import { GameState, StateManager } from './state-manager';

var instance: SceneManager;

export default class SceneManager {
  scenePlugin: Phaser.Scenes.ScenePlugin;

  constructor(scenePlugin: Phaser.Scenes.ScenePlugin) {
    console.assert(instance === undefined, 'Trying to instantiate non-Singleton SceneManager');
    this.scenePlugin = scenePlugin;
  }

  startSceneFromMode(mode) {
    switch (mode) {
      case 'NONE':
        break;
      case 'PLAYER':
        this.scenePlugin.start('PlayerLobbyInput');
        break;
      case 'HOST':
        this.scenePlugin.start('HostLobby');
        break;
    }
  }

  startHostGameScene(state: GameState) {
    this.scenePlugin.start('HostGame', state);
    this.scenePlugin.stop('HostLobby');
  }

  startPlayerLobby() {
    this.scenePlugin.start('PlayerLobby');
    this.scenePlugin.stop('PlayerLobbyInput');
  }

  startPlayerGameScene() {
    var state = StateManager.getInstance().state;
    if (state.getPlayerId() === state.getState().currentTurn) {
      this.scenePlugin.start('PlayerGame');
    } else {
      this.scenePlugin.start('PlayerIdle');
    }
    this.scenePlugin.stop('PlayerLobby');
  }

  static getInstance(scenePlugin: Phaser.Scenes.ScenePlugin) {
    if (instance === undefined) {
      instance = new SceneManager(scenePlugin);
    }
    return instance;
  }
}
