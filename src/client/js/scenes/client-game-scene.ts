'use strict';

import 'phaser';
import Puck from '../game-objects/puck';
import Target from '../game-objects/tartget';
import ConnectionManager from '../util/connection-manager';
import SceneManager from '../util/scene-manager';

export default class ClientGameScene extends Phaser.Scene {
  private connectionManager: ConnectionManager;
  private sceneManager: SceneManager;
  private puck: Puck;
  private targets: Target[];
  private width: number;
  private height: number;

  constructor() {
    super({ key: 'PlayerScene', active: false, visible: false });
  }

  init() {}

  preload() {
    this.load.image('puck', './media/puck.png');
    this.load.image('background', './media/background2.png');
  }

  create() {
    this.connectionManager = ConnectionManager.getInstance();
    this.sceneManager = SceneManager.getInstance(this.scene);

    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.puck = new Puck({
      scene: this,
      x: this.width,
      y: this.height,
      texture: 'puck'
    });
    this.cameras.main.startFollow(this.puck);
    this.add.tileSprite(0, 0, this.width, this.height, 'background').setDisplayOrigin(0);
    const target = new Target({ scene: this, x: this.width / 2, y: this.height / 2 });
    // this.targets.push(target);
  }

  update(time, delta) {
    this.puck.body.velocity.multiply(new Phaser.Math.Vector2({ x: 0.99, y: 0.99 }));
    if (this.puck.body.velocity.length() < 20) {
      this.puck.body.velocity.set(0, 0);
    }
  }
}
