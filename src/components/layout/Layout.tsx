import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { DemoControls } from '@/components/Demo/DemoControls';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {!isLandingPage && <Navbar />}
      <main className={isLandingPage ? '' : 'container mx-auto px-4 py-8'}>
        <Outlet />
      </main>
      {!isLandingPage && <DemoControls />}
    </div>
  );
};
