import { addRconClient } from './websocket/server';
import servers from '../config/servers.json';

interface ServerConfig {
  type: string;
  host: string;
  port: number;
  password: string;
  retries?: number;
  retryInterval?: number;
}

try {
  servers.forEach((server: ServerConfig) => {
    console.log(`Connecting to ${server.host}:${server.port}...`);
    addRconClient(server);
  });
  console.log('RCON Monitor started successfully');
} catch (err) {
  console.error('Failed to start RCON Monitor:', err);
  process.exit(1);
}