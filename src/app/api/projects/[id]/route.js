import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE /api/projects/[id] - Eliminar proyecto específico
export async function DELETE(
  request,
  { params }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const projectId = params.id;

    // Verificar que el proyecto pertenece al usuario
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el proyecto
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({
      message: 'Proyecto eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Actualizar proyecto específico
export async function PUT(
  request,
  { params }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const projectId = params.id;
    const body = await request.json();

    // Verificar que el proyecto pertenece al usuario
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

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
      isFeatured,
      videoUrl,
    } = body;

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(description && { description }),
        ...(longDescription && { longDescription }),
        ...(technologies && { technologies: JSON.stringify(technologies) }),
        ...(gradient && { gradient }),
        ...(textColor && { textColor }),
        ...(bgColor && { bgColor }),
        ...(features && { features: JSON.stringify(features) }),
        ...(metrics && { metrics: JSON.stringify(metrics) }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(videoUrl !== undefined && { videoUrl }),
      },
    });

    return NextResponse.json({
      message: 'Proyecto actualizado exitosamente',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error actualizando proyecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
