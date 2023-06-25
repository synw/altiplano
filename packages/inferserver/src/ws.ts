import { WebSocketServer, WebSocket } from 'ws';

let _wss: WebSocketServer;

function wsMsg(message: any, wss?: WebSocketServer): void {
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
