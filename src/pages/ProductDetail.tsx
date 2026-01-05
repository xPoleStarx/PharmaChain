import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlockchain as useBlockchainContext } from '@/context/BlockchainContext';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { HistoryTimeline } from '@/components/dashboard/HistoryTimeline';
import { TemperatureChart } from '@/components/dashboard/TemperatureChart';
import { QRCodeGenerator } from '@/components/dashboard/QRCodeGenerator';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, QrCode } from 'lucide-react';
import { Drug } from '@/types/drug';
import { DrugHistory } from '@/types/drug';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blockchainService } = useBlockchainContext();
  const { toast } = useToast();
  const [drug, setDrug] = useState<Drug | null>(null);
  const [history, setHistory] = useState<DrugHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        toast({
          title: 'Error',
          description: 'Product ID is required',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const foundDrug = await blockchainService.getDrugById(id);
        if (!foundDrug) {
          toast({
            title: 'Product Not Found',
            description: 'The requested product could not be found.',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }

        const drugHistory = await blockchainService.getDrugHistory(id);
        setDrug(foundDrug);
        setHistory(drugHistory);
      } catch (err) {
        toast({
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to load product details',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, blockchainService, navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-slate-700">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!drug) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Product Details</h1>
        <p className="text-slate-600">Complete information and history for {drug.name}</p>
      </div>

      <div className="space-y-6">
        {/* Product Card */}
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <ProductCard
              drug={drug}
              onViewDetails={() => {
                // Already on detail page
              }}
            />
          </div>
          <Button
            onClick={() => setIsQRDialogOpen(true)}
            variant="outline"
            className="mt-4"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Print Label
          </Button>
        </div>

        {/* Temperature Chart */}
        <TemperatureChart history={history} />

        {/* History Timeline */}
        <HistoryTimeline history={history} />
      </div>

      {/* QR Code Dialog */}
      {drug && (
        <QRCodeGenerator
          drugId={drug.id}
          drugName={drug.name}
          isOpen={isQRDialogOpen}
          onClose={() => setIsQRDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;

