import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  const password = 'Admin123*';

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@cocid.edu.mx',
    },
    update: {},
    create: {
      nombre: 'Administrador',
      apellido: 'COCID',
      email: 'admin@cocid.edu.mx',
      password_hash: passwordHash,
      rol: Role.ADMIN,
      activo: true,
    },
  });

  console.log('Usuario administrador creado:');
  console.log({
    id: admin.id,
    email: admin.email,
    rol: admin.rol,
  });
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });