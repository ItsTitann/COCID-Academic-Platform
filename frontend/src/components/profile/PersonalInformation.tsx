import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Lock, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Clock,
  Send
} from 'lucide-react';
import type { User } from '../../types/auth.types';
import type { ChangeRequestRecord } from '../../types/changeRequest.types';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';
import { changeRequestService } from '../../services/changeRequestService';

interface PersonalInformationProps {
  user: User | null;
  pendingRequest?: ChangeRequestRecord | null;
  onRequestSubmitted?: () => void;
}

export const PersonalInformation: React.FC<PersonalInformationProps> = ({ 
  user,
  pendingRequest,
  onRequestSubmitted
}) => {
  const { refreshProfile } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [apellidoPaterno, setApellidoPaterno] = useState(user?.apellido || '');
  const [apellidoMaterno, setApellidoMaterno] = useState(user?.profile?.apellidoMaterno || '');
  const [telefono, setTelefono] = useState(user?.profile?.telefono || '');

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || '');
      setApellidoPaterno(user.apellido || '');
      setApellidoMaterno(user.profile?.apellidoMaterno || '');
      setTelefono(user.profile?.telefono || '');
    }
  }, [user]);

  const handleCancel = () => {
    if (user) {
      setNombre(user.nombre || '');
      setApellidoPaterno(user.apellido || '');
      setApellidoMaterno(user.profile?.apellidoMaterno || '');
      setTelefono(user.profile?.telefono || '');
    }
    setErrorMessage(null);
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!nombre.trim()) {
      setErrorMessage('El nombre es obligatorio.');
      return;
    }

    if (!apellidoPaterno.trim()) {
      setErrorMessage('El apellido paterno es obligatorio.');
      return;
    }

    setIsSaving(true);
    try {
      if (isAdmin) {
        // ADMIN: Actualización inmediata
        await profileService.updateProfile({
          nombre: nombre.trim(),
          apellido: apellidoPaterno.trim(),
          apellidoMaterno: apellidoMaterno.trim() || undefined,
          telefono: telefono.trim() || undefined,
        });

        await refreshProfile();
        setSuccessMessage('Información personal guardada y sincronizada exitosamente.');
      } else {
        // TEACHER / STUDENT: Envío de solicitud de cambio
        const res = await changeRequestService.requestProfileUpdate({
          nombre: nombre.trim(),
          apellido: apellidoPaterno.trim(),
          apellidoMaterno: apellidoMaterno.trim() || undefined,
          telefono: telefono.trim() || undefined,
        });

        setSuccessMessage(
          res.message || 'Se ha enviado correctamente tu solicitud de cambio de información personal. Espera a que un administrador acepte tu petición.'
        );
        onRequestSubmitted?.();
      }

      setIsEditing(false);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Ocurrió un error al procesar la solicitud.';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Cabecera de la Tarjeta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-xl border border-blue-100">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0B1F3A]">Información Personal</h2>
            <p className="text-xs text-slate-400">
              Datos registrados y vinculados en el sistema institucional COCID.
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={!isAdmin && !!pendingRequest}
            className={`inline-flex items-center space-x-2 px-4 py-2 font-semibold rounded-xl text-xs transition-colors self-start sm:self-auto ${
              !isAdmin && !!pendingRequest
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Editar información' : 'Solicitar cambio'}</span>
          </button>
        )}
      </div>

      {/* Banner de Solicitud Pendiente para TEACHER / STUDENT */}
      {!isAdmin && pendingRequest && (
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs space-y-2 animate-fadeIn">
          <div className="flex items-center space-x-2 font-bold text-amber-800">
            <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 animate-pulse" />
            <span>Solicitud de modificación de perfil pendiente de revisión administrativa</span>
          </div>
          <p className="text-amber-700 leading-relaxed">
            Has enviado una solicitud para modificar tus datos personales el{' '}
            <strong className="font-mono">
              {new Date(pendingRequest.createdAt).toLocaleDateString()} a las {new Date(pendingRequest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </strong>
            . Los cambios se aplicarán automáticamente cuando un administrador acepte tu petición.
          </p>

          {/* Valores solicitados */}
          {pendingRequest.requestedData && (
            <div className="mt-2 pt-2 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {pendingRequest.requestedData.nombre && (
                <div>
                  <span className="text-amber-600 font-semibold">Nombre solicitado:</span>{' '}
                  <span className="font-medium text-amber-950">{pendingRequest.requestedData.nombre}</span>
                </div>
              )}
              {pendingRequest.requestedData.apellido && (
                <div>
                  <span className="text-amber-600 font-semibold">Apellido solicitado:</span>{' '}
                  <span className="font-medium text-amber-950">{pendingRequest.requestedData.apellido}</span>
                </div>
              )}
              {pendingRequest.requestedData.telefono && (
                <div>
                  <span className="text-amber-600 font-semibold">Teléfono solicitado:</span>{' '}
                  <span className="font-medium text-amber-950">{pendingRequest.requestedData.telefono}</span>
                </div>
              )}
            </div>
          )}
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

      {/* Formulario */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="p-nombre">
              Nombre(s)
            </label>
            <input
              id="p-nombre"
              type="text"
              disabled={!isEditing}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                isEditing
                  ? 'bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="p-telefono">
              Teléfono de Contacto
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="p-telefono"
                type="text"
                disabled={!isEditing}
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej. 7771234567"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          {/* Apellido Paterno */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="p-paterno">
              Apellido Paterno
            </label>
            <input
              id="p-paterno"
              type="text"
              disabled={!isEditing}
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                isEditing
                  ? 'bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Apellido Materno */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="p-materno">
              Apellido Materno
            </label>
            <input
              id="p-materno"
              type="text"
              disabled={!isEditing}
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
              placeholder="Opcional"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                isEditing
                  ? 'bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 cursor-not-allowed'
              }`}
            />
          </div>
        </div>

        {/* Campo Bloqueado: Correo Institucional */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="p-email">
            Correo Electrónico Institucional
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="p-email"
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full pl-10 pr-28 py-2.5 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-600 text-sm cursor-not-allowed font-mono select-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
                <Lock className="w-3 h-3 text-slate-500" />
                <span>No editable</span>
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center space-x-1">
            <Lock className="w-3 h-3 text-[#14B8A6]" />
            <span>Correo vinculado al sistema institucional y gestión académica.</span>
          </p>
        </div>

        {/* Acciones de Edición */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all flex items-center space-x-2 shadow-sm shadow-[#2563EB]/25 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isAdmin ? 'Guardando cambios...' : 'Enviando solicitud...'}</span>
                </>
              ) : (
                <>
                  {isAdmin ? <Save className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isAdmin ? 'Guardar cambios' : 'Solicitar cambio'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
