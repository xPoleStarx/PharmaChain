import { Drug, DrugHistory, DrugLedger, Transaction, TransactionResult, TransactionStatus } from '../../types';
import { ROLE_ADDRESSES, STORAGE_KEYS } from '../../lib/constants';
import { UserRole } from '../../types/user';
import { generateTransactionHash, delay } from './utils';
import { DEFAULT_CONFIG } from './types';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';
import { IBlockchainService } from './BlockchainService';

export class MockBlockchainService implements IBlockchainService {
  private config = DEFAULT_CONFIG;

  /**
   * Initialize empty ledger if it doesn't exist
   */
  private getLedger(): DrugLedger {
    const ledger = LocalStorageAdapter.get<DrugLedger>(STORAGE_KEYS.LEDGER);
    if (!ledger) {
      const emptyLedger: DrugLedger = {
        drugs: {},
        transactions: [],
        history: {},
      };
      LocalStorageAdapter.set(STORAGE_KEYS.LEDGER, emptyLedger);
      return emptyLedger;
    }
    return ledger;
  }

  /**
   * Save ledger to localStorage
   */
  private saveLedger(ledger: DrugLedger): void {
    LocalStorageAdapter.set(STORAGE_KEYS.LEDGER, ledger);
  }

  /**
   * Create a transaction record
   */
  private createTransaction(
    method: string,
    from: string,
    status: TransactionStatus,
    drugId?: string,
    to?: string
  ): Transaction {
    return {
      hash: generateTransactionHash(),
      status,
      timestamp: Date.now(),
      from,
      to,
      method,
      drugId,
    };
  }

  /**
   * Add history entry for a drug
   */
  private addHistoryEntry(
    ledger: DrugLedger,
    drugId: string,
    eventType: DrugHistory['eventType'],
    transactionHash: string,
    fromAddress?: string,
    toAddress?: string,
    temperature?: number,
    location?: string
  ): void {
    if (!ledger.history[drugId]) {
      ledger.history[drugId] = [];
    }

    const historyEntry: DrugHistory = {
      drugId,
      timestamp: Date.now(),
      eventType,
      transactionHash,
      fromAddress,
      toAddress,
      temperature,
      location,
    };

    ledger.history[drugId].push(historyEntry);
  }

  /**
   * Register a new drug (only Manufacturer can do this)
   */
  async registerDrug(
    id: string,
    name: string,
    batchNumber: string,
    manufacturerAddress: string,
    initialTemperature: number = 4,
    initialLocation: string = 'Manufacturing Facility'
  ): Promise<TransactionResult> {
    // Simulate network delay (mining)
    await delay(this.config.minDelay, this.config.maxDelay);

    // Verify caller is Manufacturer
    if (manufacturerAddress !== ROLE_ADDRESSES[UserRole.MANUFACTURER]) {
      return {
        success: false,
        transactionHash: '',
        error: 'Only Manufacturer can register drugs',
      };
    }

    const ledger = this.getLedger();

    // Check if drug already exists
    if (ledger.drugs[id]) {
      return {
        success: false,
        transactionHash: '',
        error: 'Drug with this ID already exists',
      };
    }

    // Create new drug
    const drug: Drug = {
      id,
      name,
      batchNumber,
      currentOwner: manufacturerAddress,
      temperature: initialTemperature,
      location: initialLocation,
      registeredAt: Date.now(),
      registeredBy: manufacturerAddress,
    };

    // Create transaction
    const transaction = this.createTransaction(
      'registerDrug',
      manufacturerAddress,
      TransactionStatus.SUCCESS,
      id
    );

    // Add to ledger
    ledger.drugs[id] = drug;
    ledger.transactions.push(transaction);

    // Add history entry
    this.addHistoryEntry(
      ledger,
      id,
      'REGISTERED',
      transaction.hash,
      undefined,
      manufacturerAddress,
      initialTemperature,
      initialLocation
    );

    // Save ledger
    this.saveLedger(ledger);

    return {
      success: true,
      transactionHash: transaction.hash,
      message: 'Drug registered successfully',
    };
  }

