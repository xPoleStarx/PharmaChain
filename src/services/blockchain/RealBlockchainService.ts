import { ethers } from 'ethers';
import { IBlockchainService } from './BlockchainService';
import { Drug, DrugHistory, TransactionResult } from '../../types';

// Contract ABI - Will be generated after compilation
// For now, we'll define it inline
const PHARMACHAIN_ABI = [
  'function registerDrug(string memory id, string memory name, string memory batchNumber, int256 initialTemperature, string memory initialLocation) public returns (bytes32)',
  'function transferDrug(string memory drugId, address to) public returns (bytes32)',
  'function updateTemperature(string memory drugId, int256 temperature) public returns (bytes32)',
  'function updateLocation(string memory drugId, string memory location) public returns (bytes32)',
  'function getDrug(string memory drugId) public view returns (tuple(string id, string name, string batchNumber, address currentOwner, int256 temperature, string location, uint256 registeredAt, address registeredBy))',
  'function getAllDrugHistory(string memory drugId) public view returns (tuple(string drugId, uint256 timestamp, uint8 eventType, address fromAddress, address toAddress, int256 temperature, string location, bytes32 transactionHash)[] memory)',
  'function authorizedManufacturers(address) public view returns (bool)',
  'event DrugRegistered(string indexed drugId, address indexed manufacturer, string name, bytes32 transactionHash)',
  'event DrugTransferred(string indexed drugId, address indexed from, address indexed to, bytes32 transactionHash)',
  'event TemperatureUpdated(string indexed drugId, int256 temperature, address updatedBy, bytes32 transactionHash)',
  'event LocationUpdated(string indexed drugId, string location, address updatedBy, bytes32 transactionHash)',
];

/**
 * Real blockchain service implementation using Solidity smart contracts
 * Connects to deployed PharmaChain contract via ethers.js
 */
export class RealBlockchainService implements IBlockchainService {
  private contract: ethers.Contract;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor(contractAddress: string, providerUrl?: string) {
    // Initialize provider
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      // Browser environment with MetaMask
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    } else if (providerUrl) {
      // Custom provider URL
      this.provider = new ethers.JsonRpcProvider(providerUrl);
    } else {
      // Default to localhost
      this.provider = new ethers.JsonRpcProvider('http://localhost:8545');
    }

    // Initialize contract (read-only for now, signer will be set when needed)
    this.contract = new ethers.Contract(contractAddress, PHARMACHAIN_ABI, this.provider);
  }

  /**
   * Get signer for transactions
   */
  private async getSigner(): Promise<ethers.Signer> {
    if (!this.signer && this.provider) {
      if (this.provider instanceof ethers.BrowserProvider) {
        this.signer = await this.provider.getSigner();
      } else {
        // For local development, use first account
        const accounts = await this.provider.listAccounts();
        if (accounts.length > 0) {
          this.signer = accounts[0];
        } else {
          throw new Error('No accounts available');
        }
      }
    }
    if (!this.signer) {
      throw new Error('Unable to get signer');
    }
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
      const signer = await this.getSigner();
      const contractWithSigner = this.contract.connect(signer) as ethers.Contract;

      // Convert temperature to int256 (multiply by 10 for decimals)
      const tempScaled = Math.round(initialTemperature * 10);

      const tx = await contractWithSigner.registerDrug(
        id,
        name,
        batchNumber,
        tempScaled,
        initialLocation
      );

      const receipt = await tx.wait();
      const txHash = receipt.hash;

      return {
        success: true,
        transactionHash: txHash,
        message: 'Drug registered successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        transactionHash: '',
        error: error.reason || error.message || 'Failed to register drug',
      };
    }
  }

  async transferDrug(
    drugId: string,
    fromAddress: string,
    toAddress: string
  ): Promise<TransactionResult> {
    try {
      const signer = await this.getSigner();
      const contractWithSigner = this.contract.connect(signer) as ethers.Contract;

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
        error: error.reason || error.message || 'Failed to transfer drug',
      };
    }
  }

  async updateTemperature(
    drugId: string,
    temperature: number,
    updatedBy: string
  ): Promise<TransactionResult> {
    try {
      const signer = await this.getSigner();
      const contractWithSigner = this.contract.connect(signer) as ethers.Contract;

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
        error: error.reason || error.message || 'Failed to update temperature',
      };
    }
  }

  async updateLocation(
    drugId: string,
    location: string,
    updatedBy: string
  ): Promise<TransactionResult> {
    try {
      const signer = await this.getSigner();
      const contractWithSigner = this.contract.connect(signer) as ethers.Contract;

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
        error: error.reason || error.message || 'Failed to update location',
      };
    }
  }

  async getDrugById(drugId: string): Promise<Drug | null> {
    try {
      const drugData = await this.contract.getDrug(drugId);

      return {
        id: drugData.id,
        name: drugData.name,
        batchNumber: drugData.batchNumber,
        currentOwner: drugData.currentOwner,
        temperature: Number(drugData.temperature) / 10, // Convert back from scaled
        location: drugData.location,
        registeredAt: Number(drugData.registeredAt) * 1000, // Convert to milliseconds
        registeredBy: drugData.registeredBy,
      };
    } catch (error) {
      return null;
    }
  }

  async getAllDrugsByOwner(ownerAddress: string): Promise<Drug[]> {
    // Note: Solidity doesn't have built-in filtering
    // This would require emitting events and filtering client-side
    // Or implementing a mapping(address => string[]) in the contract
    // For MVP, return empty array - can be enhanced later
    console.warn('getAllDrugsByOwner not fully implemented for RealBlockchainService');
    return [];
  }

  async getDrugHistory(drugId: string): Promise<DrugHistory[]> {
    try {
      const history = await this.contract.getAllDrugHistory(drugId);

      return history.map((h: any) => ({
        drugId: h.drugId,
        timestamp: Number(h.timestamp) * 1000, // Convert to milliseconds
        eventType: this.mapEventType(Number(h.eventType)),
        fromAddress:
          h.fromAddress && h.fromAddress !== ethers.ZeroAddress ? h.fromAddress : undefined,
        toAddress:
          h.toAddress && h.toAddress !== ethers.ZeroAddress ? h.toAddress : undefined,
        temperature: h.temperature ? Number(h.temperature) / 10 : undefined,
        location: h.location || undefined,
        transactionHash: h.transactionHash,
      }));
    } catch (error) {
      return [];
    }
  }

  async getAllTransactions(): Promise<any[]> {
    // Query events from blockchain
    // This would require filtering events from contract
    // For MVP, return empty array - can be enhanced later
    console.warn('getAllTransactions not fully implemented for RealBlockchainService');
    return [];
  }

  private mapEventType(eventType: number): DrugHistory['eventType'] {
    switch (eventType) {
      case 0:
        return 'REGISTERED';
      case 1:
        return 'TRANSFERRED';
      case 2:
        return 'TEMPERATURE_UPDATED';
      case 3:
        return 'LOCATION_UPDATED';
      default:
        return 'REGISTERED';
    }
  }
}
