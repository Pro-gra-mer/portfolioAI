// scripts/verify-db.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyDatabase() {
  try {
    console.log('🔍 Verificando base de datos...');

    // Verificar usuarios
    const users = await prisma.user.findMany();
    console.log(`✅ Usuarios encontrados: ${users.length}`);

    users.forEach(user => {
      console.log(`  - ${user.email} (${user.name})`);
    });

    // Verificar sesiones
    const sessions = await prisma.session.findMany();
    console.log(`✅ Sesiones activas: ${sessions.length}`);

    // Verificar cuentas
    const accounts = await prisma.account.findMany();
    console.log(`✅ Cuentas vinculadas: ${accounts.length}`);

    console.log('✅ Base de datos funcionando correctamente');

  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
