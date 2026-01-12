import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBlockchain } from '@/hooks/useBlockchain';
import { ProductList } from '@/components/Dashboard/ProductList';
import { ProductCard } from '@/components/Dashboard/ProductCard';
import { Button } from '@/components/UI/button';
import { Spinner } from '@/components/UI/spinner';
import { useToast } from '@/hooks/useToast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/UI/dialog';
import { Label } from '@/components/UI/label';
import { Input } from '@/components/UI/input';
import { CheckCircle2 } from 'lucide-react';
import { ethers } from 'ethers';
import { Drug } from '@/types/drug';

const PharmacyDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { loading, error, products, fetchMyProducts, transferProduct, clearError } = useBlockchain();
  const { toast } = useToast();
  const [selectedDrug, setSelectedDrug] = React.useState<Drug | null>(null);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = React.useState(false);
  const [patientAddress, setPatientAddress] = React.useState('');
  const [isSelling, setIsSelling] = React.useState(false);

  // Fetch products on mount and when user changes
  useEffect(() => {
    if (currentUser?.address) {
      fetchMyProducts(currentUser.address);
    }
  }, [currentUser?.address, fetchMyProducts]);

  const handleVerifyAndSell = async () => {
    if (!selectedDrug || !currentUser?.address) {
      return;
    }

    setIsSelling(true);
    clearError();

    try {
      if (!ethers.isAddress(patientAddress)) {
        throw new Error('Invalid Ethereum address. Please check and try again.');
      }

      const result = await transferProduct(selectedDrug.id, currentUser.address, patientAddress);

      if (result.success) {
        toast({
          title: 'Product Sold',
          description: 'Product has been verified and sold to patient. Ownership transferred successfully!',
        });
        setIsSaleDialogOpen(false);
        setSelectedDrug(null);
        setPatientAddress('');
      } else {
        toast({
          title: 'Sale Failed',
          description: result.error || 'Failed to sell product',
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
      setIsSelling(false);
    }
  };

  const openSaleDialog = (drug: Drug) => {
    setSelectedDrug(drug);
    setPatientAddress('');
    setIsSaleDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Pharmacy Dashboard</h1>
        <p className="text-slate-600">Verify and sell pharmaceutical products</p>
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
                  // Navigate to product detail page
                  window.location.href = `/product/${drugId}`;
                }}
              />
              <div className="mt-2">
                <Button
                  variant="default"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => openSaleDialog(drug)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verify & Sell
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <ProductList drugs={[]} isLoading={false} />
      )}

      {/* Sale Dialog */}
      <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Verify & Sell to Patient</DialogTitle>
            <DialogDescription className="text-slate-600">
              Complete the final sale of this pharmaceutical product to the patient.
            </DialogDescription>
          </DialogHeader>
          {selectedDrug && (
            <div className="py-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Product:</span> {selectedDrug.name}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Batch:</span> {selectedDrug.batchNumber}
                </p>
                <div className="grid gap-2 pt-4">
                  <Label htmlFor="patientAddress">Patient Wallet Address</Label>
                  <Input
                    id="patientAddress"
                    placeholder="0x..."
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    disabled={isSelling}
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Enter the Sepolia address of the patient receiving the medication.
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSaleDialogOpen(false)}
              disabled={isSelling}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyAndSell}
              disabled={isSelling || !patientAddress.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSelling ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                'Finalize Sale'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PharmacyDashboard;

