'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';
import { EventManager } from '../util/event-manager';
import { GameState } from '../util/state-manager';

export default class HostLobbyScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  private eventManager: EventManager;
  private width: number;
  private height: number;
  private availableStartingPositions: { x: number; y: number }[];
  private state: GameState;
  private playerLabels: Phaser.GameObjects.Text[];

  constructor() {
    super({ key: 'HostLobby', active: false, visible: false });
  }

  init() {}

  preload() {}

  create(data) {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.eventManager = EventManager.getInstance();
    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.availableStartingPositions = [
      { x: 0, y: 0 },
      { x: this.width, y: 0 },
      { x: this.width, y: this.height },
      { x: 0, y: this.height }
    ];
    this.state = { pucks: [], players: [], currentTurn: undefined };
    this.playerLabels = [];

    this.add.text(this.width / 2, 0, 'Host Lobby', { fontSize: '50px' }).setOrigin(0.5, 0);

    // Hacked in for easier dev loop
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    if (roomId) {
      this.eventManager.emit('client-new-game', { roomId: roomId }, resp => {
        console.log('Server response: ', resp);
        // this.roomId = resp.roomId;
      });
    }

    this.initEventHandling();
  }

  updatePlayerLabels() {
    for (var l of this.playerLabels) {
      l.destroy();
    }
    var yOffset = 0;
    for (var p of this.state.players) {
      this.add.text(this.width / 3, this.height / 3 + yOffset, p.id, { fontSize: '30px' });
      yOffset += 30;
    }
  }

  initEventHandling() {
    this.eventManager.on('server-player-join', this.handleServerPlayerJoin, this);
  }

  handleServerPlayerJoin(data) {
    console.log('HOST LOBBY: handleServerPlayerJoin ', data);
    const startingPosition = this.availableStartingPositions.splice(0, 1)[0];
    const player = { id: data.playerName, x: startingPosition.x, y: startingPosition.y, score: 0 };
    this.state.players.push(player);
    if (this.state.currentTurn === undefined) {
      this.state.currentTurn = player.id;
    }
    this.updatePlayerLabels();
    this.eventManager.emit('client-lobby-update', { ...this.state });
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SPACE'))) {
      console.log('SPACEBAR');
      this.eventManager.emit('client-start-game', {
        pucks: this.state.pucks,
        players: this.state.players,
        currentTurn: this.state.currentTurn
      });
      this.sceneManager.startHostGameScene(this.state);
    }
  }
}
