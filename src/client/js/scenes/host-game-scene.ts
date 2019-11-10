'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';
import Target from '../game-objects/tartget';
import Puck from '../game-objects/puck';
import RoomIndicator from '../game-objects/room-indicator';
import { EventManager } from '../util/event-manager';
import { GameState } from '../util/state-manager';
import Player from '../game-objects/player';

export default class HostGameScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  private eventManager: EventManager;
  private width: number;
  private height: number;
  private pucks: Puck[];
  private state: GameState;
  private waitingFor: string; // PLAYER_ACTION, ROUND_END

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
    this.state = state;
    this.waitingFor = 'PLAYER_ACTION';

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
    const puck = new Puck({ scene: this, x: startX, y: startY, texture: 'puck', active: false });
  ]    puck.launch(rotation, power);
    setTimeout(() => (this.waitingFor = 'ROUND_END'), 500);
  }

  nextTurn() {
    console.log('HOST: next players turn');
    const pucks = this.pucks.map(puck => ({ id: '???', x: puck.x, y: puck.y }));
    const playerIds = this.state.players.map(p => p.id);
    const index = playerIds.indexOf(this.state.currentTurn);
    if (index === playerIds.length - 1) {
      /// END ROUND
      console.log('SHOULD END ROUND');
      return;
    }
    const newCurrentTurn = playerIds[index + 1];
    this.state = {
      pucks,
      players: this.state.players,
      currentTurn: newCurrentTurn
    };
    this.eventManager.emit('client-next-turn', this.state);
  }

  update(time, delta) {
    if (this.waitingFor === 'ROUND_END') {
      let roundEnded = true;
      for (var p of this.pucks) {
        console.log('speed: ', p.body.velocity.length());
        if (p.body.velocity.length() > 5) {
          roundEnded = false;
        }
      }
      if (roundEnded) {
        this.waitingFor = 'PLAYER_ACTION';
        this.nextTurn();
      }
    }
  }
}
