import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '../auth/[...nextauth]/route.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/experience - Obtener experiencia laboral del usuario autenticado
export async function GET() {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown;
    const userId = (session as any)?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const experiences = await prisma.experience.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        isCurrent: 'desc', // Los trabajos actuales primero
      },
    });

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error('Error obteniendo experiencia laboral:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/experience - Crear nueva experiencia laboral
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown;
    const userId = (session as any)?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { position, company, period, description, isCurrent } = body;

    // Validar campos requeridos
    if (!position || !company || !period || !description) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    const newExperience = await prisma.experience.create({
      data: {
        position,
        company,
        period,
        description,
        isCurrent: Boolean(isCurrent),
        userId: userId,
      },
    });

    return NextResponse.json({
      message: 'Experiencia laboral creada exitosamente',
      experience: newExperience,
    });
  } catch (error) {
    console.error('Error creando experiencia laboral:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
