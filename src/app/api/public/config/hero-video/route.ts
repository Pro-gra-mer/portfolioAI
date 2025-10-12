import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

const URL_KEY = 'heroVideoUrl';
const ID_KEY = 'heroVideoPublicId';

// GET /api/public/config/hero-video - obtener URL pública del video del hero
export async function GET() {
  try {
    const [urlCfg, idCfg] = await Promise.all([
      prisma.config.findUnique({ where: { key: URL_KEY } }),
      prisma.config.findUnique({ where: { key: ID_KEY } }),
    ]);
    const url = urlCfg?.value || '';
    const publicId = idCfg?.value || '';
    let playbackUrl = '';
    if (publicId && process.env.CLOUDINARY_URL) {
      try {
        const m = process.env.CLOUDINARY_URL.match(/cloudinary:\/\/[^:]+:[^@]+@([^/]+)/);
        const cloudName = m?.[1];
        if (cloudName) {
          // Forzar entrega mp4 (H.264) y calidad automática para video
          // Nota: usamos f_mp4 (no f_auto) para video con vc_h264
          playbackUrl = `https://res.cloudinary.com/${cloudName}/video/upload/q_auto:good,vc_h264,f_mp4/${publicId}.mp4`;
        }
      } catch {
        // ignore
      }
    }
    return NextResponse.json({ url, publicId, playbackUrl });
  } catch (error) {
    console.error('Error obteniendo hero video público:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
