import React, { useState, useEffect } from 'react';
import { useBlockchain } from '@/hooks/useBlockchain';
import { useBlockchain as useBlockchainContext } from '@/context/BlockchainContext';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { HistoryTimeline } from '@/components/dashboard/HistoryTimeline';
import { TemperatureChart } from '@/components/dashboard/TemperatureChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, QrCode, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Drug } from '@/types/drug';
import { DrugHistory } from '@/types/drug';
import { TEMPERATURE_THRESHOLDS } from '@/lib/constants';

const PatientView: React.FC = () => {
  const { blockchainService } = useBlockchainContext();
  const { toast } = useToast();
  const [productId, setProductId] = useState('');
  const [drug, setDrug] = useState<Drug | null>(null);
  const [history, setHistory] = useState<DrugHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [trustScore, setTrustScore] = useState<number | null>(null);

  // Calculate trust score based on temperature violations
  const calculateTrustScore = (history: DrugHistory[]): number => {
    const tempEvents = history.filter(
      (event) => event.eventType === 'TEMPERATURE_UPDATED' && event.temperature !== undefined
    );

    if (tempEvents.length === 0) return 100;

    const violations = tempEvents.filter(
      (event) =>
        event.temperature! < TEMPERATURE_THRESHOLDS.MIN ||
        event.temperature! > TEMPERATURE_THRESHOLDS.MAX
    ).length;

    const violationRate = violations / tempEvents.length;
    return Math.round((1 - violationRate) * 100);
  };

  const handleVerify = async () => {
    if (!productId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a product ID',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setDrug(null);
    setHistory([]);
    setTrustScore(null);

    try {
      const foundDrug = await blockchainService.getDrugById(productId.trim());
      if (!foundDrug) {
        toast({
          title: 'Product Not Found',
          description: 'No product found with this ID. Please check and try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const drugHistory = await blockchainService.getDrugHistory(productId.trim());
      const score = calculateTrustScore(drugHistory);

      setDrug(foundDrug);
      setHistory(drugHistory);
      setTrustScore(score);

      toast({
        title: 'Product Verified',
        description: `Product authenticity verified. Trust Score: ${score}%`,
      });
    } catch (err) {
      toast({
        title: 'Verification Failed',
        description: err instanceof Error ? err.message : 'Failed to verify product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateScan = async () => {
    try {
      // Get all transactions to find a drug ID
      const transactions = await blockchainService.getAllTransactions();
      
      // Find a drug ID from transactions
      const drugTransaction = transactions.find(t => t.drugId);
      
      if (!drugTransaction?.drugId) {
        toast({
          title: 'No Products Available',
          description: 'No products found in the system. Please register a product first.',
          variant: 'destructive',
        });
        return;
      }

      // Use the found drug ID
      const demoId = drugTransaction.drugId;
      setProductId(demoId);
      
      // Auto-verify after a short delay
      setTimeout(() => {
        handleVerify();
      }, 100);
    } catch (err) {
      toast({
        title: 'Demo Scan Failed',
        description: 'Could not simulate scan. Please enter a product ID manually.',
        variant: 'destructive',
      });
    }
  };

  const getTrustScoreColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrustScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Product Verification Portal</h1>
        <p className="text-slate-600">Verify the authenticity and quality of pharmaceutical products</p>
      </div>

      {/* Search Section */}
      <Card className="mb-6 bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Enter Product ID</CardTitle>
          <CardDescription className="text-slate-600">
            Scan the QR code or enter the product ID manually to verify authenticity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Enter Product ID to Verify"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button onClick={handleVerify} disabled={loading || !productId.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? (
                <>
                  <Search className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Verify
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleSimulateScan} disabled={loading}>
              <QrCode className="w-4 h-4 mr-2" />
              Simulate Scan (Demo)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {drug && (
        <div className="space-y-6">
          {/* Trust Score */}
          <Card className="bg-white border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="w-5 h-5" />
                Trust Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`w-24 h-24 rounded-full ${getTrustScoreColor(trustScore || 0)} flex items-center justify-center text-white text-2xl font-bold`}>
                  {trustScore}%
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-slate-900">{getTrustScoreLabel(trustScore || 0)}</h3>
                  <p className="text-sm text-slate-700">
                    {trustScore === 100
                      ? 'No temperature violations detected. Product maintained safe conditions throughout the supply chain.'
                      : trustScore && trustScore >= 70
                      ? 'Minor temperature variations detected. Product is likely safe.'
                      : 'Temperature violations detected. Product may have been exposed to unsafe conditions.'}
                  </p>
                  {trustScore && trustScore < 100 && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Review temperature history for details</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Card */}
          <ProductCard
            drug={drug}
            onViewDetails={(drugId) => {
              window.location.href = `/product/${drugId}`;
            }}
          />

          {/* Temperature Chart */}
          <TemperatureChart history={history} />

          {/* History Timeline */}
          <HistoryTimeline history={history} />
        </div>
      )}
    </div>
  );
};

export default PatientView;
