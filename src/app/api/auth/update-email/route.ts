import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '../[...nextauth]/route.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/auth/update-email - Actualizar email del usuario
export async function PUT(request: NextRequest) {
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
    const { currentPassword, newEmail } = body;

    if (!currentPassword || !newEmail) {
      return NextResponse.json(
        { error: 'Contraseña actual y nuevo email son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el nuevo email no esté en uso
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: 'Este email ya está en uso' },
        { status: 400 }
      );
    }

    // Obtener el usuario actual para verificar la contraseña
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Contraseña actual incorrecta' },
        { status: 400 }
      );
    }

    // Actualizar email
    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    return NextResponse.json({
      message: 'Email actualizado correctamente',
    });

  } catch (error) {
    console.error('Error actualizando email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
