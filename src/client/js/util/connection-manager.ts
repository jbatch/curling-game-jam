'use strict';

const socketIO = require('socket.io-client');
import { EventManager, ServerEvent, ClientEvent } from './event-manager';

var instance: ConnectionManager;

export default class ConnectionManager {
  socket: SocketIOClient.Socket;

  constructor() {
    console.assert(instance === undefined, 'Trying to instantiate non-Singleton ConnectionManager');
    this.socket = socketIO({ transports: ['websocket'] });

    this.socket.on('connect', () => {
      console.log(`Connected. ID: ${this.socket.id}`);
      const data = { stuff: 'whatever' };
      const receiver = resp => {
        console.log('Server response:');
        console.log(resp);
      };
      // this.socket.emit('new-host', data, receiver);
      this.socket.on('message', function(msg) {
        console.log('Message from server: ', msg);
      });
    });
  }

  registerHost() {
    console.log('Registring as host...');
    this.socket.emit('new-host', { data: 'i am the host now' }, resp => {
      console.log('Server response: ', resp);
    });
  }

  joinGame(roomId, playerName) {
    console.log(`Joining room "${roomId}" as "${playerName}"`);
    this.socket.emit('add-player', { roomId, playerName }, resp => {
      console.log('Server response: ', resp);
    });
  }

  sendClientEvent(event: ClientEvent) {
    // Send event to backend here
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new ConnectionManager();
    }
    return instance;
  }
}
