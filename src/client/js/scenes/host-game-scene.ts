'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';
import Target from '../game-objects/tartget';
import Puck from '../game-objects/puck';
import RoomIndicator from '../game-objects/room-indicator';

export default class HostGameScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  private width: number;
  private height: number;
  constructor() {
    super({ key: 'HostScene', active: false, visible: false });
  }

  init() {}

  preload() {
    this.load.image('background', './media/background2.png');
  }

  create(data) {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;

    this.add.tileSprite(0, 0, this.width, this.height, 'background').setDisplayOrigin(0);
    const target = new Target({ scene: this, x: this.width / 2, y: this.height / 2 });
    new RoomIndicator({ scene: this, roomId: 'ZZZZ' });
  }

  update(time, delta) {}
}
