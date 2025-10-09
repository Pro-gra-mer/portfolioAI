import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/projects - Obtener proyectos del usuario autenticado
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Crear nuevo proyecto
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      title,
      category,
      description,
      longDescription,
      technologies,
      gradient,
      textColor,
      bgColor,
      features,
      metrics,
    } = body;

    // Validar campos requeridos
    if (!title || !category || !description || !technologies || !gradient) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        category,
        description,
        longDescription: longDescription || description,
        technologies: JSON.stringify(technologies),
        gradient,
        textColor: textColor || 'text-white',
        bgColor,
        features: JSON.stringify(features || []),
        metrics: JSON.stringify(metrics || {}),
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: 'Proyecto creado exitosamente',
      project: newProject,
    });
  } catch (error) {
    console.error('Error creando proyecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
