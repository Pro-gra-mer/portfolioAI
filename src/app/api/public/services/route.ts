import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// GET /api/public/services - Lista pública de servicios (sin auth)
export async function GET() {
  try {
    const services = await prisma.serviceCard.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    // Fallback a contenido por defecto si no hay registros
    const fallback = [
      {
        id: 'fallback-1',
        title: 'Desarrollo con IA',
        description: 'Implementación de modelos de ML, procesamiento de lenguaje natural y visión por computadora en aplicaciones web.',
        bullets: ['OpenAI API & GPT Integration', 'TensorFlow.js & PyTorch', 'Chatbots & Asistentes Virtuales'],
        theme: 'blue',
        order: 0,
      },
      {
        id: 'fallback-2',
        title: 'Desarrollo Fullstack',
        description: 'Arquitecturas escalables y modernas con las últimas tecnologías del ecosistema JavaScript y Python.',
        bullets: ['Next.js, React & TypeScript', 'Node.js, Python & Django', 'MySQL, PostgreSQL & MongoDB'],
        theme: 'purple',
        order: 1,
      },
      {
        id: 'fallback-3',
        title: 'Diseño & Optimización',
        description: 'Interfaces elegantes y experiencias de usuario excepcionales con rendimiento optimizado.',
        bullets: ['Tailwind CSS & Framer Motion', 'Responsive & Accessible Design', 'Performance & SEO Optimization'],
        theme: 'pink',
        order: 2,
      },
    ];

    const normalized = services.length
      ? services.map((s: any) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          bullets: Array.isArray(s.bullets) ? (s.bullets as string[]) : [],
          theme: s.theme,
          order: s.order,
        }))
      : fallback;

    return NextResponse.json({ services: normalized });
  } catch (error) {
    console.error('Error obteniendo servicios públicos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
