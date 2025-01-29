import { BaseRconClient } from './rcon/BaseRconClient';

export class HealthMonitor {
  public servers = new Map<string, BaseRconClient>();

  addServer(client: BaseRconClient) {
    // Access public 'config' property from BaseRconClient
    this.servers.set(client.config.host, client);
  }

  getServerStatus(host: string): string {
    const client = this.servers.get(host);
    return client?.connectionStatus || 'unknown';
  }
}

export const healthMonitor = new HealthMonitor();