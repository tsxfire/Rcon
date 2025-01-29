import { EventEmitter } from 'events';
import { createClient, Client } from 'minecraft-protocol'; // Use createClient
import { RconConfig } from './types';

export class RconClient extends EventEmitter {
  private client: Client | null = null;
  private retryCount = 0;
  private isConnected = false;

  constructor(public config: RconConfig) {
    super();
    this.connect();
  }

  private async connect() {
    try {
      if (this.config.type === 'minecraft') {
        // Use createClient with RCON options
        this.client = createClient({
          host: this.config.host,
          port: this.config.port,
          password: this.config.password,
          connectTimeout: 5000
        });

        // Add event handlers with null checks
        this.client?.on('connect', () => {
          this.isConnected = true;
          this.retryCount = 0;
          console.log(`Connected to ${this.config.host}:${this.config.port}`);
          this.emit('connected', this.config.host);
        });

        this.client?.on('message', (msg: string) => {
          this.handleMessage(msg);
        });

        this.client?.on('error', (err: Error) => {
          console.error(`RCON error (${this.config.host}):`, err.message);
          this.scheduleReconnect();
        });

        this.client?.on('end', () => {
          this.isConnected = false;
          this.emit('disconnected', this.config.host);
          this.scheduleReconnect();
        });
      }
    } catch (err) {
      console.error(`Connection failed (${this.config.host}):`, (err as Error).message);
      this.scheduleReconnect();
    }
  }

  private handleMessage(message: string) {
    console.log(`Received from ${this.config.host}:`, message);
    if (message.includes('joined the game')) {
      const player = message.split(' ')[0];
      this.emit('player_join', {
        server: this.config.host,
        player: player
      });
    }
  }

  private scheduleReconnect() {
    if (this.retryCount >= (this.config.retries ?? 3)) {
      console.error(`Max retries reached for ${this.config.host}`);
      return;
    }

    const baseDelay = this.config.retryInterval ?? 5000;
    const delay = baseDelay * Math.pow(2, this.retryCount);
    this.retryCount++;
    
    console.log(`Reconnecting to ${this.config.host} in ${delay}ms...`);
    setTimeout(() => this.connect(), delay);
  }

  public async sendCommand(command: string): Promise<string> {
    if (!this.client || !this.isConnected) {
      throw new Error('Not connected to server');
    }
    
    return new Promise((resolve, reject) => {
      // Use the correct command format for Minecraft RCON
      this.client?.write('rcon_command', {
        command: command
      });
      
      // Listen for response
      this.client?.once('rcon_response', (response: string) => {
        resolve(response);
      });
    });
  }

  public get connectionStatus(): string {
    return this.isConnected ? 'connected' : 'disconnected';
  }
}