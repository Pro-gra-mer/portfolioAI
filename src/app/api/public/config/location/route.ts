import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/public/config/location - Ubicación pública (sin auth)
export async function GET() {
  try {
    const cfg = await prisma.config.findUnique({ where: { key: 'location' } });
    return NextResponse.json({ location: cfg?.value || '' });
  } catch (error) {
    console.error('Error obteniendo ubicación pública:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
