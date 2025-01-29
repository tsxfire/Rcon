import { WebSocketServer, WebSocket } from 'ws';
import { RconClientFactory } from '../rcon/RconClientFactory';
import { healthMonitor } from '../healthMonitor';

const wss = new WebSocketServer({ port: 8080 });
const clients = new Set<WebSocket>();

// Broadcast function must be exported
export function broadcast(event: string, data: object) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event, data }));
    }
  });
}

export function addRconClient(config: any) {
  try {
    const client = RconClientFactory.createClient(config);
    healthMonitor.addServer(client);

    // Listen to game-specific events
    client.on('player_join', (data) => {
      broadcast('player_join', data);
    });

    client.on('response', (response: string) => {
      broadcast('command_response', {
        server: config.host,
        response: response
      });
    });

    client.on('error', (err) => {
      broadcast('error', {
        server: config.host,
        message: err
      });
    });
  } catch (err) {
    console.error('Failed to initialize RCON client:', err);
  }
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

// Cleanup on exit
process.on('SIGINT', () => {
  wss.close();
  console.log('WebSocket server closed');
});