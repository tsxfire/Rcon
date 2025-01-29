import { RconClientFactory } from './rcon/RconClientFactory';
import { RconConfig } from './rcon/types';
import servers from '../config/servers.json';

// Type assertion for JSON import
const validatedServers = servers as RconConfig[];

validatedServers.forEach((server) => {
  try {
    console.log(`Connecting to ${server.host}:${server.port}...`);
    const client = RconClientFactory.createClient(server);
    
    client.on('connected', () => {
      console.log(`✅ Connected to ${server.host}`);
    });

    client.on('error', (err) => {
      console.error(`❌ Connection error (${server.host}):`, err);
    });

  } catch (err) {
    console.error(`🛑 Failed to initialize client for ${server.host}:`, err);
  }
});