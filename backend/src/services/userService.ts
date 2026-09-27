import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client.js';
import type { Role, UserResponse, CreateUserDTO, UpdateUserDTO } from '../models/index.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES: Role[] = ['ADMIN', 'TEACHER', 'STUDENT'];

export const userService = {
  /**
   * Obtiene la lista completa de usuarios del sistema sin exponer el password_hash.
   * Ordenados por fecha de creación descendente.
   */
  getAllUsers: async (): Promise<UserResponse[]> => {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Crea un nuevo usuario institucional desde el panel administrativo.
   */
  createUser: async (data: CreateUserDTO): Promise<UserResponse> => {
    const { nombre, apellido, email, password, rol } = data;

    // 1. Validaciones de entrada
    if (!nombre || !nombre.trim() || nombre.trim().length < 2) {
      throw new Error('El nombre es obligatorio y debe contener al menos 2 caracteres');
    }
    if (!apellido || !apellido.trim() || apellido.trim().length < 2) {
      throw new Error('El apellido es obligatorio y debe contener al menos 2 caracteres');
    }
    if (!email || !email.trim() || !EMAIL_REGEX.test(email.trim())) {
      throw new Error('Debe proporcionar un correo electrónico válido');
    }
    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (!rol || !VALID_ROLES.includes(rol)) {
      throw new Error('El rol asignado no es válido (ADMIN, TEACHER, STUDENT)');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Verificar si el correo ya existe
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new Error('El correo electrónico ya se encuentra registrado en la plataforma');
    }

    // 3. Generar hash de contraseña y persistir en Prisma
    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: normalizedEmail,
        password_hash,
        rol,
        activo: true,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  },

  /**
   * Actualiza los datos básicos de un usuario existente.
   */
  updateUser: async (targetUserId: string, data: UpdateUserDTO, currentAdminId: string): Promise<UserResponse> => {
    // 1. Verificar existencia del usuario objetivo
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new Error('Usuario no encontrado');
    }

    const updatePayload: { nombre?: string; apellido?: string; email?: string; rol?: Role } = {};

    // 2. Validar nombre y apellido si se proporcionan
    if (data.nombre !== undefined) {
      if (!data.nombre.trim() || data.nombre.trim().length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres');
      }
      updatePayload.nombre = data.nombre.trim();
    }

    if (data.apellido !== undefined) {
      if (!data.apellido.trim() || data.apellido.trim().length < 2) {
        throw new Error('El apellido debe tener al menos 2 caracteres');
      }
      updatePayload.apellido = data.apellido.trim();
    }

    // 3. Validar correo electrónico si cambia
    if (data.email !== undefined) {
      const normalizedEmail = data.email.trim().toLowerCase();
      if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
        throw new Error('Debe proporcionar un correo electrónico válido');
      }

      if (normalizedEmail !== targetUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (emailExists && emailExists.id !== targetUserId) {
          throw new Error('El correo electrónico ya está en uso por otro usuario');
        }
        updatePayload.email = normalizedEmail;
      }
    }

    // 4. Validar cambio de rol y regla de seguridad para no dejar el sistema sin ADMIN
    if (data.rol !== undefined) {
      if (!VALID_ROLES.includes(data.rol)) {
        throw new Error('El rol asignado no es válido');
      }

      // Si el usuario objetivo es ADMIN y se le intenta degradar a otro rol:
      if (targetUser.rol === 'ADMIN' && data.rol !== 'ADMIN') {
        const otherActiveAdminsCount = await prisma.user.count({
          where: {
            rol: 'ADMIN',
            activo: true,
            id: { not: targetUserId },
          },
        });

        if (otherActiveAdminsCount === 0) {
          throw new Error('No se puede cambiar el rol del único administrador activo del sistema');
        }
      }

      updatePayload.rol = data.rol;
    }

    // 5. Aplicar actualización en Prisma
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: updatePayload,
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  },

  /**
   * Activa o desactiva la cuenta de un usuario.
   */
  toggleUserStatus: async (targetUserId: string, active: boolean, currentAdminId: string): Promise<UserResponse> => {
    // 1. Validar que no se desactive a sí mismo
    if (targetUserId === currentAdminId && !active) {
      throw new Error('No puedes desactivar tu propia cuenta de administrador');
    }

    // 2. Verificar existencia del usuario
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new Error('Usuario no encontrado');
    }

    // 3. Si se intenta desactivar a un ADMIN, asegurar que quede al menos otro ADMIN activo
    if (targetUser.rol === 'ADMIN' && !active) {
      const otherActiveAdminsCount = await prisma.user.count({
        where: {
          rol: 'ADMIN',
          activo: true,
          id: { not: targetUserId },
        },
      });

      if (otherActiveAdminsCount === 0) {
        throw new Error('No se puede desactivar el único administrador activo del sistema');
      }
    }

    // 4. Actualizar estado
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { activo: active },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  },

  /**
   * Elimina permanentemente un usuario del sistema.
   */
  deleteUser: async (targetUserId: string, currentAdminId: string): Promise<{ id: string; email: string }> => {
    // 1. Validar que no se elimine a sí mismo
    if (targetUserId === currentAdminId) {
      throw new Error('No puedes eliminar tu propia cuenta de administrador');
    }

    // 2. Verificar existencia del usuario
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new Error('Usuario no encontrado');
    }

    // 3. Regla de seguridad: Si es ADMIN, verificar que no sea el último ADMIN del sistema
    if (targetUser.rol === 'ADMIN') {
      const remainingAdminsCount = await prisma.user.count({
        where: {
          rol: 'ADMIN',
          id: { not: targetUserId },
        },
      });

      if (remainingAdminsCount === 0) {
        throw new Error('No se puede eliminar el último administrador del sistema');
      }
    }

    // 4. Eliminar de la base de datos
    await prisma.user.delete({
      where: { id: targetUserId },
    });

    return {
      id: targetUserId,
      email: targetUser.email,
    };
  },
};
