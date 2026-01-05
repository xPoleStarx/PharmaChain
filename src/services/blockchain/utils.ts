/**
 * Generates a random transaction hash (simulating blockchain hash)
 */
export function generateTransactionHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Simulates network delay for blockchain operations
 */
export function delay(min: number, max: number): Promise<void> {
  const delayMs = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

