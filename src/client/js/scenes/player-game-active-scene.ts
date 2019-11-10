'use strict';

import 'phaser';
import Puck from '../game-objects/puck';
import Target from '../game-objects/tartget';
import SceneManager from '../util/scene-manager';
import { EventManager } from '../util/event-manager';
import { StateManager, GameState } from '../util/state-manager';
import Player from '../game-objects/player';

export default class PlayerGameActiveScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  private eventManager: EventManager;
  private stateManager: StateManager;
  private pucks: Puck[];
  private width: number;
  private height: number;
  private player: Player;
  private puck: Puck;

  constructor() {
    super({ key: 'PlayerGame', active: false, visible: false });
  }

  init() {}

  preload() {
    this.load.image('puck', './media/puck.png');
    this.load.image('background', './media/background2.png');
  }

  create() {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.eventManager = EventManager.getInstance();
    this.stateManager = StateManager.getInstance();

    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.player = new Player({ scene: this });
    this.pucks = [];

    const playerState = this.stateManager.state.getDataForPlayer(this.player.playerId);
    console.log(playerState);
    this.cameras.main.startFollow(this.player, true, 0.01, 0.01);
    this.player.setPosition(playerState.x, playerState.y);

    this.add.tileSprite(0, 0, this.width, this.height, 'background').setDisplayOrigin(0);
    const target = new Target({ scene: this, x: this.width / 2, y: this.height / 2 });

    this.initMapState();
    this.initEventHandlers();

    // Create puck for player to launch
    this.puck = new Puck({
      scene: this,
      x: this.player.x,
      y: this.player.y,
      texture: 'puck',
      active: true
    });
  }

  initMapState() {
    for (var puckObj of this.stateManager.state.getState().pucks) {
      var puck = new Puck({
        scene: this,
        x: puckObj.x,
        y: puckObj.y,
        texture: 'puck',
        active: false
      });
    }
  }

  initEventHandlers() {
    this.eventManager.on('game-player-move', ({ startX, startY, rotation, power }) => {
      this.cameras.main.startFollow(this.puck);
      this.eventManager.emit('client-player-move', { startX, startY, rotation, power });
    });
    this.eventManager.on('game-new-puck', this.handleNewPuckEvent, this);
    this.eventManager.on('game-next-turn', this.handleGameNextTurn, this);
  }

  handleGameStateSync() {
    const playerId = this.stateManager.state.getPlayerId();
    const newState = this.stateManager.state;
    this.player.setPosition(
      newState.getDataForPlayer(playerId).x,
      newState.getDataForPlayer(playerId).y
    );
  }

  handleNewPuckEvent(puck: Puck) {
    for (var p of this.pucks) {
      this.physics.add.collider(puck, p);
    }
    this.pucks.push(puck);
  }

  handleGameNextTurn() {
    console.log('handling nextTurn');
    const state = this.stateManager.state;
    this.scene.stop('PlayerGame');
    if (state.getPlayerId() === state.getState().currentTurn) {
      this.scene.start('PlayerGame');
    } else {
      this.scene.start('PlayerIdle');
    }
  }

  update(time, delta) {}
}
