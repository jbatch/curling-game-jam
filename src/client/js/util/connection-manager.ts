'use strict';

const socketIO = require('socket.io-client');
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
      this.socket.emit('/api', data, receiver);
    });
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new ConnectionManager();
    }
    return instance;
  }
}