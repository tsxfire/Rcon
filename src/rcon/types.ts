export interface RconConfig {
    type: string;
    host: string;
    port: number;
    password: string;
    retries?: number;
    retryInterval?: number;
  }