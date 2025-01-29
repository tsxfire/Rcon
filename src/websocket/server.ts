import { RconClient } from '../rcon/RconClient';
import type { RconConfig } from '../rcon/types';  // Import from types.ts

const wss = new WebSocketServer({ port: 8080 });
const clients = new Set<WebSocket>();

export function addRconClient(config: RconConfig) {
  const client = new RconClient(config);
}
export function broadcast(event: string, data: object) {
  clients.forEach(client => client.send(JSON.stringify({ event, data })));
}

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});