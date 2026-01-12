import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBlockchain } from '@/hooks/useBlockchain';
import { ProductList } from '@/components/Dashboard/ProductList';
import { ProductCard } from '@/components/Dashboard/ProductCard';
import { Button } from '@/components/UI/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/UI/dialog';
import { Spinner } from '@/components/UI/spinner';
import { useToast } from '@/hooks/useToast';
import { Drug } from '@/types/drug';
import { Thermometer, Truck } from 'lucide-react';
import { ethers } from 'ethers';

const DistributorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { loading, error, products, fetchMyProducts, transferProduct, simulateIoTUpdate, clearError } = useBlockchain();
  const { toast } = useToast();
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [simulatingDrugId, setSimulatingDrugId] = useState<string | null>(null);

  // Fetch products on mount and when user changes
  useEffect(() => {
    if (currentUser?.address) {
      fetchMyProducts(currentUser.address);
    }
  }, [currentUser?.address, fetchMyProducts]);

  const handleTransferToPharmacy = async () => {
    if (!selectedDrug || !currentUser?.address) {
      return;
    }

    setIsTransferring(true);
    clearError();

    try {
      if (!ethers.isAddress(recipientAddress)) {
        throw new Error('Invalid Ethereum address. Please check and try again.');
      }

      const result = await transferProduct(
        selectedDrug.id,
        currentUser.address,
        recipientAddress
      );

      if (result.success) {
        toast({
          title: 'Transfer Successful',
          description: `Product shipped to pharmacy! Transaction: ${result.transactionHash.slice(0, 10)}...`,
        });
        setIsTransferDialogOpen(false);
        setSelectedDrug(null);
        setRecipientAddress('');
      } else {
        toast({
          title: 'Transfer Failed',
          description: result.error || 'Failed to transfer product',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const handleSimulateIoT = async (drugId: string) => {
    if (!currentUser?.address) {
      return;
    }

    setSimulatingDrugId(drugId);
    clearError();

    try {
      const result = await simulateIoTUpdate(drugId, currentUser.address);

      if (result.success) {
        toast({
          title: 'Sensor Update',
          description: 'Temperature reading recorded on blockchain',
        });
      } else {
        toast({
          title: 'Update Failed',
          description: result.error || 'Failed to update temperature',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setSimulatingDrugId(null);
    }
  };

  const openTransferDialog = (drug: Drug) => {
    setSelectedDrug(drug);
    setRecipientAddress('');
    setIsTransferDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Distributor Dashboard</h1>
        <p className="text-slate-600">Manage product transportation and storage</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-900">
          {error}
        </div>
      )}

      {loading && products.length === 0 ? (
        <ProductList drugs={[]} isLoading={true} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((drug) => (
            <div key={drug.id} className="relative">
              <ProductCard
                drug={drug}
                onViewDetails={(drugId) => {
                  window.location.href = `/product/${drugId}`;
                }}
              />
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSimulateIoT(drug.id)}
                  disabled={simulatingDrugId === drug.id}
                >
                  {simulatingDrugId === drug.id ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Thermometer className="w-4 h-4 mr-2" />
                      Simulate Sensor
                    </>
                  )}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => openTransferDialog(drug)}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Ship to Pharmacy
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <ProductList drugs={[]} isLoading={false} />
      )}

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Ship to Pharmacy</DialogTitle>
            <DialogDescription className="text-slate-600">
              Transfer ownership of this product to the pharmacy. This action will be recorded on the blockchain.
            </DialogDescription>
          </DialogHeader>
          {selectedDrug && (
            <div className="py-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Product:</span> {selectedDrug.name}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">ID:</span> {selectedDrug.id}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Current Temperature:</span> {selectedDrug.temperature}°C
                </p>
                <div className="grid gap-2 pt-2 text-slate-900 font-medium">
                  <label htmlFor="recipientAddress" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Recipient Address (Pharmacy Wallet)
                  </label>
                  <input
                    id="recipientAddress"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="0x..."
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    disabled={isTransferring}
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Paste the Sepolia address of the pharmacy you want to ship to.
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTransferDialogOpen(false)}
              disabled={isTransferring}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransferToPharmacy}
              disabled={isTransferring || !recipientAddress.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isTransferring ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Mining Transaction...
                </>
              ) : (
                'Confirm Transfer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DistributorDashboard;