  /**
   * Transfer drug ownership
   */
  async transferDrug(
    drugId: string,
    fromAddress: string,
    toAddress: string
  ): Promise<TransactionResult> {
    // Simulate network delay (mining)
    await delay(this.config.minDelay, this.config.maxDelay);

    const ledger = this.getLedger();
    const drug = ledger.drugs[drugId];

    if (!drug) {
      return {
        success: false,
        transactionHash: '',
        error: 'Drug not found',
      };
    }

    // Verify caller is current owner
    if (drug.currentOwner !== fromAddress) {
      return {
        success: false,
        transactionHash: '',
        error: 'Unauthorized: You are not the current owner',
      };
    }

    // Create transaction
    const transaction = this.createTransaction(
      'transferDrug',
      fromAddress,
      TransactionStatus.SUCCESS,
      drugId,
      toAddress
    );

    // Update drug ownership
    drug.currentOwner = toAddress;
    drug.location = `In Transit to ${toAddress}`;

    // Add to transactions
    ledger.transactions.push(transaction);

    // Add history entry
    this.addHistoryEntry(
      ledger,
      drugId,
      'TRANSFERRED',
      transaction.hash,
      fromAddress,
      toAddress
    );

    // Save ledger
    this.saveLedger(ledger);

    return {
      success: true,
      transactionHash: transaction.hash,
      message: 'Drug transferred successfully',
    };
  }

  /**
   * Update drug temperature (IoT sensor data)
   */
  async updateTemperature(
    drugId: string,
    temperature: number,
    updatedBy: string
  ): Promise<TransactionResult> {
    // Simulate network delay (mining)
    await delay(this.config.minDelay, this.config.maxDelay);

    const ledger = this.getLedger();
    const drug = ledger.drugs[drugId];

    if (!drug) {
      return {
        success: false,
        transactionHash: '',
        error: 'Drug not found',
      };
    }

    // Create transaction
    const transaction = this.createTransaction(
      'updateTemperature',
      updatedBy,
      TransactionStatus.SUCCESS,
      drugId
    );

    // Update temperature
    drug.temperature = temperature;

    // Add to transactions
    ledger.transactions.push(transaction);

    // Add history entry
    this.addHistoryEntry(
      ledger,
      drugId,
      'TEMPERATURE_UPDATED',
      transaction.hash,
      undefined,
      undefined,
      temperature
    );

    // Save ledger
    this.saveLedger(ledger);

    return {
      success: true,
      transactionHash: transaction.hash,
      message: 'Temperature updated successfully',
    };
  }

  /**
   * Update drug location
   */
  async updateLocation(
    drugId: string,
    location: string,
    updatedBy: string
  ): Promise<TransactionResult> {
    // Simulate network delay (mining)
    await delay(this.config.minDelay, this.config.maxDelay);

    const ledger = this.getLedger();
    const drug = ledger.drugs[drugId];

    if (!drug) {
      return {
        success: false,
        transactionHash: '',
        error: 'Drug not found',
      };
    }

    // Create transaction
    const transaction = this.createTransaction(
      'updateLocation',
      updatedBy,
      TransactionStatus.SUCCESS,
      drugId
    );

    // Update location
    drug.location = location;

    // Add to transactions
    ledger.transactions.push(transaction);

    // Add history entry
    this.addHistoryEntry(
      ledger,
      drugId,
      'LOCATION_UPDATED',
      transaction.hash,
      undefined,
      undefined,
      undefined,
      location
    );

    // Save ledger
    this.saveLedger(ledger);

    return {
      success: true,
      transactionHash: transaction.hash,
      message: 'Location updated successfully',
    };
  }

  /**
   * Get drug by ID
   */
  async getDrugById(drugId: string): Promise<Drug | null> {
    // Simulate small network delay
    await delay(200, 500);

    const ledger = this.getLedger();
    return ledger.drugs[drugId] || null;
  }

  /**
   * Get all drugs owned by an address
   */
  async getAllDrugsByOwner(ownerAddress: string): Promise<Drug[]> {
    // Simulate small network delay
    await delay(200, 500);

    const ledger = this.getLedger();
    return Object.values(ledger.drugs).filter(
      (drug) => drug.currentOwner === ownerAddress
    );
  }

  /**
   * Get complete history for a drug
   */
  async getDrugHistory(drugId: string): Promise<DrugHistory[]> {
    // Simulate small network delay
    await delay(200, 500);

    const ledger = this.getLedger();
    return ledger.history[drugId] || [];
  }

  /**
   * Get all transactions
   */
  async getAllTransactions(): Promise<Transaction[]> {
    // Simulate small network delay
    await delay(200, 500);

    const ledger = this.getLedger();
    return ledger.transactions;
  }
}

// Export singleton instance
export const mockBlockchainService = new MockBlockchainService();

