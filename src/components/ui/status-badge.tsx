import React from 'react';
import { Badge } from '@/components/UI/badge';
import { cn } from '@/lib/utils';

type StatusType = 'In Transit' | 'Stored' | 'Verified' | 'Registered' | 'Issue' | 'Warning';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusConfig: Record<
  string,
  { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }
> = {
  'In Transit': { variant: 'default', className: 'bg-yellow-500 hover:bg-yellow-600' },
  Stored: { variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
  Verified: { variant: 'default', className: 'bg-blue-500 hover:bg-blue-600' },
  Registered: { variant: 'secondary' },
  Issue: { variant: 'destructive' },
  Warning: { variant: 'destructive', className: 'bg-orange-500 hover:bg-orange-600' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status] || { variant: 'outline' };

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {status}
    </Badge>
  );
};
