'use strict';

import 'phaser';

import SceneManager from '../util/scene-manager';
import { EventManager } from '../util/event-manager';
import { StateManager, GameState } from '../util/state-manager';

export default class PlayerLobbyInputScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  private eventManager: EventManager;
  private stateManager: StateManager;
  private width: number;
  private height: number;

  constructor() {
    super({ key: 'PlayerLobbyInput', active: false, visible: false });
  }

  init() {}

  preload() {}

  create() {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.eventManager = EventManager.getInstance();
    this.stateManager = StateManager.getInstance();

    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;

    const titleStyle = { fontSize: '50px' };
    this.add.text(this.width * 0.5, 0, 'Player Lobby Input', titleStyle).setOrigin(0.5, 0);

    this.add.text(this.width * 0.2, this.height * 0.3, 'Room Id', { fontSize: '40px' });
    const roomIdInput = this.add
      .dom(
        this.width * 0.2,
        this.height * 0.37,
        'input',
        'background-color: lime; width: 220px; height: 50px; font: 48px Arial'
      )
      .setOrigin(0, 0);

    this.add.text(this.width * 0.2, this.height * 0.5, 'Player name', { fontSize: '40px' });
    const playerNameInput = this.add
      .dom(
        this.width * 0.2,
        this.height * 0.57,
        'input',
        'background-color: lime; width: 220px; height: 50px; font: 48px Arial',
        'JBatch'
      )
      .setOrigin(0, 0);

    const readyButton = this.add.dom(
      this.width * 0.5,
      this.height * 0.8,
      'button',
      'height: 50px; width: 100px; font-size: 28px; border-radius: 14px;',
      'Ready'
    );
    readyButton.node.addEventListener('click', () => {
      const playerName = (<HTMLInputElement>playerNameInput.node).value;
      const roomId = (<HTMLInputElement>roomIdInput.node).value;
      if (playerName && roomId) {
        this.eventManager.emit('client-player-join', { roomId, playerName });
        this.stateManager.state.setPlayerId(playerName);
        this.sceneManager.startPlayerLobby();
      }
    });

    // Hacked in for easier dev loop
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    const playerId = urlParams.get('playerName');
    if (roomId || playerId) {
      (<HTMLInputElement>playerNameInput.node).value = playerId || '';
      (<HTMLInputElement>roomIdInput.node).value = roomId || '';
      (<HTMLButtonElement>readyButton.node).click();
    }

    this.initEventHandlers();
  }

  initEventHandlers() {}

  update(time, delta) {}
}
