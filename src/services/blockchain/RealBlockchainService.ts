import { ethers } from 'ethers';
import {
  IBlockchainService,
  Drug,
  DrugHistory,
  TransactionResult,
  Transaction,
  TransactionStatus,
} from '@/types';
import PharmaChainArtifact from '../../../artifacts/contracts/PharmaChain.sol/PharmaChain.json';

/**
 * Real blockchain service implementation using Solidity smart contracts
 * Connects to deployed PharmaChain contract via ethers.js v6
 */
export class RealBlockchainService implements IBlockchainService {
  private contract: ethers.Contract;
  private provider: ethers.BrowserProvider | ethers.JsonRpcProvider;
  private signer: ethers.Signer | null = null;

  // Fixed safe starting block for Sepolia queries
  // Contract was deployed at block 10010329, so we start searching from 10010000
  // This dramatically reduces query time and ensures we find all events
  private readonly SAFE_START_BLOCK = 10010000;
  private deploymentBlock: number = this.SAFE_START_BLOCK;

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

    console.log('📊 Using fixed safe start block for queries:', this.SAFE_START_BLOCK);
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
            (acc) => acc.address.toLowerCase() === normalizedUserAddress
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
      console.log(
        '🔍 [getAllDrugsByOwner] Fetching all on-chain events for owner:',
        normalizedOwner
      );

      const fromBlock = this.deploymentBlock;

      // 1. Fetch ALL relevant events for the range (Unfiltered)
      // We fetch everything and filter in-memory to bypass Sepolia indexing issues
      const [regEvents, transEvents] = await Promise.all([
        this.contract.queryFilter(this.contract.filters.DrugRegistered(), fromBlock, 'latest'),
        this.contract.queryFilter(this.contract.filters.DrugTransferred(), fromBlock, 'latest'),
      ]);

      console.log('📊 [getAllDrugsByOwner] Total raw events found:', {
        registered: regEvents.length,
        transferred: transEvents.length,
      });

      const drugIds = new Set<string>();

      // 2. Helper to safely extract Drug ID
      const extractIdFromArgs = (args: any): string => {
        const id = args.drugId || args[0];
        return typeof id === 'object' ? id.hash || JSON.stringify(id) : String(id);
      };

      // 3. Process Registrations (Where user is the manufacturer)
      regEvents.forEach((event: any) => {
        if (!event.args) return;

        const manufacturer = String(event.args.manufacturer || event.args[1]).toLowerCase();
        const drugId = extractIdFromArgs(event.args);

        if (manufacturer === normalizedOwner) {
          console.log(`✅ Match found (Registered): ${drugId}`);
          drugIds.add(drugId);
        }
      });

      // 4. Process Transfers (Where user is the recipient)
      transEvents.forEach((event: any) => {
        if (!event.args) return;

        const to = String(event.args.to || event.args[2]).toLowerCase();
        const drugId = extractIdFromArgs(event.args);

        // Debug log for every transfer to trace the flow
        console.log('📡 Check Transfer:', {
          drugId,
          from: event.args.from || event.args[1],
          to: to,
          lookingFor: normalizedOwner,
        });

        if (to === normalizedOwner) {
          console.log(`✅ Match found (Transferred to): ${drugId}`);
          drugIds.add(drugId);
        }
      });

      // 5. Hydrate Drug Details & Verify Current Ownership
      const drugs: Drug[] = [];
      console.log(
        `🔍 [getAllDrugsByOwner] Validating current ownership for ${drugIds.size} candidate(s)...`
      );

      for (const id of drugIds) {
        const drug = await this.getDrugById(id);
        if (drug) {
          const currentOwner = drug.currentOwner.toLowerCase();

          if (currentOwner === normalizedOwner) {
            drugs.push(drug);
          } else {
            console.log(
              `ℹ️ Skipping ${id}: User was recipient, but current owner is ${currentOwner}`
            );
          }
        }
      }

      console.log(
        `🎯 [getAllDrugsByOwner] Final Dashboard Count: ${drugs.length} for ${normalizedOwner}`
      );
      return drugs;
    } catch (error) {
      console.error('❌ [getAllDrugsByOwner] Critical fetch error:', error);
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
      console.log('🔍 [getAllTransactions] Querying from block:', this.deploymentBlock);

      const [reg, trans, temp, loc] = await Promise.all([
        this.contract.queryFilter(
          this.contract.filters.DrugRegistered(),
          this.deploymentBlock,
          'latest'
        ),
        this.contract.queryFilter(
          this.contract.filters.DrugTransferred(),
          this.deploymentBlock,
          'latest'
        ),
        this.contract.queryFilter(
          this.contract.filters.TemperatureUpdated(),
          this.deploymentBlock,
          'latest'
        ),
        this.contract.queryFilter(
          this.contract.filters.LocationUpdated(),
          this.deploymentBlock,
          'latest'
        ),
      ]);

      console.log('🔍 [getAllTransactions] Events found:', {
        registered: reg.length,
        transferred: trans.length,
        temperatureUpdated: temp.length,
        locationUpdated: loc.length,
        total: reg.length + trans.length + temp.length + loc.length,
      });

      const allEvents = [...reg, ...trans, ...temp, ...loc];

      const transactions = await Promise.all(
        allEvents.map(async (event) => {
          // Type guard to ensure we have EventLog with args
          if (!('args' in event) || !event.args) {
            return null;
          }

          // Now we know it's an EventLog, cast it explicitly
          const eventLog = event as ethers.EventLog;

          const block = await eventLog.getBlock();
          let method = 'unknown';
          const fragmentName = eventLog.fragment ? eventLog.fragment.name : 'unknown';

          if (fragmentName === 'DrugRegistered') method = 'registerDrug';
          if (fragmentName === 'DrugTransferred') method = 'transferDrug';
          if (fragmentName === 'TemperatureUpdated') method = 'updateTemperature';
          if (fragmentName === 'LocationUpdated') method = 'updateLocation';

          const drugIdRaw = eventLog.args.drugId || eventLog.args[0];
          const drugId =
            typeof drugIdRaw === 'object'
              ? drugIdRaw.hash || JSON.stringify(drugIdRaw)
              : String(drugIdRaw);

          return {
            hash: String(eventLog.transactionHash),
            status: TransactionStatus.SUCCESS,
            timestamp: Number(block.timestamp) * 1000,
            from: String(
              eventLog.args.manufacturer ||
                eventLog.args.from ||
                eventLog.args.updatedBy ||
                eventLog.args[1] ||
                ''
            ),
            to: eventLog.args.to ? String(eventLog.args.to) : undefined,
            method,
            drugId,
          } as Transaction;
        })
      );

      return transactions
        .filter((t): t is Transaction => t !== null)
        .sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('❌ [getAllTransactions] Error fetching transactions:', error);
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
