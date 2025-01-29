// src/index.ts
import { addRconClient } from './websocket/server';
import servers from '../config/servers.json'; // Ensure this path is correct

servers.forEach((server) => {
  console.log(`Connecting to ${server.host}:${server.port}`); // Add logging
  addRconClient(server);
});
try {
    servers.forEach((server) => addRconClient(server));
    console.log('RCON Monitor started successfully');
  } catch (err) {
    console.error('Failed to start RCON Monitor:', err);
    process.exit(1);
  }
