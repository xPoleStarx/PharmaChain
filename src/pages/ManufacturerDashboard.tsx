import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBlockchain } from '@/hooks/useBlockchain';
import { ProductList } from '@/components/dashboard/ProductList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { Plus, ArrowRight } from 'lucide-react';
import { Drug } from '@/types/drug';
import { ROLE_ADDRESSES } from '@/lib/constants';
import { UserRole } from '@/types/user';

const ManufacturerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { loading, error, products, fetchMyProducts, registerProduct, transferProduct, clearError } = useBlockchain();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
  });
  const [selectedDrugForTransfer, setSelectedDrugForTransfer] = useState<Drug | null>(null);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // Fetch products on mount and when user changes
  useEffect(() => {
    if (currentUser?.address) {
      fetchMyProducts(currentUser.address);
    }
  }, [currentUser?.address, fetchMyProducts]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser?.address) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name.trim() || !formData.batchNumber.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsRegistering(true);
    clearError();

    try {
      const result = await registerProduct(
        formData.name.trim(),
        formData.batchNumber.trim(),
        currentUser.address,
        4 // Default initial temperature
      );

      if (result.success) {
        toast({
          title: 'Success',
          description: `Product registered successfully! Transaction: ${result.transactionHash.slice(0, 10)}...`,
        });
        setIsDialogOpen(false);
        setFormData({ name: '', batchNumber: '' });
      } else {
        toast({
          title: 'Registration Failed',
          description: result.error || 'Failed to register product',
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
      setIsRegistering(false);
    }
  };

  const handleTransferToDistributor = async () => {
    if (!selectedDrugForTransfer || !currentUser?.address) {
      return;
    }

    setIsTransferring(true);
    clearError();

    const distributorAddress = ROLE_ADDRESSES[UserRole.DISTRIBUTOR];

    try {
      const result = await transferProduct(
        selectedDrugForTransfer.id,
        currentUser.address,
        distributorAddress
      );

      if (result.success) {
        toast({
          title: 'Transfer Successful',
          description: `Product shipped to distributor! Transaction: ${result.transactionHash.slice(0, 10)}...`,
        });
        setIsTransferDialogOpen(false);
        setSelectedDrugForTransfer(null);
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

  const openTransferDialog = (drug: Drug) => {
    setSelectedDrugForTransfer(drug);
    setIsTransferDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Manufacturer Dashboard</h1>
          <p className="text-slate-600">Manage your pharmaceutical products</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Register New Drug
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-900">Register New Drug</DialogTitle>
              <DialogDescription className="text-slate-600">
                Register a new pharmaceutical product on the blockchain. This will create an immutable record.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegister}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Drug Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Paracetamol 500mg"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isRegistering}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    placeholder="e.g., BATCH-2024-001"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    disabled={isRegistering}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isRegistering}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isRegistering} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isRegistering ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Mining Transaction...
                    </>
                  ) : (
                    'Register on Blockchain'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Transfer to Distributor</DialogTitle>
            <DialogDescription className="text-slate-600">
              Transfer ownership of this product to the distributor. This action will be recorded on the blockchain.
            </DialogDescription>
          </DialogHeader>
          {selectedDrugForTransfer && (
            <div className="py-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Product:</span> {selectedDrugForTransfer.name}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">ID:</span> {selectedDrugForTransfer.id}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Current Temperature:</span> {selectedDrugForTransfer.temperature}°C
                </p>
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
            <Button onClick={handleTransferToDistributor} disabled={isTransferring} className="bg-blue-600 hover:bg-blue-700 text-white">
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

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-900">
          {error}
        </div>
      )}

      <ProductList
        drugs={products}
        isLoading={loading}
        onProductClick={(drugId) => {
          window.location.href = `/product/${drugId}`;
        }}
        onTransferClick={openTransferDialog}
        showTransferButton={true}
      />
    </div>
  );
};

export default ManufacturerDashboard;
