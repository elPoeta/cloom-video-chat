const WebSocket = require('ws');
const handlerMessages = require('./handlerMessages');
const parseJsonObject = require('../utils/parseJsonObject');

module.exports = server => {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', ws => {
    ws.on('message', message => {
      msg = parseJsonObject(message);
      console.log(`received : ${message}`);
      handlerMessages(wss.clients, ws, msg);
    });
    ws.on('close', () => {
      console.log(`socket is disconnected`);
    });
  });
}