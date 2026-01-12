import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import DistributorDashboard from './pages/DistributorDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';
import PatientView from './pages/PatientView';
import ProductDetail from './pages/ProductDetail';
import BlockExplorer from './pages/BlockExplorer';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'manufacturer',
        element: <ManufacturerDashboard />,
      },
      {
        path: 'distributor',
        element: <DistributorDashboard />,
      },
      {
        path: 'pharmacy',
        element: <PharmacyDashboard />,
      },
      {
        path: 'patient',
        element: <PatientView />,
      },
      {
        path: 'product/:id',
        element: <ProductDetail />,
      },
      {
        path: 'explorer',
        element: <BlockExplorer />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);


