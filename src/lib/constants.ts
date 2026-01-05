import { UserRole } from '../types/user';

export const USER_ROLES = UserRole;

export const ROLE_ADDRESSES: Record<UserRole, string> = {
  [UserRole.MANUFACTURER]: '0xManufacturer123456789',
  [UserRole.DISTRIBUTOR]: '0xDistributor123456789',
  [UserRole.PHARMACY]: '0xPharmacy123456789',
  [UserRole.PATIENT]: '0xPatient123456789',
};

export const STORAGE_KEYS = {
  LEDGER: 'pharmachain_ledger',
  CURRENT_USER: 'pharmachain_current_user',
} as const;

export const TEMPERATURE_THRESHOLDS = {
  MIN: 2, // Celsius
  MAX: 8, // Celsius
} as const;

