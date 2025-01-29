// src/rcon/types.ts
export interface RconConfig {
    type: 'minecraft' | 'palworld' | '7d2d' | 'valheim' | 'ark';
    host: string;
    port: number;
    password: string;
    retries?: number;
    retryInterval?: number;
  }