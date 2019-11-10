'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';
import { EventManager } from '../util/event-manager';
import { GameState, StateManager } from '../util/state-manager';

export default class PlayerGameIdleScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  private eventManager: EventManager;
  private stateManager: StateManager;
  private width: number;
  private height: number;

  constructor() {
    super({ key: 'PlayerIdle', active: false, visible: false });
  }

  init() {}

  preload() {}

  create(data) {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.eventManager = EventManager.getInstance();
    this.stateManager = StateManager.getInstance();
    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;

    this.add.text(
      this.width / 4,
      this.height / 2,
      `Waiting for ${this.stateManager.state.getState().currentTurn}`,
      { fontSize: '50px' }
    );

    this.initEventHandling();
  }

  initEventHandling() {
    // this.eventManager.on('server-player-join', this.handleServerPlayerJoin, this);
  }

  update(time, delta) {}
}
