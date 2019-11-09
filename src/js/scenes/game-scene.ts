'use strict';

import 'phaser';

export default class GameScene extends Phaser.Scene {
  private trajectoryGraphics;
  private puck: Phaser.GameObjects.Image;
  private trajectoryLine: Phaser.GameObjects.Line;
  private startX;
  private startY;

  constructor() {
    super('GameScene');
  }

  init() {}

  preload() {
    this.load.image('puck', './media/puck.png');
  }

  create() {
    this.puck = this.add.image(500, 550, 'puck');
    this.puck.setDisplayOrigin(0.5);
    this.puck.setOrigin(0.5);
    this.physics.add.existing(this.puck);
    const body = this.puck.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setAllowDrag(true);
    body.setBounce(1,1);
    body.setCollideWorldBounds(true);
    this.input.on('pointerdown', this.startLauch, this);
  }

  startLauch(e: Phaser.Input.Pointer) {
    this.startX = e.x;
    this.startY = e.y;
    this.trajectoryLine = this.add
      .line(
        0,
        0,
        this.puck.x,
        this.puck.y,
        this.puck.x + (e.x - this.startX),
        this.puck.y + (e.y - this.startY),
        0xff0000,
        1.0
      )
      .setOrigin(0, 0);

    this.input.removeListener('pointerdown', this.startLauch, this);
    this.input.addListener('pointermove', this.chargeLaunch, this);
    this.input.on('pointerup', this.releaseLaunch, this);
  }

  chargeLaunch(e) {
    this.trajectoryLine.destroy();
    this.trajectoryLine = this.add
      .line(
        0,
        0,
        this.puck.x,
        this.puck.y,
        this.puck.x + (e.x - this.startX),
        this.puck.y + (e.y - this.startY),
        0xff0000,
        1.0
      )
      .setOrigin(0, 0);
  }

  releaseLaunch(e) {
    this.trajectoryLine.destroy();
    this.input.removeListener('pointermove', this.chargeLaunch);
    this.input.removeListener('pointerup', this.releaseLaunch);
    this.input.on('pointerdown', this.startLauch, this);
    const lineLength = Phaser.Math.Distance.Between(e.x, e.y, this.startX, this.startY);
    const rotation = Phaser.Math.Angle.BetweenPoints(
      { x: e.x, y: e.y },
      { x: this.startX, y: this.startY },
    );
    this.physics.velocityFromRotation(
      rotation,
      lineLength * 2,
      (this.puck.body as Phaser.Physics.Arcade.Body).velocity
    );
  }

  update(time, delta) {
    (this.puck.body as Phaser.Physics.Arcade.Body).velocity.multiply(new Phaser.Math.Vector2({x: 0.99, y: 0.99}));
  }
}
