import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/public/experience - Lista pública de experiencia laboral (sin auth)
export async function GET() {
  try {
    // Por simplicidad, obtener la experiencia del primer usuario encontrado
    // En un escenario real, podrías querer obtener experiencia por usuario específico
    const experiences = await prisma.experience.findMany({
      orderBy: [
        { isCurrent: 'desc' }, // Trabajos actuales primero
        { createdAt: 'desc' }, // Luego por fecha de creación
      ],
      take: 10, // Limitar a 10 experiencias para evitar sobrecarga
    });

    return NextResponse.json({
      experiences,
    });
  } catch (error) {
    console.error('Error obteniendo experiencia laboral pública:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
