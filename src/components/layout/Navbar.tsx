import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/user';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Package, Database } from 'lucide-react';

const roleRoutes: Record<UserRole, string> = {
  [UserRole.MANUFACTURER]: '/manufacturer',
  [UserRole.DISTRIBUTOR]: '/distributor',
  [UserRole.PHARMACY]: '/pharmacy',
  [UserRole.PATIENT]: '/patient',
};

export const Navbar: React.FC = () => {
  const { currentRole, login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole: string) => {
    const role = newRole as UserRole;
    login(role);
    navigate(roleRoutes[role]);
  };

  const getRoleDisplayName = (role: UserRole | null): string => {
    if (!role) return 'Select Role';
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">
                PharmaChain
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/explorer')}
              className="text-slate-700 hover:text-slate-900"
            >
              <Database className="w-4 h-4 mr-2" />
              Block Explorer
            </Button>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Current Role:</span>
            <Select
              value={currentRole || ''}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Role">
                  {getRoleDisplayName(currentRole)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.MANUFACTURER}>Manufacturer</SelectItem>
                <SelectItem value={UserRole.DISTRIBUTOR}>Distributor</SelectItem>
                <SelectItem value={UserRole.PHARMACY}>Pharmacy</SelectItem>
                <SelectItem value={UserRole.PATIENT}>Patient</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </nav>
  );
};

