// src/rcon/RconClientFactory.ts
import { BaseRconClient } from './BaseRconClient';
import { MinecraftRconClient } from './implementations/MinecraftRconClient';
import { RconConfig } from './types';

export class RconClientFactory {
  static createClient(config: RconConfig): BaseRconClient {
    switch(config.type.toLowerCase()) {
      case 'minecraft':
        return new MinecraftRconClient(config);
      case 'palworld':
        return new PalworldRconClient(config);
      case '7d2d':
        // Implement later
        throw new Error('7 Days to Die implementation pending');
      case 'valheim':
        // Implement later
        throw new Error('Valheim implementation pending');
      case 'ark':
        // Implement later
        throw new Error('ARK implementation pending');
      default:
        throw new Error(`Unsupported game type: ${config.type}`);
    }
  }
}