'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';
import Target from '../game-objects/tartget';
import Puck from '../game-objects/puck';
import RoomIndicator from '../game-objects/room-indicator';
import { EventManager } from '../util/event-manager';

export default class HostGameScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  private eventManager: EventManager;
  private width: number;
  private height: number;
  private pucks: Puck[];
  constructor() {
    super({ key: 'HostScene', active: false, visible: false });
  }

  init() {}

  preload() {
    this.load.image('puck', './media/puck.png');
    this.load.image('background', './media/background2.png');
  }

  create(data) {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.eventManager = EventManager.getInstance();
    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.pucks = [];

    this.add.tileSprite(0, 0, this.width, this.height, 'background').setDisplayOrigin(0);
    const target = new Target({ scene: this, x: this.width / 2, y: this.height / 2 });
    new RoomIndicator({ scene: this, roomId: 'ZZZZ' });

    this.initEventHandling();
  }

  initEventHandling() {
    this.eventManager.on('playerMove', this.handlePlayerMove, this);
  }

  handlePlayerMove({ startX, startY, rotation, power }) {
    const puck = new Puck({ scene: this, x: startX, y: startY, texture: 'puck' });
    puck.launch(rotation, power);
    this.pucks.push(puck);
  }

  update(time, delta) {
    for (var p of this.pucks) {
      p.update();
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('S'))) {
      this.eventManager.emit('playerMove', {
        startX: this.width,
        startY: this.height,
        rotation: 2.6,
        power: 350
      });
    }
  }
}
