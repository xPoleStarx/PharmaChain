import React from 'react';
import { DrugHistory } from '@/types/drug';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import {
  Package,
  Truck,
  Thermometer,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface HistoryTimelineProps {
  history: DrugHistory[];
}

const getEventIcon = (eventType: DrugHistory['eventType']) => {
  switch (eventType) {
    case 'REGISTERED':
      return <Package className="w-5 h-5 text-blue-600" />;
    case 'TRANSFERRED':
      return <Truck className="w-5 h-5 text-purple-600" />;
    case 'TEMPERATURE_UPDATED':
      return <Thermometer className="w-5 h-5 text-orange-600" />;
    case 'LOCATION_UPDATED':
      return <MapPin className="w-5 h-5 text-green-600" />;
    default:
      return <CheckCircle2 className="w-5 h-5 text-slate-600" />;
  }
};

const getEventLabel = (event: DrugHistory): string => {
  switch (event.eventType) {
    case 'REGISTERED':
      return 'Product Registered';
    case 'TRANSFERRED':
      return `Transferred ${event.fromAddress ? 'from' : ''} ${event.toAddress ? 'to' : ''}`;
    case 'TEMPERATURE_UPDATED':
      return `Temperature Updated: ${event.temperature}°C`;
    case 'LOCATION_UPDATED':
      return `Location Updated: ${event.location}`;
    default:
      return 'Event Recorded';
  }
};

const truncateAddress = (address?: string, start: number = 6, end: number = 4): string => {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ history }) => {
  // Sort history by timestamp (oldest first)
  const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);

  if (sortedHistory.length === 0) {
    return (
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Product History</CardTitle>
          <CardDescription className="text-slate-600">Complete journey from manufacturer to patient</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-500">
            No history available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">Product History</CardTitle>
        <CardDescription className="text-slate-600">Complete journey from manufacturer to patient</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-6">
            {sortedHistory.map((event, index) => {
              const isLast = index === sortedHistory.length - 1;
              return (
                <div key={`${event.timestamp}-${index}`} className="relative flex gap-4">
                  {/* Icon circle */}
                  <div
                    className={cn(
                      'relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2',
                      event.eventType === 'REGISTERED' && 'border-blue-600',
                      event.eventType === 'TRANSFERRED' && 'border-purple-600',
                      event.eventType === 'TEMPERATURE_UPDATED' && 'border-orange-600',
                      event.eventType === 'LOCATION_UPDATED' && 'border-green-600'
                    )}
                  >
                    {getEventIcon(event.eventType)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">
                            {getEventLabel(event)}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {event.eventType.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">
                          {format(new Date(event.timestamp), 'PPpp')}
                        </p>
                        {event.fromAddress && (
                          <p className="text-xs text-slate-600">
                            From: <span className="font-mono text-slate-700">{truncateAddress(event.fromAddress)}</span>
                          </p>
                        )}
                        {event.toAddress && (
                          <p className="text-xs text-slate-600">
                            To: <span className="font-mono text-slate-700">{truncateAddress(event.toAddress)}</span>
                          </p>
                        )}
                        {event.location && (
                          <p className="text-xs text-slate-600 mt-1">
                            Location: {event.location}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-2 font-mono">
                          TX: {truncateAddress(event.transactionHash, 8, 6)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


