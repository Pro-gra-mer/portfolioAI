import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '../../../../lib/prisma';

// GET /api/projects - Obtener proyectos del usuario autenticado
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

    const projects = await prisma.project.findMany({
      where: {
        userId: userId,
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

// PATCH /api/projects - Gestionar proyectos destacados
export async function PATCH(request: NextRequest) {
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
    const { projectId, isFeatured } = body;

    if (projectId && isFeatured === true) {
      // Si se quiere destacar un proyecto, quitar destacado de todos los demás primero
      await prisma.project.updateMany({
        where: {
          userId: userId,
          isFeatured: true,
        },
        data: {
          isFeatured: false,
        },
      });

      // Verificar pertenencia y luego destacar el proyecto seleccionado
      const owned = await prisma.project.findFirst({
        where: { id: projectId, userId: userId },
      });
      if (!owned) {
        return NextResponse.json(
          { error: 'Proyecto no encontrado' },
          { status: 404 }
        );
      }
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { isFeatured: true },
      });

      return NextResponse.json({
        message: 'Proyecto destacado actualizado',
        project: updatedProject,
      });
    } else if (projectId && isFeatured === false) {
      // Si se quiere quitar el destacado de un proyecto específico, verificar pertenencia
      const owned = await prisma.project.findFirst({
        where: { id: projectId, userId: userId },
      });
      if (!owned) {
        return NextResponse.json(
          { error: 'Proyecto no encontrado' },
          { status: 404 }
        );
      }
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { isFeatured: false },
      });

      return NextResponse.json({
        message: 'Proyecto destacado removido',
        project: updatedProject,
      });
    } else {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error gestionando proyecto destacado:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
// POST /api/projects - Crear nuevo proyecto
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

    const {
      title,
      category,
      description,
      longDescription,
      technologies,
      gradient,
      textColor,
      bgColor,
      videoUrl,
      imageUrl,
      imagePublicId,
      features,
      challenges,
      tools,
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
      // Cast until prisma generate updates types with `videoUrl`
      data: ({
        title,
        category,
        description,
        longDescription: longDescription || description,
        technologies: JSON.stringify(technologies),
        gradient,
        textColor: textColor || 'text-white',
        bgColor,
        videoUrl: videoUrl || null,
        imageUrl: imageUrl || null,
        imagePublicId: imagePublicId || null,
        features: JSON.stringify(features || []),
        challenges: JSON.stringify(challenges || []),
        tools: tools ? JSON.stringify(tools) : null,
        metrics: JSON.stringify(metrics || {}),
        userId: userId,
      } as any),
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
