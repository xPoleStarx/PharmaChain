export interface Drug {
  id: string;
  name: string;
  batchNumber: string;
  currentOwner: string;
  temperature: number;
  location: string;
  registeredAt: number; // timestamp
  registeredBy: string; // manufacturer address
}

export interface DrugHistory {
  drugId: string;
  timestamp: number;
  eventType: 'REGISTERED' | 'TRANSFERRED' | 'TEMPERATURE_UPDATED' | 'LOCATION_UPDATED';
  fromAddress?: string;
  toAddress?: string;
  temperature?: number;
  location?: string;
  transactionHash: string;
}

import { Transaction } from './transaction';

export interface DrugLedger {
  drugs: Record<string, Drug>;
  transactions: Transaction[];
  history: Record<string, DrugHistory[]>;
}
