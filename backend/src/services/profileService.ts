import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client.js';
import type { UserResponse, UpdateProfileDTO, ChangePasswordDTO } from '../models/index.js';

export const profileService = {
  /**
   * Obtiene el perfil completo del usuario autenticado incluyendo UserProfile.
   */
  getProfile: async (userId: string): Promise<UserResponse> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            apellidoMaterno: true,
            telefono: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!user || !user.activo) {
      throw new Error('Usuario no encontrado o cuenta inactiva');
    }

    return user;
  },

  /**
   * Actualiza la información personal del usuario autenticado (nombre, apellido, apellidoMaterno, telefono).
   */
  updateProfile: async (userId: string, data: UpdateProfileDTO): Promise<UserResponse> => {
    const { nombre, apellido, apellidoMaterno, telefono } = data;

    // 1. Validaciones básicas
    if (nombre !== undefined && !nombre.trim()) {
      throw new Error('El nombre no puede estar vacío');
    }
    if (apellido !== undefined && !apellido.trim()) {
      throw new Error('El apellido no puede estar vacío');
    }

    // 2. Actualizar datos en User si corresponde
    if (nombre !== undefined || apellido !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          nombre: nombre ? nombre.trim() : undefined,
          apellido: apellido ? apellido.trim() : undefined,
        },
      });
    }

    // 3. Upsert en UserProfile para campos extendidos (apellidoMaterno, telefono)
    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        apellidoMaterno: apellidoMaterno !== undefined ? (apellidoMaterno.trim() || null) : null,
        telefono: telefono !== undefined ? (telefono.trim() || null) : null,
      },
      update: {
        apellidoMaterno: apellidoMaterno !== undefined ? (apellidoMaterno.trim() || null) : undefined,
        telefono: telefono !== undefined ? (telefono.trim() || null) : undefined,
      },
    });

    // 4. Devolver perfil completo actualizado
    return profileService.getProfile(userId);
  },

  /**
   * Realiza el cambio de contraseña seguro comprobando la contraseña actual mediante bcrypt.
   */
  changePassword: async (userId: string, data: ChangePasswordDTO): Promise<{ success: boolean; message: string }> => {
    const { currentPassword, newPassword } = data;

    if (!currentPassword) {
      throw new Error('Debe proporcionar su contraseña actual');
    }
    if (!newPassword || newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
    }

    // 1. Obtener hash actual
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password_hash: true,
        activo: true,
      },
    });

    if (!user || !user.activo) {
      throw new Error('Usuario no encontrado o cuenta inactiva');
    }

    // 2. Comparar con bcrypt
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new Error('La contraseña actual es incorrecta');
    }

    // 3. Hashear nueva contraseña
    const newHash = await bcrypt.hash(newPassword, 10);

    // 4. Actualizar en base de datos
    await prisma.user.update({
      where: { id: userId },
      data: {
        password_hash: newHash,
      },
    });

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente',
    };
  },

  /**
   * Guarda la URL de la fotografía de perfil en UserProfile.
   */
  updateAvatar: async (userId: string, avatarUrl: string): Promise<UserResponse> => {
    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        avatarUrl,
      },
      update: {
        avatarUrl,
      },
    });

    return profileService.getProfile(userId);
  },
};
