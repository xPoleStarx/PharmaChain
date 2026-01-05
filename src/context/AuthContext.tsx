import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/user';
import { ROLE_ADDRESSES, STORAGE_KEYS } from '../lib/constants';
import { LocalStorageAdapter } from '../services/storage/localStorageAdapter';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = LocalStorageAdapter.get<User>(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentRole(savedUser.role);
    } else {
      // Default to Manufacturer on first load
      const defaultRole = UserRole.MANUFACTURER;
      login(defaultRole);
    }
  }, []);

  const login = (role: UserRole) => {
    const user: User = {
      address: ROLE_ADDRESSES[role],
      role,
      name: role.charAt(0) + role.slice(1).toLowerCase(),
    };

    setCurrentUser(user);
    setCurrentRole(role);
    LocalStorageAdapter.set(STORAGE_KEYS.CURRENT_USER, user);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    LocalStorageAdapter.remove(STORAGE_KEYS.CURRENT_USER);
  };

  const value: AuthContextType = {
    currentUser,
    currentRole,
    login,
    logout,
    isAuthenticated: currentUser !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

