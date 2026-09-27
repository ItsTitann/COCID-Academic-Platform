import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldAlert, X } from 'lucide-react';
import type { UserRole, UserRecord, CreateUserPayload, UpdateUserPayload } from '../../services/userService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface UserFormErrors {
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface UserFormProps {
  /** Cuando se pasa un usuario existente el formulario entra en modo edición */
  editUser?: UserRecord | null;
  isLoading: boolean;
  serverError: string | null;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  editUser,
  isLoading,
  serverError,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!editUser;

  const [nombre, setNombre] = useState(editUser?.nombre || '');
  const [apellido, setApellido] = useState(editUser?.apellido || '');
  const [email, setEmail] = useState(editUser?.email || '');
  const [rol, setRol] = useState<UserRole>(editUser?.rol || 'STUDENT');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<UserFormErrors>({});

  // Sincronizar campos si cambia el usuario a editar
  useEffect(() => {
    if (editUser) {
      setNombre(editUser.nombre);
      setApellido(editUser.apellido);
      setEmail(editUser.email);
      setRol(editUser.rol);
      setPassword('');
      setConfirmPassword('');
      setErrors({});
    }
  }, [editUser]);

  const validate = (): boolean => {
    const newErrors: UserFormErrors = {};

    if (!nombre.trim() || nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre es obligatorio (mínimo 2 caracteres)';
    }
    if (!apellido.trim() || apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido es obligatorio (mínimo 2 caracteres)';
    }
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Ingrese un correo electrónico institucional válido';
    }
    if (!isEditMode) {
      // Contraseña obligatoria solo al crear
      if (!password || password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Confirme la contraseña';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else if (password) {
      // En edición, si escribe contraseña la validamos
      if (password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode) {
      const payload: UpdateUserPayload = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim().toLowerCase(),
        rol,
      };
      await onSubmit(payload);
    } else {
      const payload: CreateUserPayload = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim().toLowerCase(),
        password,
        rol,
      };
      await onSubmit(payload);
    }
  };

  const inputBase =
    'w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-white border text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all';
  const inputError = 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500';
  const inputNormal = 'border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span className="leading-relaxed">{serverError}</span>
        </div>
      )}

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="uf-nombre">
            Nombre(s)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <input
              id="uf-nombre"
              type="text"
              autoComplete="given-name"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); if (errors.nombre) setErrors(p => ({ ...p, nombre: undefined })); }}
              placeholder="Carlos"
              className={`${inputBase} ${errors.nombre ? inputError : inputNormal}`}
            />
          </div>
          {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="uf-apellido">
            Apellido(s)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <input
              id="uf-apellido"
              type="text"
              autoComplete="family-name"
              value={apellido}
              onChange={(e) => { setApellido(e.target.value); if (errors.apellido) setErrors(p => ({ ...p, apellido: undefined })); }}
              placeholder="Hernández"
              className={`${inputBase} ${errors.apellido ? inputError : inputNormal}`}
            />
          </div>
          {errors.apellido && <p className="mt-1 text-xs text-red-500">{errors.apellido}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="uf-email">
          Correo Electrónico Institucional
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="uf-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }}
            placeholder="carlos.hernandez@cocid.edu.mx"
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
          />
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Rol */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="uf-rol">
          Rol Institucional
        </label>
        <select
          id="uf-rol"
          value={rol}
          onChange={(e) => setRol(e.target.value as UserRole)}
          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="STUDENT">Estudiante</option>
          <option value="TEACHER">Docente / Investigador</option>
          <option value="ADMIN">Administrador Institucional</option>
        </select>
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="uf-password">
          Contraseña{isEditMode && <span className="text-slate-400 font-normal ml-1">(dejar vacío para no cambiar)</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="uf-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
            placeholder={isEditMode ? '(sin cambios)' : '••••••••'}
            className={`${inputBase} pr-10 ${errors.password ? inputError : inputNormal}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
      </div>

      {/* Confirmar Contraseña */}
      {(!isEditMode || password) && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="uf-confirm">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="uf-confirm"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => ({ ...p, confirmPassword: undefined })); }}
              placeholder="••••••••"
              className={`${inputBase} pr-10 ${errors.confirmPassword ? inputError : inputNormal}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Ver confirmación'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancelar</span>
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors flex items-center space-x-2 shadow-sm shadow-indigo-600/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <span>{isEditMode ? 'Actualizar Usuario' : 'Crear Usuario Institucional'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
