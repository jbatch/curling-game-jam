'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';

export default class StartScreenScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  constructor() {
    super({ key: 'StartScene', active: true, visible: true });
  }

  init() {}

  preload() {}

  create(data) {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.scene.setVisible(true);
    this.add.text(300, 300, 'START');

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || 'NONE';
    this.sceneManager.startSceneFromMode(mode);
  }

  update(time, delta) {}
}
