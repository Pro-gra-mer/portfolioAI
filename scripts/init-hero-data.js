#!/usr/bin/env node

/**
 * Script para poblar la base de datos con datos iniciales del Hero Section
 * Ejecutar con: node scripts/init-hero-data.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const HERO_DATA = {
  heroHeadline: 'Desarrolladora Web Fullstack',
  heroSubheading: 'Creando el futuro con IA y código',
  heroDescription: 'Transformo ideas en experiencias digitales excepcionales, combinando desarrollo web avanzado con inteligencia artificial.',
  heroGradientStart: '22',
  heroGradientEnd: '42'
};

async function main() {
  console.log('🚀 Inicializando datos del Hero Section...');

  try {
    // Crear o actualizar los registros de configuración
    for (const [key, value] of Object.entries(HERO_DATA)) {
      await prisma.config.upsert({
        where: { key },
        update: { value },
        create: {
          key,
          value
        }
      });

      console.log(`✅ ${key}: ${value}`);
    }

    console.log('🎉 ¡Datos del Hero Section inicializados correctamente!');
    console.log('📝 Puedes modificar estos valores desde el panel de administración');

  } catch (error) {
    console.error('❌ Error inicializando datos del Hero Section:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
