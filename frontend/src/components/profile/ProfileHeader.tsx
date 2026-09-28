import React, { useState, useRef } from 'react';
import { Camera, CheckCircle2, ShieldCheck, Sparkles, UserCircle, Loader2, AlertCircle } from 'lucide-react';
import type { User } from '../../types/auth.types';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';

interface ProfileHeaderProps {
  user: User | null;
}

const roleBadgeMap: Record<string, { label: string; bg: string; text: string; border: string }> = {
  ADMIN: {
    label: 'Administrador COCID',
    bg: 'bg-rose-500/15',
    text: 'text-rose-700',
    border: 'border-rose-300',
  },
  TEACHER: {
    label: 'Docente / Investigador',
    bg: 'bg-[#2563EB]/15',
    text: 'text-[#2563EB]',
    border: 'border-blue-300',
  },
  STUDENT: {
    label: 'Estudiante COCID',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
  },
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { refreshProfile } = useAuth();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName = user?.nombre && user?.apellido
    ? `${user.nombre} ${user.apellido}`
    : user?.email || 'Usuario Institucional';

  const roleInfo = user?.rol
    ? roleBadgeMap[user.rol] || { label: user.rol, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' }
    : null;

  const getInitials = () => {
    if (user?.nombre && user?.apellido) {
      return `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();
    }
    return 'CO';
  };

  const getFullAvatarUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    return `${base}${url}`;
  };

  const currentAvatar = photoPreview || getFullAvatarUrl(user?.profile?.avatarUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setPhotoMessage(null);

    // Validación de tipos permitidos: JPG, PNG, WEBP
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Formato no válido. Utilice imágenes JPG, PNG o WEBP.');
      return;
    }

    // Validación de tamaño (máximo 4MB)
    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage('La imagen no debe superar los 4MB.');
      return;
    }

    // Preview local temporal
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subida real a PostgreSQL / Servidor
    setIsUploading(true);
    try {
      await profileService.uploadAvatar(file);
      await refreshProfile();
      setPhotoMessage('Fotografía de perfil actualizada correctamente.');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Error al subir la fotografía de perfil';
      setErrorMessage(msg);
      setPhotoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm relative overflow-hidden">
      {/* Fondo decorativo institucional */}
      <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-50/70 to-transparent pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#2563EB]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Contenedor de Fotografía / Avatar */}
        <div className="relative group shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#14B8A6] p-1 shadow-lg shadow-[#2563EB]/20 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[#0B1F3A] rounded-[14px] flex items-center justify-center overflow-hidden text-white relative">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <span className="text-3xl font-extrabold text-[#D4AF37] tracking-wider font-mono">
                    {getInitials()}
                  </span>
                  <UserCircle className="w-4 h-4 text-slate-400" />
                </div>
              )}

              {/* Overlay de Carga */}
              {isUploading && (
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Botón flotante para cambiar foto */}
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            title="Cambiar fotografía"
            className="absolute -bottom-2 -right-2 p-2 bg-[#2563EB] hover:bg-blue-600 disabled:opacity-50 active:scale-95 text-white rounded-xl shadow-md shadow-[#2563EB]/30 transition-all cursor-pointer flex items-center justify-center"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Información del Usuario */}
        <div className="flex-1 text-center sm:text-left space-y-2.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              {fullName}
            </h1>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/30 text-xs font-semibold">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Verificado</span>
            </span>
          </div>

          {/* Badges de Rol y Estado */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-0.5">
            {roleInfo && (
              <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${roleInfo.bg} ${roleInfo.text} ${roleInfo.border}`}>
                {roleInfo.label}
              </span>
            )}

            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cuenta activa</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Acceso Institucional Seguro</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed pt-1">
            Plataforma Inteligente de Apoyo Académico COCID. Gestiona tu información personal y credenciales de acceso institucional.
          </p>

          {/* Mensajes de Estado */}
          {photoMessage && (
            <div className="pt-1 text-xs text-emerald-600 flex items-center justify-center sm:justify-start space-x-1.5 font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{photoMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="pt-1 text-xs text-red-600 flex items-center justify-center sm:justify-start space-x-1.5 font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
