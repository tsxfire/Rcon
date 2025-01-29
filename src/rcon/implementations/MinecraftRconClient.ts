import { createClient, Client } from 'minecraft-protocol';
import { BaseRconClient } from '../BaseRconClient';
import { RconConfig } from '../types';

export class MinecraftRconClient extends BaseRconClient {
  private client: Client | null = null;

  protected async connect(): Promise<void> {
    try {
      this.client = createClient({
        host: this.config.host,
        port: this.config.port,
        username: 'RCON Bot',
        password: this.config.password, // Correct property
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.retryCount = 0;
        console.log(`Connected to ${this.config.host}:${this.config.port}`);
        this.emit('connected');
      });

      this.client.on('message', (msg: string) => {
        this.emit('message', msg);
      });

      this.client.on('end', () => {
        this.isConnected = false;
        this.emit('disconnected');
        this.scheduleReconnect();
      });

    } catch (err) {
      console.error(`Connection failed: ${(err as Error).message}`);
      this.scheduleReconnect();
    }
  }
  // Add missing disconnect implementation
  public disconnect(): void {
    this.client?.end();
    this.isConnected = false;
  }
  public async sendCommand(command: string): Promise<string> {
    return new Promise((resolve) => {
      if (!this.client) return resolve('');
      
      this.client.write('chat', {
        message: command
      });
      
      this.client.once('chat', (packet) => {
        resolve(packet.message);
      });
    });
  }
}