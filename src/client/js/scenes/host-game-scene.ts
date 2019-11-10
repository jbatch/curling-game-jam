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

    // Hacked in for easier dev loop
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    if (roomId) {
      this.eventManager.emit('client-new-game', { roomId: roomId }, resp => {
        console.log('Server response: ', resp);
        // this.roomId = resp.roomId;
      });
    }

    this.add.tileSprite(0, 0, this.width, this.height, 'background').setDisplayOrigin(0);
    const target = new Target({ scene: this, x: this.width / 2, y: this.height / 2 });
    new RoomIndicator({ scene: this, roomId: 'ZZZZ' });

    this.initEventHandling();
  }

  handleNewPuckEvent(puck: Puck) {
    for (var p of this.pucks) {
      this.physics.add.collider(puck, p);
    }
    this.pucks.push(puck);
  }

  initEventHandling() {
    this.eventManager.on('server-player-move', this.handlePlayerMove, this);
    this.eventManager.on('game-new-puck', this.handleNewPuckEvent, this);
  }

  handlePlayerMove({ startX, startY, rotation, power }) {
    console.log('host scene git server-player-move');
    const puck = new Puck({ scene: this, x: startX, y: startY, texture: 'puck' });
    puck.launch(rotation, power);
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('Q'))) {
      this.eventManager.emit('server-player-move', {
        startX: this.width,
        startY: this.height,
        rotation: 2.6,
        power: 350
      });
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('W'))) {
      this.eventManager.emit('server-player-move', {
        startX: 0,
        startY: 0,
        rotation: -0.6,
        power: 350
      });
    }
  }
}
