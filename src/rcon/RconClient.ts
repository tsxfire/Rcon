import EventEmitter from 'events';
import { RCON } from 'minecraft-protocol';
import { RconConfig } from './types';

export class RconClient extends EventEmitter {
  private client: any;
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