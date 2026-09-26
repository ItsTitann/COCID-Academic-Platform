import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { ROUTES } from '../routes/routes.config';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
      <h2 className="text-xl font-semibold text-slate-800 mt-2">Página no encontrada</h2>
      <p className="text-slate-500 text-sm max-w-sm mt-1 mb-6">
        La ruta a la que intentas acceder no existe en la plataforma COCID.
      </p>
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Volver al Inicio</span>
      </Link>
    </div>
  );
};
