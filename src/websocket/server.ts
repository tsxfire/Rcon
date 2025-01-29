import { WebSocketServer, WebSocket } from 'ws';
import { RconClientFactory } from '../rcon/RconClientFactory';
import { healthMonitor } from '../healthMonitor';

const wss = new WebSocketServer({ port: 8080 });
const clients = new Set<WebSocket>();

// Corrected broadcast function signature
export function broadcast(event: string, data: object) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event, data }));
    }
  });
}

export function addRconClient(config: RconClient['config']) {
  const client = new RconClient(config);
  healthMonitor.addServer(client);
  
  client.on('player_join', (data) => {
    broadcast('player_join', data);
  });
}

process.on('SIGINT', () => {
  wss.close();
});