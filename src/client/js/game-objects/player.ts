import { StateManager } from '../util/state-manager';
'use strict';

type Props = {
  scene: Phaser.Scene;
};

export default class Player extends Phaser.GameObjects.GameObject {
  x: number;
  y: number;
  playerId: string;
  private circle: Phaser.GameObjects.Arc;
  constructor({ scene }: Props) {
    super(scene, 'player');
    this.x = (scene.game.config.width as number) / 2;
    this.y = (scene.game.config.height as number) / 2;
    this.playerId = StateManager.getInstance().state.getPlayerId();

    this.circle = this.scene.add
      .circle(this.x, this.y, 50, 0x993333)
      .setOrigin(0.5, 0.5)
      .setAlpha(0.5);
  }

  setPosition(x: number, y: number) {
    this.circle.setX(x).setY(y);
    this.x = x;
    this.y = y;
  }
}
