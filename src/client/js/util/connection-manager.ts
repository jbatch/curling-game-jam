'use strict';

const socketIO = require('socket.io-client');
import { EventManager } from './event-manager';

var instance: ConnectionManager;

export default class ConnectionManager {
  socket: SocketIOClient.Socket;
  eventManager: EventManager;

  constructor() {
    console.assert(instance === undefined, 'Trying to instantiate non-Singleton ConnectionManager');
    this.socket = socketIO({ transports: ['websocket'] });
    this.eventManager = EventManager.getInstance();

    this.socket.on('connect', () => {
      console.log(`Connected. ID: ${this.socket.id}`);

      this.socket.on('message', function(msg) {
        console.log('Message from server: ', msg);
      });
    });

    this.eventManager.on('client-player-move', data => {
      this.socket.emit('client-player-move', data);
    });
  }

  registerHost() {
    console.log('Registring as host...');
    this.socket.emit('client-new-game', { data: 'i am the host now' }, resp => {
      console.log('Server response: ', resp);
    });
    this.socket.on('server-player-join', data => {
      this.eventManager.emit('server-player-join', data);
      console.log(`As host: player joined!`, data);
    });
    this.socket.on('server-player-move', data => {
      this.eventManager.emit('server-player-move', data);
    });
  }

  joinGame(roomId, playerName) {
    console.log(`Joining room "${roomId}" as "${playerName}"`);
    this.socket.emit('client-player-join', { roomId, playerName }, resp => {
      console.log('Server response: ', resp);
    });
    this.socket.on('server-player-join', data => {
      this.eventManager.emit('server-player-join', data);
      console.log(`As Player: player joined!`, data);
    });
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new ConnectionManager();
    }
    return instance;
  }
}
