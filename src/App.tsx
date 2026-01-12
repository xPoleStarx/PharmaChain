import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { BlockchainProvider } from './context/BlockchainContext';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <BlockchainProvider>
        <RouterProvider router={router} />
        <Toaster />
      </BlockchainProvider>
    </AuthProvider>
  );
}

export default App;
