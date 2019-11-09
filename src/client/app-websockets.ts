// import socketClient from 'socket.io-client';
const io = require('socket.io-client');
// console.log(socketClient);
const socket = io({ transports: ['websocket'] });
console.log(socket);

socket.on('connect', () => {
  console.log(`Connected. ID: ${socket.id}`);
  const data = { stuff: 'whatever' };
  const receiver = resp => {
    console.log('Server response:');
    console.log(resp);
  };
  socket.emit('/api', data, receiver);
});

console.log('loaded');

console.log('done');
console.log('done!!');
