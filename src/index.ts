import { RconClientFactory } from './rcon/RconClientFactory';
import servers from '../config/servers.json';

// Remove the old ServerConfig interface (now in types.ts)

servers.forEach((server) => {
  try {
    console.log(`Connecting to ${server.host}:${server.port}...`);
    const client = RconClientFactory.createClient(server);
    client.on('connected', () => {
      console.log(`Successfully connected to ${server.host}`);
    });
    client.on('error', (err) => {
      console.error(`Connection error (${server.host}):`, err);
    });
  } catch (err) {
    console.error(`Failed to initialize client for ${server.host}:`, err);
  }
});