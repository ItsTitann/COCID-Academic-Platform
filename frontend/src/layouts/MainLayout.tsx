import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from '../components/layout/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Barra lateral fija en el viewport */}
      <div className="sticky top-0 h-screen shrink-0 z-20">
        <Sidebar />
      </div>

      {/* Contenedor principal con flujo y scroll natural de la página */}
      <div className="flex flex-col flex-1 min-w-0 min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
