import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { PersonalInformation } from '../../components/profile/PersonalInformation';
import { SecurityCard } from '../../components/profile/SecurityCard';
import { ActivityHistory } from '../../components/profile/ActivityHistory';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { changeRequestService } from '../../services/changeRequestService';
import type { ChangeRequestRecord } from '../../types/changeRequest.types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

  const [myRequests, setMyRequests] = useState<ChangeRequestRecord[]>([]);

  const fetchMyRequests = useCallback(async () => {
    if (isAdmin) return;
    try {
      const requests = await changeRequestService.getMyRequests();
      setMyRequests(requests);
    } catch (err) {
      console.error('Error al obtener solicitudes del usuario:', err);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  const pendingProfileRequest = myRequests.find(
    (r) => r.type === 'PROFILE_UPDATE' && r.status === 'PENDING'
  ) || null;

  const pendingPasswordRequest = myRequests.find(
    (r) => r.type === 'PASSWORD_CHANGE' && r.status === 'PENDING'
  ) || null;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* 1. Tarjeta Superior de Identidad y Foto de Perfil */}
      <ProfileHeader user={user} />

      {/* 2. Cuerpo Modular del Perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Información Personal */}
        <div className={isAdmin ? 'lg:col-span-7 space-y-8' : 'lg:col-span-6 space-y-8'}>
          <PersonalInformation 
            user={user} 
            pendingRequest={pendingProfileRequest}
            onRequestSubmitted={fetchMyRequests}
          />
        </div>

        {/* Columna Derecha: Seguridad y Actividad (si es ADMIN) */}
        <div className={isAdmin ? 'lg:col-span-5 space-y-8' : 'lg:col-span-6 space-y-8'}>
          <SecurityCard 
            user={user} 
            pendingRequest={pendingPasswordRequest}
            onRequestSubmitted={fetchMyRequests}
          />
          {isAdmin && <ActivityHistory />}
        </div>
      </div>

      {/* Sello Institucional de Privacidad */}
      <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#14B8A6] shrink-0" />
          <span>Tus datos institucionales están protegidos bajo estándares de privacidad y cifrado académico.</span>
        </div>
        <span className="flex items-center space-x-1 text-[#2563EB] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Plataforma Inteligente COCID</span>
        </span>
      </div>
    </div>
  );
};
