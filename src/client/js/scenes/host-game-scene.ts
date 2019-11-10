'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';
import Target from '../game-objects/tartget';
import Puck from '../game-objects/puck';
import RoomIndicator from '../game-objects/room-indicator';
import { EventManager } from '../util/event-manager';
import { GameState } from '../util/state-manager';

export default class HostGameScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  private eventManager: EventManager;
  private width: number;
  private height: number;
  private pucks: Puck[];
  private availableStartingPositions: { x: number; y: number }[];
  private state: GameState;

  constructor() {
    super({ key: 'HostGame', active: false, visible: false });
  }

  init() {}

  preload() {
    this.load.image('puck', './media/puck.png');
    this.load.image('background', './media/background2.png');
  }

  create(state: GameState) {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.eventManager = EventManager.getInstance();
    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.pucks = [];
    this.availableStartingPositions = [
      { x: 0, y: 0 },
      { x: this.width, y: 0 },
      { x: this.width, y: this.height },
      { x: 0, y: this.height }
    ];
    this.state = state;

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
    this.eventManager.on('server-player-move', this.handleServerPlayerMove, this);
    this.eventManager.on('game-new-puck', this.handleNewPuckEvent, this);
  }

  handleServerPlayerMove({ startX, startY, rotation, power }) {
    console.log('host scene got server-player-move');
    const puck = new Puck({ scene: this, x: startX, y: startY, texture: 'puck', active: false });
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
