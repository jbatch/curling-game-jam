'use strict';

import 'phaser';

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
        this.scenePlugin.start('PlayerScene');
        break;
      case 'HOST':
        this.scenePlugin.start('HostScene');
        break;
    }
  }

  static getInstance(scenePlugin: Phaser.Scenes.ScenePlugin) {
    if (instance === undefined) {
      instance = new SceneManager(scenePlugin);
    }
    return instance;
  }
}
