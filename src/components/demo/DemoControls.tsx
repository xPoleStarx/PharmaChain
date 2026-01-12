import React, { useState } from 'react';
import { Button } from '@/components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';
import { useToast } from '@/hooks/useToast';
import { Settings, RotateCcw, Database, AlertTriangle } from 'lucide-react';
import { seedDemoData, resetSystem } from '@/services/blockchain/seedData';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/user';

export const DemoControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleReset = () => {
    setIsResetting(true);
    try {
      resetSystem();
      login(UserRole.MANUFACTURER); // Reset to default role
      toast({
        title: 'System Reset',
        description: 'All data has been cleared. Please refresh the page.',
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: 'Reset Failed',
        description: 'An error occurred while resetting the system.',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleSeedData = () => {
    setIsSeeding(true);
    try {
      seedDemoData();
      toast({
        title: 'Demo Data Seeded',
        description: 'Demo data has been successfully loaded. Refresh to see the products.',
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: 'Seeding Failed',
        description: 'An error occurred while seeding demo data.',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 bg-blue-600 hover:bg-blue-700 text-white"
        size="icon"
        variant="default"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Demo / Dev Tools</DialogTitle>
            <DialogDescription className="text-slate-600">
              Development and demonstration tools for managing the demo environment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Warning</p>
                  <p>
                    These actions will modify the blockchain data. Use with caution during
                    demonstrations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2 text-slate-900">Seed Demo Data</h3>
                <p className="text-sm text-slate-700 mb-3">
                  Instantly populate the blockchain with 3 sample products:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Aspirin (Registered by Manufacturer)</li>
                    <li>Vaccine-X (In Transit by Distributor, with temperature data)</li>
                    <li>Antibiotic (Verified at Pharmacy)</li>
                  </ul>
                </p>
                <Button
                  onClick={handleSeedData}
                  disabled={isSeeding || isResetting}
                  className="w-full"
                  variant="outline"
                >
                  <Database className="w-4 h-4 mr-2" />
                  {isSeeding ? 'Seeding...' : 'Seed Demo Data'}
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-slate-900">Reset System</h3>
                <p className="text-sm text-slate-700 mb-3">
                  Clear all blockchain data and reset to initial state. This will remove all
                  products, transactions, and history.
                </p>
                <Button
                  onClick={handleReset}
                  disabled={isResetting || isSeeding}
                  className="w-full"
                  variant="destructive"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {isResetting ? 'Resetting...' : 'Reset System'}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
