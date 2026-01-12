import { Drug, DrugHistory, TransactionResult } from '@/types';

/**
 * Interface for blockchain service implementations
 * Allows switching between MockBlockchainService and RealBlockchainService
 */
export interface IBlockchainService {
  registerDrug(
    id: string,
    name: string,
    batchNumber: string,
    manufacturerAddress: string,
    initialTemperature?: number,
    initialLocation?: string
  ): Promise<TransactionResult>;

  transferDrug(drugId: string, fromAddress: string, toAddress: string): Promise<TransactionResult>;

  updateTemperature(
    drugId: string,
    temperature: number,
    updatedBy: string
  ): Promise<TransactionResult>;

  updateLocation(drugId: string, location: string, updatedBy: string): Promise<TransactionResult>;

  getDrugById(drugId: string): Promise<Drug | null>;
  getAllDrugsByOwner(ownerAddress: string): Promise<Drug[]>;
  getDrugHistory(drugId: string): Promise<DrugHistory[]>;
  getAllTransactions(): Promise<any[]>;
  connectWallet(): Promise<string>;
}

/**
 * Configuration for blockchain service simulations
 */
export interface BlockchainConfig {
  minDelay: number; // milliseconds
  maxDelay: number; // milliseconds
}

export const DEFAULT_BLOCKCHAIN_CONFIG: BlockchainConfig = {
  minDelay: 1500,
  maxDelay: 3000,
};
