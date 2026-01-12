import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/UI/button';
import { Package, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-slate-400" />
          </div>
          <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Lost in the Chain?</h2>
          <p className="text-slate-600 mb-8">
            The product or page you're looking for doesn't exist in our blockchain ledger. It may
            have been moved, deleted, or never registered.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/patient">Verify Product</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
