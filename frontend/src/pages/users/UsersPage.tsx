import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Power, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { userService } from '../../services/userService';
import type { UserRecord, CreateUserPayload, UpdateUserPayload, UserRole } from '../../services/userService';
import { UserForm } from '../../components/users/UserForm';

const roleBadges: Record<UserRole, { label: string; bg: string; text: string; border: string }> = {
  ADMIN: { label: 'Administrador', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  TEACHER: { label: 'Docente / Investigador', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  STUDENT: { label: 'Estudiante', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Estados de modales
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [formServerError, setFormServerError] = useState<string | null>(null);

  const [deletingUser, setDeletingUser] = useState<UserRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  // Cargar usuarios
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setPageError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Error al cargar la lista de usuarios';
      setPageError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Limpiar mensaje de éxito tras 4 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filtrado de usuarios
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Búsqueda por texto (nombre, apellido, email)
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        u.nombre.toLowerCase().includes(term) ||
        u.apellido.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);

      // Filtro por rol
      const matchesRole = selectedRole === 'ALL' || u.rol === selectedRole;

      // Filtro por estado
      const matchesStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'ACTIVE' && u.activo) ||
        (selectedStatus === 'INACTIVE' && !u.activo);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Manejadores de modales
  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormServerError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (user: UserRecord) => {
    setEditingUser(user);
    setFormServerError(null);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingUser(null);
    setFormServerError(null);
  };

  // Enviar formulario (Crear / Editar)
  const handleFormSubmit = async (payload: CreateUserPayload | UpdateUserPayload) => {
    setIsFormSubmitting(true);
    setFormServerError(null);

    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, payload as UpdateUserPayload);
        setSuccessMessage('Usuario actualizado exitosamente');
      } else {
        await userService.createUser(payload as CreateUserPayload);
        setSuccessMessage('Usuario institucional creado exitosamente');
      }
      handleCloseFormModal();
      await fetchUsers();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Ocurrió un error al procesar la solicitud';
      setFormServerError(msg);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Cambiar estado activo/inactivo
  const handleToggleStatus = async (user: UserRecord) => {
    setStatusLoadingId(user.id);
    try {
      await userService.toggleStatus(user.id, !user.activo);
      setSuccessMessage(`Usuario ${!user.activo ? 'activado' : 'desactivado'} correctamente`);
      await fetchUsers();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Error al cambiar estado del usuario';
      setPageError(msg);
    } finally {
      setStatusLoadingId(null);
    }
  };

  // Confirmar eliminación
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      await userService.deleteUser(deletingUser.id);
      setSuccessMessage('Usuario eliminado del sistema exitosamente');
      setDeletingUser(null);
      await fetchUsers();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Error al eliminar usuario';
      setPageError(msg);
      setDeletingUser(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h1>
              <p className="text-slate-500 text-sm">
                Administración centralizada de cuentas, roles y accesos institucionales de la plataforma.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl shadow-sm shadow-indigo-600/20 transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Alertas globales */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {pageError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="font-medium">{pageError}</span>
          </div>
          <button onClick={() => setPageError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Buscador */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, apellido o correo..."
            className="w-full pl-10 pr-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtros desplegables */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar:</span>
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          >
            <option value="ALL">Todos los roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="TEACHER">Docente / Investigador</option>
            <option value="STUDENT">Estudiante</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Cargando directorio institucional de usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No se encontraron usuarios</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              {searchTerm || selectedRole !== 'ALL' || selectedStatus !== 'ALL'
                ? 'No hay registros que coincidan con los criterios de búsqueda o filtros seleccionados.'
                : 'Aún no hay usuarios registrados en la plataforma.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Nombre Completo</th>
                  <th scope="col" className="px-6 py-3.5">Correo Electrónico</th>
                  <th scope="col" className="px-6 py-3.5">Rol</th>
                  <th scope="col" className="px-6 py-3.5">Estado</th>
                  <th scope="col" className="px-6 py-3.5">Fecha Registro</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => {
                  const roleStyle = roleBadges[user.rol] || {
                    label: user.rol,
                    bg: 'bg-slate-100',
                    text: 'text-slate-700',
                    border: 'border-slate-200',
                  };

                  const formattedDate = new Date(user.createdAt).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Nombre y Apellido */}
                      <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs flex items-center justify-center">
                            {user.nombre.charAt(0).toUpperCase()}
                            {user.apellido.charAt(0).toUpperCase()}
                          </div>
                          <span>
                            {user.nombre} {user.apellido}
                          </span>
                        </div>
                      </td>

                      {/* Correo */}
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap font-mono text-xs">
                        {user.email}
                      </td>

                      {/* Rol */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                        >
                          {roleStyle.label}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.activo
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${user.activo ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{user.activo ? 'Activo' : 'Inactivo'}</span>
                        </span>
                      </td>

                      {/* Fecha de Registro */}
                      <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1">
                          {/* Toggle Activar/Desactivar */}
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={statusLoadingId === user.id}
                            title={user.activo ? 'Desactivar usuario' : 'Activar usuario'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.activo
                                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {statusLoadingId === user.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </button>

                          {/* Editar */}
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            title="Editar usuario"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => setDeletingUser(user)}
                            title="Eliminar usuario"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Resumen inferior */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>
              Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuarios registrados
            </span>
            <span className="flex items-center space-x-1 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Plataforma Inteligente COCID</span>
            </span>
          </div>
        )}
      </div>

      {/* MODAL: Crear / Editar Usuario */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
                  {editingUser ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingUser ? 'Editar Usuario Institucional' : 'Nuevo Usuario Institucional'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingUser
                      ? 'Actualice los datos o el rol del usuario seleccionado.'
                      : 'Complete los datos para dar de alta una cuenta institucional.'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseFormModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <UserForm
                editUser={editingUser}
                isLoading={isFormSubmitting}
                serverError={formServerError}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseFormModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar Eliminación */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">¿Eliminar usuario del sistema?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Estás a punto de eliminar a{' '}
                <strong className="text-slate-800">
                  {deletingUser.nombre} {deletingUser.apellido}
                </strong>{' '}
                (<span className="font-mono text-[11px]">{deletingUser.email}</span>). Esta acción es permanente y no se puede deshacer.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm shadow-red-600/20"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Sí, eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
