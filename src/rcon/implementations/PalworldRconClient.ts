import { BaseRconClient } from '../BaseRconClient';
import { RconConfig } from '../types';

export class PalworldRconClient extends BaseRconClient {
  protected async connect(): Promise<void> {
    throw new Error('Palworld implementation pending');
  }

  public async sendCommand(command: string): Promise<string> {
    throw new Error('Palworld implementation pending');
  }

  public disconnect(): void {
    throw new Error('Palworld implementation pending');
  }
}