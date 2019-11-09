'use strict';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
};

export default class Target extends Phaser.GameObjects.GameObject {
  private x;
  private y;
  constructor({ scene, x, y }: Props) {
    super(scene, 'target');
    this.x = x;
    this.y = y;

    const bullseye = this.scene.add.circle(this.x, this.y, 50, 0x993333);
  }
}
