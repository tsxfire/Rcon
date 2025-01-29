import { RconClient } from '../rcon/RconClient';

export class HealthMonitor {
  public servers = new Map<string, RconClient>();

  addServer(client: RconClient) {
    this.servers.set(client.config.host, client);
  }
}

export const healthMonitor = new HealthMonitor();