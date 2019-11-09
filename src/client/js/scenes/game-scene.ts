'use strict';

import 'phaser';
import Puck from '../game-objects/puck';

export default class GameScene extends Phaser.Scene {
  
  private puck: Phaser.GameObjects.Image;
  

  constructor() {
    super('GameScene');
  }

  init() {}

  preload() {
    this.load.image('puck', './media/puck.png');
  }

  create() {
    this.puck = new Puck({scene: this, x: 500, y: 550, texture: 'puck'});
  }

  

  update(time, delta) {
    (this.puck.body as Phaser.Physics.Arcade.Body).velocity.multiply(new Phaser.Math.Vector2({x: 0.99, y: 0.99}));
  }
}
