import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function initializeLocationConfig(userId: string) {
  try {
    // Verificar si ya existe una configuración de ubicación
    const existingConfig = await prisma.config.findUnique({
      where: { key: 'location' }
    });

    if (!existingConfig) {
      // Crear configuración inicial vacía
      await prisma.config.create({
        data: {
          key: 'location',
          value: '',
          userId: userId
        }
      });
      console.log('Configuración de ubicación inicializada');
    }
  } catch (error) {
    console.error('Error inicializando configuración de ubicación:', error);
  }
}

export async function getLocationConfig() {
  try {
    const config = await prisma.config.findUnique({
      where: { key: 'location' }
    });
    return config?.value || '';
  } catch (error) {
    console.error('Error obteniendo configuración de ubicación:', error);
    return '';
  }
}

export async function updateLocationConfig(location: string, userId: string) {
  try {
    const updated = await prisma.config.upsert({
      where: { key: 'location' },
      create: {
        key: 'location',
        value: location,
        userId: userId
      },
      update: {
        value: location,
        userId: userId
      }
    });
    return updated;
  } catch (error) {
    console.error('Error actualizando configuración de ubicación:', error);
    throw error;
  }
}
