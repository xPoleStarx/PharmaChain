import React, { createContext, useContext, ReactNode } from 'react';
import { mockBlockchainService } from '../services/blockchain/MockBlockchainService';

interface BlockchainContextType {
  blockchainService: typeof mockBlockchainService;
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
  const value: BlockchainContextType = {
    blockchainService: mockBlockchainService,
  };

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
};

