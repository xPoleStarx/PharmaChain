import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { mockBlockchainService } from '../services/blockchain/mockBlockchainService';
import { RealBlockchainService } from '../services/blockchain/realBlockchainService';
import { IBlockchainService } from '../services/blockchain/blockchainService';

interface BlockchainContextType {
  blockchainService: IBlockchainService;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  // Use environment variable to switch between mock and real blockchain
  // Default to mock mode for backward compatibility
  const useRealBlockchain = import.meta.env.VITE_USE_REAL_BLOCKCHAIN === 'true';
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';
  const providerUrl = import.meta.env.VITE_PROVIDER_URL;

  const blockchainService: IBlockchainService = useMemo(() => {
    if (useRealBlockchain && contractAddress) {
      try {
        return new RealBlockchainService(contractAddress, providerUrl);
      } catch (error) {
        console.error('Failed to initialize RealBlockchainService, falling back to mock:', error);
        return mockBlockchainService;
      }
    }
    return mockBlockchainService;
  }, [useRealBlockchain, contractAddress, providerUrl]);

  const value: BlockchainContextType = {
    blockchainService,
  };

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
};


