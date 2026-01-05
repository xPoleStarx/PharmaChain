import { useState, useCallback } from 'react';
import { Drug } from '@/types/drug';
import { TransactionResult } from '@/types/transaction';
import { useBlockchain as useBlockchainContext } from '@/context/BlockchainContext';
import { ROLE_ADDRESSES } from '@/lib/constants';
import { UserRole } from '@/types/user';

interface UseBlockchainReturn {
  loading: boolean;
  error: string | null;
  products: Drug[];
  fetchMyProducts: (ownerAddress: string) => Promise<void>;
  registerProduct: (
    name: string,
    batchNumber: string,
    manufacturerAddress: string,
    initialTemp?: number
  ) => Promise<TransactionResult>;
  transferProduct: (
    drugId: string,
    fromAddress: string,
    toAddress: string
  ) => Promise<TransactionResult>;
  simulateIoTUpdate: (drugId: string, updatedBy: string) => Promise<TransactionResult>;
  clearError: () => void;
}

export const useBlockchain = (): UseBlockchainReturn => {
  const { blockchainService } = useBlockchainContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Drug[]>([]);

  const fetchMyProducts = useCallback(
    async (ownerAddress: string) => {
      setLoading(true);
      setError(null);
      try {
        const drugs = await blockchainService.getAllDrugsByOwner(ownerAddress);
        setProducts(drugs);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(errorMessage);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    },
    [blockchainService]
  );

  const registerProduct = useCallback(
    async (
      name: string,
      batchNumber: string,
      manufacturerAddress: string,
      initialTemp: number = 4
    ): Promise<TransactionResult> => {
      setLoading(true);
      setError(null);
      try {
        // Generate unique ID (UUID-like)
        const drugId = `DRUG-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const result = await blockchainService.registerDrug(
          drugId,
          name,
          batchNumber,
          manufacturerAddress,
          initialTemp,
          'Manufacturing Facility'
        );

        if (result.success) {
          // Refresh the products list
          await fetchMyProducts(manufacturerAddress);
        } else {
          setError(result.error || 'Failed to register product');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to register product';
        setError(errorMessage);
        return {
          success: false,
          transactionHash: '',
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [blockchainService, fetchMyProducts]
  );

  const transferProduct = useCallback(
    async (drugId: string, fromAddress: string, toAddress: string): Promise<TransactionResult> => {
      setLoading(true);
      setError(null);
      try {
        const result = await blockchainService.transferDrug(drugId, fromAddress, toAddress);

        if (result.success) {
          // Refresh the products list for the sender
          await fetchMyProducts(fromAddress);
        } else {
          setError(result.error || 'Failed to transfer product');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to transfer product';
        setError(errorMessage);
        return {
          success: false,
          transactionHash: '',
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [blockchainService, fetchMyProducts]
  );

  const simulateIoTUpdate = useCallback(
    async (drugId: string, updatedBy: string): Promise<TransactionResult> => {
      setError(null);
      try {
        // Simulate realistic temperature: usually 2-8°C, sometimes spike to 10°C
        const random = Math.random();
        let temperature: number;

        if (random < 0.1) {
          // 10% chance of spike to 10°C
          temperature = 10;
        } else if (random < 0.2) {
          // 10% chance of lower range (2-4°C)
          temperature = 2 + Math.random() * 2;
        } else {
          // 80% chance of normal range (4-8°C)
          temperature = 4 + Math.random() * 4;
        }

        // Round to 1 decimal place
        temperature = Math.round(temperature * 10) / 10;

        const result = await blockchainService.updateTemperature(drugId, temperature, updatedBy);

        if (result.success) {
          // Get current owner to refresh their products
          const drug = await blockchainService.getDrugById(drugId);
          if (drug) {
            await fetchMyProducts(drug.currentOwner);
          }
        } else {
          setError(result.error || 'Failed to update temperature');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to simulate IoT update';
        setError(errorMessage);
        return {
          success: false,
          transactionHash: '',
          error: errorMessage,
        };
      }
    },
    [blockchainService, fetchMyProducts]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    products,
    fetchMyProducts,
    registerProduct,
    transferProduct,
    simulateIoTUpdate,
    clearError,
  };
};

