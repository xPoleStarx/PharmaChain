import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain as useBlockchainContext } from '@/context/BlockchainContext';
import { Transaction, TransactionStatus } from '@/types/transaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Button } from '@/components/UI/button';
import { Spinner } from '@/components/UI/spinner';
import { Database, CheckCircle2, XCircle, Clock, Package, Truck, Thermometer, MapPin, RefreshCw, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const BlockExplorer: React.FC = () => {
  const navigate = useNavigate();
  const { blockchainService } = useBlockchainContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [knownTransactionHashes, setKnownTransactionHashes] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadTransactions = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const allTransactions = await blockchainService.getAllTransactions();
      // Sort by timestamp (newest first)
      const sorted = allTransactions.sort((a, b) => b.timestamp - a.timestamp);
      
      // Track new transactions
      setKnownTransactionHashes(prev => {
        const currentHashes = new Set(sorted.map(tx => tx.hash));
        const newHashes = new Set(
          Array.from(currentHashes).filter(hash => !prev.has(hash))
        );
        
        // If there are new transactions and we're not in initial load, show notification
        if (newHashes.size > 0 && prev.size > 0 && showRefreshing) {
          // Visual feedback: scroll to top to show new transactions
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        }
        
        return currentHashes;
      });
      
      setTransactions(sorted);
      setLastUpdateTime(new Date());
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [blockchainService]);

  useEffect(() => {
    // Initial load
    loadTransactions();

    // Set up polling: check for new transactions every 2 seconds
    intervalRef.current = setInterval(() => {
      loadTransactions(true);
    }, 2000);

    // Refresh when window gains focus (user switches back to tab)
    const handleFocus = () => {
      loadTransactions(true);
    };
    window.addEventListener('focus', handleFocus);

    // Listen for storage changes (when transactions are added from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      // Check if ledger was updated
      if (e.key === 'pharmachain_ledger' && e.newValue) {
        loadTransactions(true);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadTransactions]);

  const handleManualRefresh = () => {
    loadTransactions(true);
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case TransactionStatus.FAILED:
        return <XCircle className="w-4 h-4 text-red-600" />;
      case TransactionStatus.PENDING:
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>;
      case TransactionStatus.FAILED:
        return <Badge variant="destructive">Failed</Badge>;
      case TransactionStatus.PENDING:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'registerDrug':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'transferDrug':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'updateTemperature':
        return <Thermometer className="w-4 h-4 text-orange-600" />;
      case 'updateLocation':
        return <MapPin className="w-4 h-4 text-green-600" />;
      default:
        return <Database className="w-4 h-4 text-slate-600" />;
    }
  };

  const getMethodLabel = (method: string): string => {
    switch (method) {
      case 'registerDrug':
        return 'Register Drug';
      case 'transferDrug':
        return 'Transfer Drug';
      case 'updateTemperature':
        return 'Update Temperature';
      case 'updateLocation':
        return 'Update Location';
      default:
        return method;
    }
  };

  const truncateHash = (hash: string, start: number = 10, end: number = 8): string => {
    if (hash.length <= start + end) return hash;
    return `${hash.slice(0, start)}...${hash.slice(-end)}`;
  };

  const truncateAddress = (address: string, start: number = 6, end: number = 4): string => {
    if (address.length <= start + end) return address;
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-slate-700">Loading blockchain transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-slate-900">Block Explorer</h1>
            <p className="text-slate-600">View all transactions recorded on the blockchain</p>
            <p className="text-xs text-slate-500 mt-1">
              Last updated: {format(lastUpdateTime, 'HH:mm:ss')} • Auto-refreshes every 2 seconds
            </p>
          </div>
          <Button
            onClick={handleManualRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white border border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-slate-900">{transactions.length}</p>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Successful</p>
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter((t) => t.status === TransactionStatus.SUCCESS).length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {transactions.filter((t) => t.status === TransactionStatus.FAILED).length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">All Transactions</CardTitle>
          <CardDescription className="text-slate-600">
            Complete history of all blockchain transactions, sorted by timestamp (newest first)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Database className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Transactions Found</h3>
              <p className="text-slate-600 max-w-md">
                There are no transactions recorded on the blockchain yet. Start by registering a product or performing
                transfers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx, index) => {
                const isNew = index < 3; // Highlight top 3 newest transactions
                return (
                  <div
                    key={`${tx.hash}-${index}`}
                    className={cn(
                      'p-4 rounded-lg border transition-all duration-300',
                      tx.status === TransactionStatus.SUCCESS
                        ? 'bg-green-50 border-green-200 hover:bg-green-100'
                        : tx.status === TransactionStatus.FAILED
                        ? 'bg-red-50 border-red-200 hover:bg-red-100'
                        : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                      isNew && 'ring-2 ring-blue-400 ring-opacity-50'
                    )}
                  >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getMethodIcon(tx.method)}
                        <h3 className="font-semibold text-slate-900">{getMethodLabel(tx.method)}</h3>
                        {getStatusBadge(tx.status)}
                        {isNew && (
                          <Badge className="bg-blue-500 hover:bg-blue-600 text-white animate-pulse">
                            New
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-slate-600 mb-1">Transaction Hash</p>
                          <p className="font-mono text-slate-900 break-all">{truncateHash(tx.hash)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 mb-1">Timestamp</p>
                          <p className="text-slate-900">{format(new Date(tx.timestamp), 'PPpp')}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 mb-1">From</p>
                          <p className="font-mono text-slate-900">{truncateAddress(tx.from)}</p>
                        </div>
                        {tx.to && (
                          <div>
                            <p className="text-slate-600 mb-1">To</p>
                            <p className="font-mono text-slate-900">{truncateAddress(tx.to)}</p>
                          </div>
                        )}
                        {tx.drugId && (
                          <div className="md:col-span-2">
                            <p className="text-slate-600 mb-1">Product ID</p>
                            <p className="font-mono text-slate-900 break-all">{tx.drugId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">{getStatusIcon(tx.status)}</div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockExplorer;

