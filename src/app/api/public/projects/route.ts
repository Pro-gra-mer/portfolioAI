import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/public/projects - Lista pública de proyectos (sin auth)
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Buscar proyecto destacado
    const featuredProject = await prisma.project.findFirst({
      where: { isFeatured: true },
    });

    return NextResponse.json({
      projects,
      featuredProject: featuredProject || projects[0] // Si no hay destacado, usar el primero
    });
  } catch (error) {
    console.error('Error obteniendo proyectos públicos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
