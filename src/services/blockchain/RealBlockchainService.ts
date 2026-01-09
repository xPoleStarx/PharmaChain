import { ethers } from 'ethers';
import { IBlockchainService } from './BlockchainService';
import { Drug, DrugHistory, TransactionResult, Transaction, TransactionStatus } from '../../types';
import PharmaChainArtifact from '../../../artifacts/contracts/PharmaChain.sol/PharmaChain.json';

/**
 * Real blockchain service implementation using Solidity smart contracts
 * Connects to deployed PharmaChain contract via ethers.js v6
 */
export class RealBlockchainService implements IBlockchainService {
  private contract: ethers.Contract;
  private provider: ethers.BrowserProvider | ethers.JsonRpcProvider;
  private signer: ethers.Signer | null = null;

  constructor(contractAddress: string, providerUrl?: string) {
    // Initialize provider
    if (typeof window !== 'undefined' && window.ethereum) {
      // Browser environment with MetaMask
      this.provider = new ethers.BrowserProvider(window.ethereum);
    } else if (providerUrl) {
      // Custom provider URL
      this.provider = new ethers.JsonRpcProvider(providerUrl);
    } else {
      // Default to localhost
      this.provider = new ethers.JsonRpcProvider('http://localhost:8545');
    }

    // Initialize contract
    this.contract = new ethers.Contract(contractAddress, PharmaChainArtifact.abi, this.provider);
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet(): Promise<string> {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        // Synchronize contract with the new signer/provider
        this.contract = this.contract.connect(this.signer) as any;
        return accounts[0];
      } catch (error: any) {
        if (error.code === 4001) {
          throw new Error('User rejected the connection request');
        }
        console.error('Wallet connection error:', error);
        throw new Error('Failed to connect to MetaMask');
      }
    } else {
      throw new Error('MetaMask not detected. Please install the MetaMask extension.');
    }
  }

  /**
   * Get signer for write transactions
   * @param userAddress Optional address to use for signing (for role-based signing)
   */
  private async getSigner(userAddress?: string): Promise<ethers.Signer> {
    if (this.provider instanceof ethers.BrowserProvider) {
      this.signer = await this.provider.getSigner();
    } else if (this.provider instanceof ethers.JsonRpcProvider) {
      const accounts = await this.provider.listAccounts();
      if (accounts.length > 0) {
        // If userAddress is provided, find the matching account
        if (userAddress) {
          const normalizedUserAddress = userAddress.toLowerCase();
          const matchingAccount = accounts.find(
            acc => acc.address.toLowerCase() === normalizedUserAddress
          );
          if (matchingAccount) {
            this.signer = await this.provider.getSigner(matchingAccount.address);
          } else {
            // Fallback to first account if no match found
            console.warn(`No account found for ${userAddress}, using default account`);
            this.signer = await this.provider.getSigner(accounts[0].address);
          }
        } else {
          // Default to first account if no userAddress specified
          this.signer = await this.provider.getSigner(accounts[0].address);
        }
      } else {
        throw new Error('No accounts available in JSON-RPC provider');
      }
    }

    if (!this.signer) {
      throw new Error('Signer not available. Please connect your wallet first.');
    }
    // Ensure contract is using the latest signer
    this.contract = this.contract.connect(this.signer) as any;
    return this.signer;
  }

  async registerDrug(
    id: string,
    name: string,
    batchNumber: string,
    manufacturerAddress: string,
    initialTemperature: number = 4,
    initialLocation: string = 'Manufacturing Facility'
  ): Promise<TransactionResult> {
    try {
      const signer = await this.getSigner(manufacturerAddress);
      const contractWithSigner = this.contract.connect(signer) as any;

      const tempScaled = Math.round(initialTemperature * 10);
      const tx = await contractWithSigner.registerDrug(
        id,
        name,
        batchNumber,
        tempScaled,
        initialLocation
      );

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        message: 'Drug registered successfully',
      };
    } catch (error: any) {
      console.error('Register drug error:', error);
      return {
        success: false,
        transactionHash: '',
        error: this.handleError(error),
      };
    }
  }

  async transferDrug(
    drugId: string,
    fromAddress: string,
    toAddress: string
  ): Promise<TransactionResult> {
    try {
      const signer = await this.getSigner(fromAddress);
      const contractWithSigner = this.contract.connect(signer) as any;

      const tx = await contractWithSigner.transferDrug(drugId, toAddress);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        message: 'Drug transferred successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        transactionHash: '',
        error: this.handleError(error),
      };
    }
  }

  async updateTemperature(
    drugId: string,
    temperature: number,
    updatedBy: string
  ): Promise<TransactionResult> {
    try {
      const signer = await this.getSigner(updatedBy);
      const contractWithSigner = this.contract.connect(signer) as any;

      const tempScaled = Math.round(temperature * 10);
      const tx = await contractWithSigner.updateTemperature(drugId, tempScaled);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        message: 'Temperature updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        transactionHash: '',
        error: this.handleError(error),
      };
    }
  }

  async updateLocation(
    drugId: string,
    location: string,
    updatedBy: string
  ): Promise<TransactionResult> {
    try {
      const signer = await this.getSigner(updatedBy);
      const contractWithSigner = this.contract.connect(signer) as any;

      const tx = await contractWithSigner.updateLocation(drugId, location);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        message: 'Location updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        transactionHash: '',
        error: this.handleError(error),
      };
    }
  }

  async getDrugById(drugId: string): Promise<Drug | null> {
    try {
      const cleanId = String(drugId).trim();
      const d = await this.contract.getDrug(cleanId);
      return {
        id: String(d.id),
        name: String(d.name),
        batchNumber: String(d.batchNumber),
        currentOwner: String(d.currentOwner),
        temperature: Number(d.temperature) / 10,
        location: String(d.location),
        registeredAt: Number(d.registeredAt) * 1000,
        registeredBy: String(d.registeredBy),
      };
    } catch (error) {
      return null;
    }
  }

  async getAllDrugsByOwner(ownerAddress: string): Promise<Drug[]> {
    try {
      const normalizedOwner = ownerAddress.toLowerCase();
      console.log('🔍 [getAllDrugsByOwner] Starting fetch for owner:', ownerAddress);
      console.log('🔍 [getAllDrugsByOwner] Normalized owner:', normalizedOwner);

      const registeredFilter = this.contract.filters.DrugRegistered(null, ownerAddress);
      const transferredToFilter = this.contract.filters.DrugTransferred(null, null, ownerAddress);

      console.log('🔍 [getAllDrugsByOwner] Filters created:', {
        registeredFilter,
        transferredToFilter
      });

      const [regEvents, transEvents] = await Promise.all([
        this.contract.queryFilter(registeredFilter, 0, 'latest'),
        this.contract.queryFilter(transferredToFilter, 0, 'latest'),
      ]);

      console.log('🔍 [getAllDrugsByOwner] Events found:', {
        registeredEvents: regEvents.length,
        transferredEvents: transEvents.length
      });

      if (regEvents.length > 0) {
        console.log('🔍 [getAllDrugsByOwner] Sample registered event:', regEvents[0]);
      }

      const drugIds = new Set<string>();

      const extractId = (event: any): string => {
        const args = event.args;
        const id = args.drugId || args[0];
        if (typeof id === 'object' && id !== null) {
          return id.hash || JSON.stringify(id);
        }
        return String(id);
      };

      regEvents.forEach((e: any) => {
        const id = extractId(e);
        console.log('🔍 [getAllDrugsByOwner] Extracted drugId from registered event:', id);
        drugIds.add(id);
      });

      transEvents.forEach((e: any) => {
        const id = extractId(e);
        console.log('🔍 [getAllDrugsByOwner] Extracted drugId from transfer event:', id);
        drugIds.add(id);
      });

      console.log('🔍 [getAllDrugsByOwner] Total unique drug IDs:', drugIds.size, Array.from(drugIds));

      const drugs: Drug[] = [];
      for (const id of drugIds) {
        console.log('🔍 [getAllDrugsByOwner] Fetching drug details for ID:', id);
        const drug = await this.getDrugById(id);
        if (drug) {
          console.log('🔍 [getAllDrugsByOwner] Drug found:', {
            id: drug.id,
            name: drug.name,
            currentOwner: drug.currentOwner,
            normalizedCurrentOwner: drug.currentOwner.toLowerCase(),
            matches: drug.currentOwner.toLowerCase() === normalizedOwner
          });
          if (drug.currentOwner.toLowerCase() === normalizedOwner) {
            drugs.push(drug);
          } else {
            console.log('⚠️ [getAllDrugsByOwner] Drug ownership mismatch - skipping');
          }
        } else {
          console.log('⚠️ [getAllDrugsByOwner] Drug not found for ID:', id);
        }
      }

      console.log('🔍 [getAllDrugsByOwner] Final result:', drugs.length, 'drugs owned by', ownerAddress);
      return drugs;
    } catch (error) {
      console.error('❌ [getAllDrugsByOwner] Error fetching drugs by owner:', error);
      return [];
    }
  }

  async getDrugHistory(drugId: string): Promise<DrugHistory[]> {
    try {
      const history = await this.contract.getAllDrugHistory(drugId);
      return history.map((h: any) => ({
        drugId: String(h.drugId),
        timestamp: Number(h.timestamp) * 1000,
        eventType: this.mapEventType(Number(h.eventType)),
        fromAddress: h.fromAddress === ethers.ZeroAddress ? undefined : String(h.fromAddress),
        toAddress: h.toAddress === ethers.ZeroAddress ? undefined : String(h.toAddress),
        temperature: h.temperature ? Number(h.temperature) / 10 : undefined,
        location: h.location ? String(h.location) : undefined,
        transactionHash: String(h.transactionHash),
      }));
    } catch (error) {
      console.error('Error fetching drug history:', error);
      return [];
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const [reg, trans, temp, loc] = await Promise.all([
        this.contract.queryFilter(this.contract.filters.DrugRegistered(), 0, 'latest'),
        this.contract.queryFilter(this.contract.filters.DrugTransferred(), 0, 'latest'),
        this.contract.queryFilter(this.contract.filters.TemperatureUpdated(), 0, 'latest'),
        this.contract.queryFilter(this.contract.filters.LocationUpdated(), 0, 'latest'),
      ]);

      const allEvents = [...reg, ...trans, ...temp, ...loc];

      const transactions = await Promise.all(
        allEvents.map(async (event: any) => {
          const block = await event.getBlock();
          let method = 'unknown';
          const fragmentName = event.fragment ? event.fragment.name : 'unknown';

          if (fragmentName === 'DrugRegistered') method = 'registerDrug';
          if (fragmentName === 'DrugTransferred') method = 'transferDrug';
          if (fragmentName === 'TemperatureUpdated') method = 'updateTemperature';
          if (fragmentName === 'LocationUpdated') method = 'updateLocation';

          const drugIdRaw = event.args.drugId || event.args[0];
          const drugId = typeof drugIdRaw === 'object' ? (drugIdRaw.hash || JSON.stringify(drugIdRaw)) : String(drugIdRaw);

          return {
            hash: String(event.transactionHash),
            status: TransactionStatus.SUCCESS,
            timestamp: Number(block.timestamp) * 1000,
            from: String(event.args.manufacturer || event.args.from || event.args.updatedBy || event.args[1] || ''),
            to: event.args.to ? String(event.args.to) : undefined,
            method,
            drugId,
          } as Transaction;
        })
      );

      return transactions.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  private mapEventType(eventType: number): DrugHistory['eventType'] {
    const types: Record<number, DrugHistory['eventType']> = {
      0: 'REGISTERED',
      1: 'TRANSFERRED',
      2: 'TEMPERATURE_UPDATED',
      3: 'LOCATION_UPDATED',
    };
    return types[Number(eventType)] || 'REGISTERED';
  }

  private handleError(error: any): string {
    if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
      return 'User rejected the transaction';
    }
    return error.reason || error.message || 'Transaction failed';
  }
}
