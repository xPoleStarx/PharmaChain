export enum UserRole {
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  PHARMACY = 'PHARMACY',
  PATIENT = 'PATIENT',
}

export interface User {
  address: string;
  role: UserRole;
  name?: string;
}
