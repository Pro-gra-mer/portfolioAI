// scripts/create-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@rebeca.dev' },
      update: {},
      create: {
        email: 'admin@rebeca.dev',
        name: 'Administrador',
        password: hashedPassword,
      },
    });

    console.log('Usuario administrador creado:', admin.email);
  } catch (error) {
    console.error('Error creando usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
