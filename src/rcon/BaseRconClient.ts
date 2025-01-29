// src/rcon/BaseRconClient.ts
import { EventEmitter } from 'events';
import { RconConfig } from './types';

export abstract class BaseRconClient extends EventEmitter {
  protected config: RconConfig;
  protected retryCount = 0;
  protected isConnected = false;

  constructor(config: RconConfig) {
    super();
    this.config = config;
    this.connect();
  }

  protected abstract connect(): Promise<void>;
  public abstract sendCommand(command: string): Promise<string>;
  public abstract disconnect(): void;
  
  protected scheduleReconnect() {
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

  public get connectionStatus(): string {
    return this.isConnected ? 'connected' : 'disconnected';
  }
}