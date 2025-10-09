import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/experience/[id] - Actualizar experiencia laboral específica
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verificar que la experiencia pertenece al usuario
    const existingExperience = await prisma.experience.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!existingExperience) {
      return NextResponse.json(
        { error: 'Experiencia no encontrada' },
        { status: 404 }
      );
    }

    const updatedExperience = await prisma.experience.update({
      where: { id: params.id },
      data: {
        position,
        company,
        period,
        description,
        isCurrent: Boolean(isCurrent),
      },
    });

    return NextResponse.json({
      message: 'Experiencia laboral actualizada exitosamente',
      experience: updatedExperience,
    });
  } catch (error) {
    console.error('Error actualizando experiencia laboral:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/experience/[id] - Eliminar experiencia laboral específica
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown;
    const userId = (session as any)?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar que la experiencia pertenece al usuario
    const existingExperience = await prisma.experience.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!existingExperience) {
      return NextResponse.json(
        { error: 'Experiencia no encontrada' },
        { status: 404 }
      );
    }

    await prisma.experience.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Experiencia laboral eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error eliminando experiencia laboral:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
