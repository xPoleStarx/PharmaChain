import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBlockchain } from '@/hooks/useBlockchain';
import { ProductList } from '@/components/dashboard/ProductList';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { ROLE_ADDRESSES } from '@/lib/constants';
import { UserRole } from '@/types/user';
import { CheckCircle2 } from 'lucide-react';

const PharmacyDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { loading, error, products, fetchMyProducts, transferProduct, clearError } = useBlockchain();
  const { toast } = useToast();
  const [verifyingId, setVerifyingId] = React.useState<string | null>(null);

  // Fetch products on mount and when user changes
  useEffect(() => {
    if (currentUser?.address) {
      fetchMyProducts(currentUser.address);
    }
  }, [currentUser?.address, fetchMyProducts]);

  const handleVerifyAndSell = async (drugId: string) => {
    if (!currentUser?.address) {
      return;
    }

    setVerifyingId(drugId);
    clearError();

    const patientAddress = ROLE_ADDRESSES[UserRole.PATIENT];

    try {
      const result = await transferProduct(drugId, currentUser.address, patientAddress);

      if (result.success) {
        toast({
          title: 'Product Sold',
          description: 'Product has been verified and sold to patient. Ownership transferred successfully!',
        });
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
      setVerifyingId(null);
    }
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
                  onClick={() => handleVerifyAndSell(drug.id)}
                  disabled={verifyingId === drug.id}
                >
                  {verifyingId === drug.id ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verify & Sell
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <ProductList drugs={[]} isLoading={false} />
      )}
    </div>
  );
};

export default PharmacyDashboard;
