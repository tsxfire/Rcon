import { WebSocketServer, WebSocket } from 'ws';
import { RconClientFactory } from '../rcon/RconClientFactory';
import { healthMonitor } from '../healthMonitor';

const wss = new WebSocketServer({ port: 8080 });
const clients = new Set<WebSocket>();

export function addRconClient(config: any) { // Use proper type from types.ts
  try {
    const client = RconClientFactory.createClient(config);
    healthMonitor.addServer(client);
    
    client.on('player_join', (data) => {
      broadcast('player_join', data);
    });
    
    client.on('response', (response) => {
      broadcast('command_response', {
        server: config.host,
        response: response
      });
    });
  } catch (err) {
    console.error(`Failed to create client:`, err);
  }
}