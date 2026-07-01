import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { NotificationProvider } from '../context/NotificationContext';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-background dark:bg-gray-900">
        <Navbar />
        <div className="flex">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          <main
            className={`flex-1 pt-16 transition-all duration-300 ${
              collapsed ? 'ml-16' : 'ml-60'
            }`}
          >
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
