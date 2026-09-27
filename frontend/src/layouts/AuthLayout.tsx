import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#0B1F3A] flex flex-col justify-center overflow-x-hidden">
      <Outlet />
    </div>
  );
};
