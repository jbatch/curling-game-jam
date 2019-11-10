'use strict';

import { EventManager } from './event-manager';

var instance: StateManager;

export class StateManager {
  eventManager: EventManager;
  state: State;

  constructor() {
    console.assert(instance === undefined, 'Trying to instantiate non-Singleton StateManager');
    this.eventManager = EventManager.getInstance();
    this.state = new State();

    this.eventManager.on('server-next-turn', this.handleServerNextTurn, this);
  }

  handleServerNextTurn(state: GameState) {
    this.state.setState(state);
    this.eventManager.emit('game-next-turn');
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new StateManager();
    }
    return instance;
  }
}
type PuckData = { id: string; x: number; y: number };
type PlayerData = { id: string; x: number; y: number; score: number };

// All data that is synced from the server
export type GameState = { pucks: PuckData[]; players: PlayerData[]; currentTurn?: string };

export class State {
  private serverState: GameState;
  private playerId: string;

  constructor() {}

  setPlayerId(playerId: string) {
    this.playerId = playerId;
  }

  getPlayerId(): string {
    return this.playerId;
  }

  setState(state: GameState) {
    this.serverState = { ...state };
  }

  getState(): GameState {
    return this.serverState;
  }

  getDataForPlayer(playerId: string) {
    console.log('finding ', playerId, ' in ', this.serverState.players);
    return this.serverState.players.find(p => p.id === playerId);
  }
}
