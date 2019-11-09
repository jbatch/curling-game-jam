'use strict';

type Props = {
  scene: Phaser.Scene;
  roomId: string;
};

export default class RoomIndicator extends Phaser.GameObjects.GameObject {
  x: number;
  y: number;
  constructor({ scene, roomId }: Props) {
    super(scene, 'roomIndicator');
    this.x = (scene.game.config.width as number) / 2;
    this.y = 0;

    const box = this.scene.add
      .rectangle(this.x, this.y, 200, 75, 0x993333)
      .setOrigin(0.5, 0)
      .setAlpha(0.5);
    const text = this.scene.add
      .text(box.x, box.y + box.height / 2, `ROOM: ${roomId}`, { fontSize: '30px' })
      .setOrigin(0.5);
  }
}
