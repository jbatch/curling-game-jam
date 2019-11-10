'use strict';

import 'phaser';
import Puck from '../game-objects/puck';
import Target from '../game-objects/tartget';
import ConnectionManager from '../util/connection-manager';
import SceneManager from '../util/scene-manager';
import { EventManager } from '../util/event-manager';
import { StateManager, GameState } from '../util/state-manager';
import Player from '../game-objects/player';

export default class PlayerGameScene extends Phaser.Scene {
  private connectionManager: ConnectionManager;
  private sceneManager: SceneManager;
  private eventManager: EventManager;
  private stateManager: StateManager;
  private pucks: Puck[];
  private width: number;
  private height: number;
  private player: Player;

  constructor() {
    super({ key: 'PlayerGame', active: false, visible: false });
  }

  init() {}

  preload() {
    this.load.image('puck', './media/puck.png');
    this.load.image('background', './media/background2.png');
  }

  create({ state, playerId }: { state: GameState; playerId: string }) {
    this.connectionManager = ConnectionManager.getInstance();
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.eventManager = EventManager.getInstance();
    this.stateManager = StateManager.getInstance();

    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.pucks = [];
    this.player = new Player({ scene: this });

    this.cameras.main.startFollow(this.player, true, 0.01, 0.01);

    this.add.tileSprite(0, 0, this.width, this.height, 'background').setDisplayOrigin(0);
    const target = new Target({ scene: this, x: this.width / 2, y: this.height / 2 });

    this.initEventHandlers();
  }

  initEventHandlers() {
    this.eventManager.on('game-start-turn', this.handleGameStartTurn, this);
    this.eventManager.emit('game-player-move', ({ startX, startY, rotation, power }) => {
      this.eventManager.emit('client-player-move', { startX, startY, rotation, power });
    });
  }

  handleGameStateSync() {
    const playerId = this.stateManager.state.getPlayerId();
    const newState = this.stateManager.state;
    this.player.setPosition(
      newState.getDataForPlayer(playerId).x,
      newState.getDataForPlayer(playerId).y
    );
  }

  handleGameStartTurn() {
    const puck = new Puck({ scene: this, x: this.player.x, y: this.player.y, texture: 'puck' });
  }

  update(time, delta) {}
}
