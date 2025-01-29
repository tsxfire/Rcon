import { BaseRconClient } from './rcon/BaseRconClient';

export class HealthMonitor {
  public servers = new Map<string, BaseRconClient>(); // Use base class type

  addServer(client: BaseRconClient) {
    this.servers.set(client.config.host, client);
  }
}

export const healthMonitor = new HealthMonitor();