'use strict';

const socketIO = require('socket.io-client');
import { EventManager } from './event-manager';

var instance: ConnectionManager;

export default class ConnectionManager {
  socket: SocketIOClient.Socket;
  eventManager: EventManager;
  roomId: string;

  constructor() {
    console.assert(instance === undefined, 'Trying to instantiate non-Singleton ConnectionManager');
    this.socket = socketIO({});
    this.eventManager = EventManager.getInstance();

    this.socket.on('connect', () => {
      console.log(`Connected. ID: ${this.socket.id}`);

      this.socket.on('message', function(msg) {
        console.log('Message from server: ', msg);
      });
    });

    this.eventManager.on('client-player-move', data => {
      this.socket.emit('client-player-move', { ...data, roomId: this.roomId });
    });
    this.eventManager.on('client-start-game', data => {
      this.socket.emit('client-start-game', { ...data, roomId: this.roomId });
    });
    this.eventManager.on('client-lobby-update', data => {
      this.socket.emit('client-lobby-update', { ...data, roomId: this.roomId });
    });

    this.eventManager.on('client-new-game', this.handleClientNewGame, this);
    this.eventManager.on('client-player-join', this.handleClientPlayerJoin, this);
  }

  handleClientNewGame(data) {
    this.registerHost(data);
  }

  handleClientPlayerJoin(data) {
    this.joinGame(data.roomId, data.playerName);
  }

  registerHost(data) {
    console.log('Registring as host...');
    this.socket.emit('client-new-game', { ...data }, resp => {
      if (!resp.success) {
        console.error('Unable to join as host', resp);
        return;
      }
      console.log('Successfully joined room as host', resp.roomId);
      this.roomId = resp.roomId;
    });

    this.socket.on('server-player-join', data => {
      this.eventManager.emit('server-player-join', data);
      console.log(`HOST: player joined!`, data);
    });
    this.socket.on('server-player-move', data => {
      this.eventManager.emit('server-player-move', data);
      console.log('Client sent server-player-move');
    });
  }

  joinGame(roomId, playerName) {
    console.log(`Joining room "${roomId}" as "${playerName}"`);

    this.socket.emit('client-player-join', { roomId, playerName }, resp => {
      console.log('Server response: ', resp);
      this.roomId = roomId;
    });
    this.socket.on('server-player-join', data => {
      this.eventManager.emit('server-player-join', data);
      console.log(`PLAYER: player joined!`, data);
    });
    this.socket.on('server-lobby-update', data => {
      this.eventManager.emit('server-lobby-update', data);
      console.log(`PLAYER: Lobby update!`, data);
    });
    this.socket.on('server-start-game', data => {
      this.eventManager.emit('server-start-game', data);
      console.log(`PLAYER: Starting game!`, data);
    });
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new ConnectionManager();
    }
    return instance;
  }
}
