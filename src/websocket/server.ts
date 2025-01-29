import { WebSocketServer, WebSocket } from 'ws';
import { RconClient } from '../rcon/RconClient';
import { healthMonitor } from '../healthMonitor';

const wss = new WebSocketServer({ port: 8080 });
const clients = new Set<WebSocket>();

export function addRconClient(config: RconClient['config']) {
  const client = new RconClient(config);
  healthMonitor.addServer(client);  // Track server health
  
  client.on('player_join', (data) => {
    broadcast('player_join', data);
  });
}

function broadcast(event: string, data: object) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event, data }));
    }
  });
}

// Cleanup on exit
process.on('SIGINT', () => {
  wss.close();
});