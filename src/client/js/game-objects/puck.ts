'use strict';

import 'phaser';
import { EventManager } from '../util/event-manager';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  frame?: string | integer;
};

export default class Puck extends Phaser.Physics.Arcade.Image {
  public body!: Phaser.Physics.Arcade.Body;
  private trajectoryLine: Phaser.GameObjects.Line;
  private startX: number;
  private startY: number;
  private eventManager: EventManager;

  constructor({ scene, x, y, texture, frame }: Props) {
    super(scene, x, y, texture, frame);
    this.eventManager = EventManager.getInstance();
    this.setDisplayOrigin(0.5);
    this.setOrigin(0.5);
    this.setDepth(2);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setBounce(1, 1);
    this.body.setCollideWorldBounds(true);
    this.body.setCircle(30);
    this.body.useDamping = true;
    this.body.setDrag(0.99, 0.99);

    this.scene.input.on('pointerdown', this.startLauch, this);
    this.eventManager.emit('game-new-puck', this);
  }

  startLauch(e: Phaser.Input.Pointer) {
    this.startX = e.x;
    this.startY = e.y;
    this.drawLine(this.x, this.y, this.x + (e.x - this.startX), this.y + (e.y - this.startY));

    this.scene.input.removeListener('pointerdown', this.startLauch, this);
    this.scene.input.addListener('pointermove', this.chargeLaunch, this);
    this.scene.input.on('pointerup', this.releaseLaunch, this);
  }

  drawLine(x1, y1, x2, y2) {
    this.trajectoryLine = this.scene.add
      .line(0, 0, x1, y1, x2, y2, 0xff0000, 1.0)
      .setOrigin(0, 0)
      .setDepth(3);
  }

  chargeLaunch(e) {
    this.trajectoryLine.destroy();
    this.drawLine(this.x, this.y, this.x + (e.x - this.startX), this.y + (e.y - this.startY));
  }

  releaseLaunch(e) {
    this.trajectoryLine.destroy();
    this.scene.input.removeListener('pointermove', this.chargeLaunch);
    this.scene.input.removeListener('pointerup', this.releaseLaunch);
    this.scene.input.on('pointerdown', this.startLauch, this);
    const lineLength = Phaser.Math.Distance.Between(e.x, e.y, this.startX, this.startY);
    const rotation = Phaser.Math.Angle.BetweenPoints(
      { x: e.x, y: e.y },
      { x: this.startX, y: this.startY }
    );
    this.launch(rotation, lineLength * 2);
  }

  launch(rotation, power) {
    this.scene.physics.velocityFromRotation(
      rotation,
      power,
      (this.body as Phaser.Physics.Arcade.Body).velocity
    );
    this.eventManager.emit('client-player-move', {
      startX: this.x,
      startY: this.y,
      rotation,
      power
    });
  }

  update() {}
}
