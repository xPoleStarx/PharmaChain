export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface Transaction {
  hash: string;
  status: TransactionStatus;
  timestamp: number;
  from: string;
  to?: string;
  method: string; // 'registerDrug', 'transferDrug', etc.
  drugId?: string;
}

export interface TransactionResult {
  success: boolean;
  transactionHash: string;
  message?: string;
  error?: string;
}
