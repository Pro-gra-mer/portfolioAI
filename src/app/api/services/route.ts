import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '../auth/[...nextauth]/route.js';

const prisma = new PrismaClient();

// GET /api/services - Lista y gestión (requiere auth)
export async function GET() {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const services = await prisma.serviceCard.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error listando servicios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT /api/services - Crear/actualizar un servicio (requiere auth)
export async function PUT(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, bullets, theme, order, active } = body;

    if (!title || !description || !Array.isArray(bullets) || !theme) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const saved = await prisma.serviceCard.upsert({
      where: { id: id || '' },
      create: {
        title,
        description,
        bullets,
        theme,
        order: typeof order === 'number' ? order : 0,
        active: typeof active === 'boolean' ? active : true,
        userId,
      },
      update: {
        title,
        description,
        bullets,
        theme,
        order: typeof order === 'number' ? order : 0,
        active: typeof active === 'boolean' ? active : true,
        userId,
      },
    });

    return NextResponse.json({ message: 'Servicio guardado', service: saved });
  } catch (error) {
    console.error('Error guardando servicio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE /api/services - Eliminar un servicio (requiere auth)
export async function DELETE(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await prisma.serviceCard.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando servicio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
