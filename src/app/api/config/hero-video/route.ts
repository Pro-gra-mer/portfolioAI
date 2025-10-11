import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
// @ts-ignore
import { v2 as cloudinary } from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '../../auth/[...nextauth]/route.js';

const prisma = new PrismaClient();
const URL_KEY = 'heroVideoUrl';
const ID_KEY = 'heroVideoPublicId';

// GET /api/config/hero-video - obtener URL y publicId (requiere auth)
export async function GET() {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const [urlCfg, idCfg] = await Promise.all([
      prisma.config.findUnique({ where: { key: URL_KEY } }),
      prisma.config.findUnique({ where: { key: ID_KEY } }),
    ]);

    return NextResponse.json({ url: urlCfg?.value || '', publicId: idCfg?.value || '' });
  } catch (error) {
    console.error('Error obteniendo hero video:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT /api/config/hero-video - guardar URL y publicId (requiere auth)
export async function PUT(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { url, publicId } = body || {};

    if (!url) {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    await Promise.all([
      prisma.config.upsert({
        where: { key: URL_KEY },
        create: { key: URL_KEY, value: String(url), userId },
        update: { value: String(url), userId },
      }),
      prisma.config.upsert({
        where: { key: ID_KEY },
        create: { key: ID_KEY, value: String(publicId || ''), userId },
        update: { value: String(publicId || ''), userId },
      }),
    ]);

    return NextResponse.json({ message: 'Hero video actualizado' });
  } catch (error) {
    console.error('Error guardando hero video:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE /api/config/hero-video - limpiar configuración (requiere auth)
export async function DELETE() {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const idCfg = await prisma.config.findUnique({ where: { key: ID_KEY } });
    const publicId = idCfg?.value || '';
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      } catch (e) {
        console.warn('No se pudo borrar el video en Cloudinary:', e);
      }
    }

    await Promise.all([
      prisma.config.upsert({ where: { key: URL_KEY }, create: { key: URL_KEY, value: '', userId }, update: { value: '', userId } }),
      prisma.config.upsert({ where: { key: ID_KEY }, create: { key: ID_KEY, value: '', userId }, update: { value: '', userId } }),
    ]);

    return NextResponse.json({ message: 'Hero video eliminado de la configuración' });
  } catch (error) {
    console.error('Error eliminando hero video:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
