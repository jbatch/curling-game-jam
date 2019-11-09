'use strict';

import ConnectionManager from './connection-manager';

var instance: EventManager;

export type ServerEvent = {
  type: string;
};

export type ClientEvent = {
  type: string;
};

export class EventManager extends Phaser.Events.EventEmitter {
  connectionManager: ConnectionManager;
  constructor() {
    console.assert(instance === undefined, 'Trying to instantiate non-Singleton EventManager');
    super();
    this.connectionManager = ConnectionManager.getInstance();
  }

  handleServerEvent(event: ServerEvent) {
    switch (event.type) {
      case '':
        break;
    }
  }

  handleClientEvent(event: ClientEvent) {
    this.connectionManager.sendClientEvent(event);
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new EventManager();
    }
    return instance;
  }
}
