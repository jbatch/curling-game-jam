'use strict';

import 'phaser';
import Puck from '../game-objects/puck';
import Target from '../game-objects/tartget';
import ConnectionManager from '../util/connection-manager';
import SceneManager from '../util/scene-manager';
import { EventManager } from '../util/event-manager';

export default class ClientGameScene extends Phaser.Scene {
  private connectionManager: ConnectionManager;
  private sceneManager: SceneManager;
  private eventManager: EventManager;
  private pucks: Puck[];
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
    this.eventManager = EventManager.getInstance();

    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.pucks = [];
    const puck = new Puck({
      scene: this,
      x: this.width,
      y: this.height,
      texture: 'puck'
    });
    this.cameras.main.startFollow(puck);
    this.pucks.push(puck);
    this.add.tileSprite(0, 0, this.width, this.height, 'background').setDisplayOrigin(0);
    const target = new Target({ scene: this, x: this.width / 2, y: this.height / 2 });

    // Hacked in for easier dev loop
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    if (roomId) {
      this.eventManager.emit('client-player-join', { roomId: roomId, playerName: 'default' });
    }
  }

  update(time, delta) {}
}
