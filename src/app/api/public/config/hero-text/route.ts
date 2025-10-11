import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

// GET /api/public/config/hero-text - textos del hero públicos (sin auth)
export async function GET() {
  try {
    const keys = Object.values(KEYS);
    const configs = await prisma.config.findMany({ where: { key: { in: keys } } });
    const map = new Map(configs.map((c) => [c.key, c.value]));

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
    console.error('Error obteniendo hero text público:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
