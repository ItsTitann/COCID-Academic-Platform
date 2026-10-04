import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  Clock,
  Send
} from 'lucide-react';
import type { User } from '../../types/auth.types';
import type { ChangeRequestRecord } from '../../types/changeRequest.types';
import { profileService } from '../../services/profileService';
import { changeRequestService } from '../../services/changeRequestService';

interface SecurityCardProps {
  user?: User | null;
  pendingRequest?: ChangeRequestRecord | null;
  onRequestSubmitted?: () => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({
  user,
  pendingRequest,
  onRequestSubmitted,
}) => {
  const isAdmin = user?.rol === 'ADMIN';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage('Ingrese su contraseña actual.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      if (isAdmin) {
        // ADMIN: Actualización inmediata
        const res = await profileService.changePassword({
          currentPassword,
          newPassword,
        });

        setSuccessMessage(res.message || 'Contraseña actualizada exitosamente.');
      } else {
        // TEACHER / STUDENT: Solicitud de cambio de contraseña
        const res = await changeRequestService.requestPasswordChange({
          currentPassword,
          newPassword,
        });

        setSuccessMessage(
          res.message || 'Se ha enviado correctamente tu solicitud de cambio de contraseña. Espera a que un administrador acepte tu petición.'
        );
        onRequestSubmitted?.();
      }

      // Limpiar campos sensibles por seguridad
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Error al procesar la solicitud. Verifique sus credenciales.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="seguridad" className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Cabecera */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0B1F3A]">Seguridad de la Cuenta</h2>
          <p className="text-xs text-slate-400">
            {isAdmin 
              ? 'Actualiza tu contraseña para mantener protegido tu acceso institucional.'
              : 'Solicita una actualización de contraseña para tu cuenta institucional.'}
          </p>
        </div>
      </div>

      {/* Banner de Solicitud Pendiente para TEACHER / STUDENT */}
      {!isAdmin && pendingRequest && (
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs space-y-2 animate-fadeIn">
          <div className="flex items-center space-x-2 font-bold text-amber-800">
            <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 animate-pulse" />
            <span>Solicitud de cambio de contraseña en revisión</span>
          </div>
          <p className="text-amber-700 leading-relaxed">
            Has enviado una solicitud de cambio de contraseña el{' '}
            <strong className="font-mono">
              {new Date(pendingRequest.createdAt).toLocaleDateString()} a las {new Date(pendingRequest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </strong>
            . Tu contraseña actual sigue activa hasta que un administrador apruebe la petición.
          </p>
        </div>
      )}

      {/* Alertas */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Formulario de Cambio de Contraseña */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        {/* Contraseña Actual */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="sec-current">
            Contraseña Actual
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="sec-current"
              type={showCurrentPassword ? 'text' : 'password'}
              autoComplete="current-password"
              disabled={!isAdmin && !!pendingRequest}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] disabled:bg-slate-50 disabled:cursor-not-allowed transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              disabled={!isAdmin && !!pendingRequest}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nueva Contraseña y Confirmación */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="sec-new">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="sec-new"
                type={showNewPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={!isAdmin && !!pendingRequest}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] disabled:bg-slate-50 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={!isAdmin && !!pendingRequest}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="sec-confirm">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="sec-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={!isAdmin && !!pendingRequest}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] disabled:bg-slate-50 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={!isAdmin && !!pendingRequest}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Políticas de Seguridad */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start space-x-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
          <span>
            Requisitos institucionales: La contraseña debe contener al menos 8 caracteres. {!isAdmin && 'Al solicitar el cambio, se creará una petición segura para autorización.'}
          </span>
        </div>

        {/* Botón de Envío */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || (!isAdmin && !!pendingRequest)}
            className={`px-5 py-2.5 text-white text-xs font-semibold rounded-xl transition-all flex items-center space-x-2 shadow-sm ${
              !isAdmin && !!pendingRequest
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-[#0B1F3A] hover:bg-slate-800 active:scale-95 shadow-[#0B1F3A]/25 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isAdmin ? 'Actualizando contraseña...' : 'Enviando solicitud...'}</span>
              </>
            ) : (
              <>
                {!isAdmin && <Send className="w-3.5 h-3.5 text-[#D4AF37]" />}
                <span>{isAdmin ? 'Actualizar contraseña' : 'Solicitar cambio de contraseña'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
