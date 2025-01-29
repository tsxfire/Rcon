// src/index.ts
import { addRconClient } from './websocket/server';
import servers from '../config/servers.json'; // Ensure this path is correct

// Add type for the server object
interface ServerConfig {
    type: string;
    host: string;
    port: number;
    password: string;
    retries?: number;
    retryInterval?: number;
  }

  // Update forEach loops
servers.forEach((server: ServerConfig) => {
    console.log(`Connecting to ${server.host}:${server.port}...`);
    addRconClient(server);
  });
try {
    servers.forEach((server) => addRconClient(server));
    console.log('RCON Monitor started successfully');
  } catch (err) {
    console.error('Failed to start RCON Monitor:', err);
    process.exit(1);
  }

