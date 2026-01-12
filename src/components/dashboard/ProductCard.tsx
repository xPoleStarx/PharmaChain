import React from 'react';
import { Drug } from '@/types/drug';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { StatusBadge } from '@/components/UI/status-badge';
import { Thermometer, MapPin, Package, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  drug: Drug;
  onViewDetails?: (drugId: string) => void;
  onTransferClick?: (drug: Drug) => void;
  showTransferButton?: boolean;
}

const truncateAddress = (address: string, start: number = 6, end: number = 4): string => {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

const truncateId = (id: string, maxLength: number = 12): string => {
  if (id.length <= maxLength) return id;
  return `${id.slice(0, maxLength)}...`;
};

const getStatusFromLocation = (location: string): string => {
  if (location.toLowerCase().includes('transit')) return 'In Transit';
  if (location.toLowerCase().includes('warehouse') || location.toLowerCase().includes('stored'))
    return 'Stored';
  if (location.toLowerCase().includes('pharmacy')) return 'Verified';
  return 'Registered';
};

const getTemperatureColor = (temp: number): string => {
  if (temp > 25) return 'text-red-600 font-semibold';
  if (temp > 8) return 'text-orange-600';
  if (temp < 2) return 'text-blue-600';
  return 'text-green-600';
};

export const ProductCard: React.FC<ProductCardProps> = ({
  drug,
  onViewDetails,
  onTransferClick,
  showTransferButton = false,
}) => {
  const status = getStatusFromLocation(drug.location);
  const tempColor = getTemperatureColor(drug.temperature);

  return (
    <Card className="hover:shadow-md transition-shadow bg-white border border-slate-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1 text-slate-900 font-semibold">{drug.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-slate-600">
              <Package className="w-4 h-4" />
              <span className="font-mono text-xs">{truncateId(drug.id)}</span>
            </CardDescription>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Owner:</span>
          <span className="font-mono text-xs text-slate-700">
            {truncateAddress(drug.currentOwner)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Thermometer className={cn('w-4 h-4', tempColor)} />
          <span className={cn('font-semibold', tempColor)}>{drug.temperature}°C</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 truncate">{drug.location}</span>
        </div>
        <div className="text-xs text-slate-600">Batch: {drug.batchNumber}</div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={() => onViewDetails?.(drug.id)}>
            View Details
          </Button>
          {showTransferButton && onTransferClick && (
            <Button
              variant="default"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onTransferClick(drug)}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Transfer
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
