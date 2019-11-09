'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';

export default class HostGameScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  constructor() {
    super({ key: 'HostScene', active: false, visible: false });
  }

  init() {}

  preload() {}

  create(data) {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.add.text(300, 300, 'HOSTING');
  }

  update(time, delta) {}
}
