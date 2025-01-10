'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize auth
  useAuth();

  return <>{children}</>;
};

export default AuthProvider;