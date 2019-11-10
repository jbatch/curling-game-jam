'use strict';

import 'phaser';

import SceneManager from '../util/scene-manager';
import { EventManager } from '../util/event-manager';
import { StateManager, GameState } from '../util/state-manager';

export default class PlayerLobbyScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  private eventManager: EventManager;
  private stateManager: StateManager;
  private width: number;
  private height: number;
  private playerLabels: Phaser.GameObjects.Text[];

  constructor() {
    super({ key: 'PlayerLobby', active: false, visible: false });
  }

  init() {}

  preload() {}

  create() {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.eventManager = EventManager.getInstance();
    this.stateManager = StateManager.getInstance();

    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.playerLabels = [];

    this.add.text(this.width / 2, 0, 'Player Lobby', { fontSize: '50px' }).setOrigin(0.5, 0);

    this.initEventHandlers();
  }

  updatePlayerLabels(players) {
    for (var l of this.playerLabels) {
      l.destroy();
    }
    var yOffset = 0;
    for (var p of players) {
      this.add.text(this.width / 3, this.height / 3 + yOffset, p.id, { fontSize: '30px' });
      yOffset += 30;
    }
  }

  initEventHandlers() {
    this.eventManager.on('server-lobby-update', this.handleServerLobbyUpdate, this);
    this.eventManager.on('server-start-game', this.handleServerGameStart, this);
  }

  handleServerLobbyUpdate(data) {
    this.updatePlayerLabels(data.players);
  }

  handleServerGameStart(state: GameState) {
    console.log('handleServerGameStart');
    this.stateManager.state.setState(state);
    this.sceneManager.startPlayerGameScene();
  }

  update(time, delta) {}
}
