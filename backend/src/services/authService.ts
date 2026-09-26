import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client.js';
import type { Role, UserResponse, AuthSuccessPayload } from '../models/index.js';

interface RegisterInput {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol?: Role;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authService = {
  register: async (data: RegisterInput): Promise<AuthSuccessPayload> => {
    const { nombre, apellido, email, password, rol = 'STUDENT' } = data;

    // 1. Validation
    if (!nombre || !nombre.trim()) {
      throw new Error('El nombre es obligatorio');
    }
    if (!apellido || !apellido.trim()) {
      throw new Error('El apellido es obligatorio');
    }
    if (!email || !email.trim() || !EMAIL_REGEX.test(email.trim())) {
      throw new Error('Debe proporcionar un correo electrónico válido');
    }
    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const validRoles: Role[] = ['ADMIN', 'TEACHER', 'STUDENT'];
    const assignedRole: Role = validRoles.includes(rol) ? rol : 'STUDENT';
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check existing user
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new Error('El correo electrónico ya se encuentra registrado');
    }

    // 3. Hash password & persist
    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: normalizedEmail,
        password_hash,
        rol: assignedRole,
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

    // 4. Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol,
        activo: user.activo,
      },
      process.env.JWT_SECRET || 'cocid_secret_fallback_key',
      { expiresIn: '7d' }
    );

    return {
      token,
      user,
    };
  },

  login: async (email: string, pass: string): Promise<AuthSuccessPayload> => {
    // 1. Validation
    if (!email || !email.trim()) {
      throw new Error('El correo electrónico es obligatorio');
    }
    if (!pass) {
      throw new Error('La contraseña es obligatoria');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find user
const user = await prisma.user.findUnique({
  where: {
    email: normalizedEmail,
  },
  select: {
    id: true,
    email: true,
    nombre: true,
    apellido: true,
    rol: true,
    activo: true,
    password_hash: true,
    createdAt: true,
    updatedAt: true,
  },
});

if (!user) {
  throw new Error('Credenciales inválidas o cuenta inactiva');
}

if (!user.activo) {
  throw new Error('Cuenta inactiva');
}

// 3. Compare password
const isMatch = await bcrypt.compare(
  pass,
  user.password_hash
);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol,
        activo: user.activo,
      },
      process.env.JWT_SECRET || 'cocid_secret_fallback_key',
      { expiresIn: '7d' }
    );

    const userProfile: UserResponse = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol,
      activo: user.activo,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      token,
      user: userProfile,
    };
  },

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
      },
    });

    if (!user || !user.activo) {
      throw new Error('Usuario no encontrado o inactivo');
    }

    return user;
  },
};
