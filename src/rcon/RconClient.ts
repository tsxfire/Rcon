import EventEmitter from 'events';
import { Client } from 'minecraft-protocol';  // Use the correct export
import { RconConfig } from './types';  // We'll create this file

export class RconClient extends EventEmitter {
  private client: Client;  // Use Client type from minecraft-protocol
  private retryCount = 0;
  private isConnected = false;

  constructor(public config: RconConfig) {
    super();
    this.connect();
  }

  private async connect() {
    try {
      switch (this.config.type) {
        case 'minecraft':
          this.client = new RCON(this.config.host, {
            port: this.config.port,
            password: this.config.password,
          });
          this.client.on('message', (msg: string) => this.handleMessage(msg));
          this.client.on('error', (err) => console.error('Minecraft RCON error:', err));
          break;
        case 'ark':
          // Implement Ark RCON
          break;
      }
      this.emit('connected', this.config.host);
    } catch (err) {
      this.scheduleReconnect();
    }
  }

  private handleMessage(message: string) {
    if (message.includes('joined')) this.emit('player_join', message);
  }

  private scheduleReconnect() {
    if (this.retryCount >= this.config.retries!) return;
    setTimeout(() => this.connect(), this.config.retryInterval!);
    this.retryCount++;
  }
}
