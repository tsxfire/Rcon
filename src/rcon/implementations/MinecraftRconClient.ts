// src/rcon/implementations/MinecraftRconClient.ts
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
        rconPassword: this.config.password,
        accessToken: ''
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.retryCount = 0;
        console.log(`Connected to Minecraft server at ${this.config.host}:${this.config.port}`);
        this.emit('connected', this.config.host);
      });

      this.client.on('rcon_response', (response: string) => {
        this.emit('response', response);
      });

      this.client.on('error', (err: Error) => {
        console.error(`Minecraft RCON error: ${err.message}`);
        this.scheduleReconnect();
      });

      this.client.on('end', () => {
        this.isConnected = false;
        this.emit('disconnected');
        this.scheduleReconnect();
      });

    } catch (err) {
      console.error(`Minecraft connection failed: ${(err as Error).message}`);
      this.scheduleReconnect();
    }
  }

  public async sendCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.isConnected) {
        return reject('Not connected to Minecraft server');
      }

      const timeout = setTimeout(() => {
        reject('Command timeout');
      }, 10000);

      this.client?.once('rcon_response', (response: string) => {
        clearTimeout(timeout);
        resolve(response);
      });

      this.client?.send('rcon', {
        command: command,
        commandType: 2
      });
    });
  }

  public disconnect(): void {
    this.client?.end();
    this.isConnected = false;
  }
}