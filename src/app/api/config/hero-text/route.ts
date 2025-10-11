import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

const KEYS = {
  headline: 'heroHeadline',
  subheading: 'heroSubheading',
  description: 'heroDescription',
  ctaPrimaryLabel: 'heroCtaPrimaryLabel',
  ctaPrimaryHref: 'heroCtaPrimaryHref',
  ctaSecondaryLabel: 'heroCtaSecondaryLabel',
  ctaSecondaryHref: 'heroCtaSecondaryHref',
  gradientStart: 'heroGradientStart',
  gradientEnd: 'heroGradientEnd',
} as const;

export async function GET() {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const keys = Object.values(KEYS);
    const configs = await prisma.config.findMany({ where: { key: { in: keys } } });
    const map = new Map(configs.map((c) => [c.key, c.value]));

    // Respond with h1/subtitle naming expected by the dashboard UI
    return NextResponse.json({
      h1: map.get(KEYS.headline) || '',
      subtitle: map.get(KEYS.subheading) || '',
      description: map.get(KEYS.description) || '',
      ctaPrimaryLabel: map.get(KEYS.ctaPrimaryLabel) || '',
      ctaPrimaryHref: map.get(KEYS.ctaPrimaryHref) || '',
      ctaSecondaryLabel: map.get(KEYS.ctaSecondaryLabel) || '',
      ctaSecondaryHref: map.get(KEYS.ctaSecondaryHref) || '',
      gradientStart: Number(map.get(KEYS.gradientStart) || '0'),
      gradientEnd: Number(map.get(KEYS.gradientEnd) || '0'),
    });
  } catch (error) {
    console.error('Error obteniendo hero text:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    // Accept both naming schemes, prefer the new one (h1/subtitle)
    const title: string = (body?.h1 ?? body?.headline ?? '') as string;
    const subtitle: string = (body?.subtitle ?? body?.subheading ?? '') as string;
    const description: string = (body?.description ?? '') as string;
    const ctaPrimaryLabel: string = (body?.ctaPrimaryLabel ?? '') as string;
    const ctaPrimaryHref: string = (body?.ctaPrimaryHref ?? '') as string;
    const ctaSecondaryLabel: string = (body?.ctaSecondaryLabel ?? '') as string;
    const ctaSecondaryHref: string = (body?.ctaSecondaryHref ?? '') as string;
    const gradientStart: number = Number(body?.gradientStart ?? 0) || 0;
    const gradientEnd: number = Number(body?.gradientEnd ?? 0) || 0;

    const updates = [
      { key: KEYS.headline, value: String(title) },
      { key: KEYS.subheading, value: String(subtitle) },
      { key: KEYS.description, value: String(description) },
      { key: KEYS.ctaPrimaryLabel, value: String(ctaPrimaryLabel) },
      { key: KEYS.ctaPrimaryHref, value: String(ctaPrimaryHref) },
      { key: KEYS.ctaSecondaryLabel, value: String(ctaSecondaryLabel) },
      { key: KEYS.ctaSecondaryHref, value: String(ctaSecondaryHref) },
      { key: KEYS.gradientStart, value: String(gradientStart) },
      { key: KEYS.gradientEnd, value: String(gradientEnd) },
    ];

    await Promise.all(
      updates.map((u) =>
        prisma.config.upsert({
          where: { key: u.key },
          create: { key: u.key, value: u.value, userId },
          update: { value: u.value, userId },
        })
      )
    );

    return NextResponse.json({ message: 'Textos del hero actualizados' });
  } catch (error) {
    console.error('Error guardando hero text:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
