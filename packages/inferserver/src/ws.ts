import { WebSocketServer, Server, WebSocket } from 'ws';

let _wss: Server;

function wsMsg(message: any, wss?: Server): void {
  const srv = wss ?? _wss;
  srv.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const initWs = (enable: boolean, port = 5142) => {
  if (enable) {
    _wss = new WebSocketServer({ port: port });
  }
}

export { wsMsg, initWs }
