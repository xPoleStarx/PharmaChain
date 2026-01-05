export interface BlockchainConfig {
  minDelay: number; // milliseconds
  maxDelay: number; // milliseconds
}

export const DEFAULT_CONFIG: BlockchainConfig = {
  minDelay: 1500,
  maxDelay: 3000,
};

