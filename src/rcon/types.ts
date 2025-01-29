export type GameType = 
  | 'minecraft' 
  | 'palworld' 
  | '7d2d' 
  | 'valheim' 
  | 'ark';

export interface RconConfig {
  type: GameType;
  host: string;
  port: number;
  password: string;
  retries?: number;
  retryInterval?: number;
}

// Validation function
export function isRconConfig(config: any): config is RconConfig {
  const validTypes: GameType[] = ['minecraft', 'palworld', '7d2d', 'valheim', 'ark'];
  return validTypes.includes(config.type);
}