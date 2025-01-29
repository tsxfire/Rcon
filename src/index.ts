import readline from 'readline';
import inquirer from 'inquirer';
import { RconClientFactory } from './rcon/RconClientFactory';
import { healthMonitor } from './healthMonitor';
import servers from '../config/servers.json';
import { RconConfig, isRconConfig } from './rcon/types';

// Initialize servers
const validatedServers = servers.filter(server => isRconConfig(server)) as RconConfig[];
let cliInitialized = false;

validatedServers.forEach((server) => {
  try {
    const client = RconClientFactory.createClient(server);
    healthMonitor.addServer(client);

    client.on('connected', () => {
      console.log(`✅ Connected to ${server.host}:${server.port}`);
      if (!cliInitialized) {
        cliInitialized = true;
        startCLI();
      }
    });

    client.on('error', (err) => {
      console.error(`❌ Connection error (${server.host}):`, err.message);
    });

  } catch (err) {
    console.error(`🛑 Failed to initialize ${server.type} client:`, err);
  }
});

// CLI Interface
async function selectServer() {
  const servers = Array.from(healthMonitor.servers.values())
    .filter(s => s.isConnected);

  if (servers.length === 0) {
    console.log('No connected servers available');
    return null;
  }

  const { selectedHost } = await inquirer.prompt({
    type: 'list',
    name: 'selectedHost',
    message: 'Select a server:',
    choices: servers.map(s => ({
      name: `${s.config.host}:${s.config.port} (${s.config.type})`,
      value: s.config.host
    }))
  });

  return servers.find(s => s.config.host === selectedHost);
}

async function startCLI() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  while (true) {
    const server = await selectServer();
    if (!server) break;

    const { command } = await inquirer.prompt({
      type: 'input',
      name: 'command',
      message: `Enter command for ${server.config.host}:`
    });

    try {
      const response = await server.sendCommand(command);
      console.log(`📤 Response:\n${response}`);
    } catch (err) {
      console.error(`❌ Command failed: ${(err as Error).message}`);
    }
  }

  rl.close();
}

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\nClosing connections...');
  healthMonitor.servers.forEach(server => server.disconnect());
  process.exit();
});