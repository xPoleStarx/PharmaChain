import { UserRole } from '../types/user';

export const USER_ROLES = UserRole;

export const ROLE_ADDRESSES: Record<UserRole, string> = {
  [UserRole.MANUFACTURER]: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Hardhat Account #0
  [UserRole.DISTRIBUTOR]: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',   // Hardhat Account #1
  [UserRole.PHARMACY]: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',      // Hardhat Account #2
  [UserRole.PATIENT]: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',       // Hardhat Account #3
};

export const STORAGE_KEYS = {
  LEDGER: 'pharmachain_ledger',
  CURRENT_USER: 'pharmachain_current_user',
} as const;

export const TEMPERATURE_THRESHOLDS = {
  MIN: 2, // Celsius
  MAX: 8, // Celsius
} as const;

