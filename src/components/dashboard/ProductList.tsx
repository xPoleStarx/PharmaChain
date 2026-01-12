import React from 'react';
import { Drug } from '@/types/drug';
import { ProductCard } from './ProductCard';
import { Spinner } from '@/components/UI/spinner';
import { PackageX } from 'lucide-react';

interface ProductListProps {
  drugs: Drug[];
  isLoading?: boolean;
  onProductClick?: (drugId: string) => void;
  onTransferClick?: (drug: Drug) => void;
  showTransferButton?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  drugs,
  isLoading = false,
  onProductClick,
  onTransferClick,
  showTransferButton = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
        <span className="ml-3 text-slate-700">Loading products...</span>
      </div>
    );
  }

  if (drugs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <PackageX className="w-16 h-16 text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No products found</h3>
        <p className="text-slate-600 max-w-md">
          There are no products in your inventory. Register a new product to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {drugs.map((drug) => (
        <ProductCard
          key={drug.id}
          drug={drug}
          onViewDetails={onProductClick}
          onTransferClick={onTransferClick}
          showTransferButton={showTransferButton}
        />
      ))}
    </div>
  );
};


