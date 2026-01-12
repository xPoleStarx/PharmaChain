// QUICK FIX: Add Connect Wallet Button to Navbar
// File: src/components/layout/Navbar.tsx
// Replace the entire file with this updated version

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBlockchain } from '@/context/BlockchainContext';
import { UserRole } from '@/types/user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import { Button } from '@/components/UI/button';
import { Package, Database, Wallet, CheckCircle2 } from 'lucide-react';

const roleRoutes: Record<UserRole, string> = {
  [UserRole.MANUFACTURER]: '/manufacturer',
  [UserRole.DISTRIBUTOR]: '/distributor',
  [UserRole.PHARMACY]: '/pharmacy',
  [UserRole.PATIENT]: '/patient',
};

export const Navbar: React.FC = () => {
  const { currentRole, login, setWalletAddress: updateAuthWalletAddress } = useAuth();
  const { blockchainService } = useBlockchain();
  const navigate = useNavigate();

  // Wallet connection state
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          updateAuthWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Connect wallet using blockchain service
      const address = await blockchainService.connectWallet();
      setWalletAddress(address);

      // Update AuthContext with the connected wallet address
      updateAuthWalletAddress(address);

      console.log('✅ Wallet connected:', address);

      // Optional: Show success message
      // You can integrate with toast notification here
    } catch (error: any) {
      console.error('❌ Failed to connect wallet:', error);
      setConnectionError(error.message || 'Failed to connect wallet');

      // Show user-friendly error
      if (error.message?.includes('MetaMask')) {
        alert(
          'Please install MetaMask extension to connect your wallet.\n\nVisit: https://metamask.io/download/'
        );
      } else {
        alert(`Failed to connect wallet: ${error.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
    updateAuthWalletAddress('');
    console.log('Wallet disconnected');
  };

  const handleRoleChange = (newRole: string) => {
    const role = newRole as UserRole;
    login(role);
    navigate(roleRoutes[role]);
  };

  const getRoleDisplayName = (role: UserRole | null): string => {
    if (!role) return 'Select Role';
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">PharmaChain</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/explorer')}
              className="text-slate-700 hover:text-slate-900"
            >
              <Database className="w-4 h-4 mr-2" />
              Block Explorer
            </Button>
          </div>

          {/* Wallet Connection + Role Switcher */}
          <div className="flex items-center gap-4">
            {/* WALLET CONNECTION BUTTON */}
            {!walletAddress ? (
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                size="default"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Connected Wallet Display */}
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-mono font-medium">
                    {formatAddress(walletAddress)}
                  </span>
                </div>
                {/* Disconnect Button */}
                <Button
                  onClick={handleDisconnectWallet}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Disconnect
                </Button>
              </div>
            )}

            {/* Role Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Current Role:</span>
              <Select value={currentRole || ''} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Role">
                    {getRoleDisplayName(currentRole)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.MANUFACTURER}>Manufacturer</SelectItem>
                  <SelectItem value={UserRole.DISTRIBUTOR}>Distributor</SelectItem>
                  <SelectItem value={UserRole.PHARMACY}>Pharmacy</SelectItem>
                  <SelectItem value={UserRole.PATIENT}>Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Connection Error Message */}
        {connectionError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">⚠️ {connectionError}</p>
          </div>
        )}
      </div>
    </nav>
  );
};
