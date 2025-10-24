// scripts/delete-admin.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAdmin() {
  try {
    const deletedUser = await prisma.user.delete({
      where: { email: 'admin@rebeca.dev' },
    });

    console.log('Usuario administrador eliminado:', deletedUser.email);
  } catch (error) {
    if (error.code === 'P2025') {
      console.log('El usuario admin@rebeca.dev no existe en la base de datos.');
    } else {
      console.error('Error eliminando usuario administrador:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

deleteAdmin();
