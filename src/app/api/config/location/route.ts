import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/config/location - Obtener ubicación (requiere auth)
export async function GET() {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const cfg = await prisma.config.findUnique({ where: { key: 'location' } });
    return NextResponse.json({ location: cfg?.value || '' });
  } catch (error) {
    console.error('Error obteniendo ubicación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT /api/config/location - Guardar/actualizar ubicación (requiere auth)
export async function PUT(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { location } = await request.json();
    if (typeof location !== 'string' || location.trim().length === 0) {
      return NextResponse.json({ error: 'Ubicación inválida' }, { status: 400 });
    }

    const saved = await prisma.config.upsert({
      where: { key: 'location' },
      create: { key: 'location', value: location.trim(), userId },
      update: { value: location.trim(), userId },
    });

    return NextResponse.json({ message: 'Ubicación guardada', location: saved.value });
  } catch (error) {
    console.error('Error guardando ubicación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
