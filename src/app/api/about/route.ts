import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/about - Obtener contenido de la página "sobre mí"
export async function GET() {
  try {
    // Buscar configuración existente
    let config = await prisma.config.findFirst({
      where: { key: 'about_content' },
    });

    // Si no existe, devolver contenido por defecto
    if (!config) {
      const defaultContent = {
        hero: {
          mainTitle: 'Pasión por la innovación tecnológica',
          subtitle: 'Desarrolladora web fullstack especializada en inteligencia artificial, transformando ideas complejas en soluciones digitales elegantes y funcionales.',
          description: '',
          ctaText: 'Ver proyectos',
          ctaLink: '/projects'
        },
        story: {
          title: 'Mi trayectoria',
          content: 'Desarrolladora web con una historia de transformación y pasión por la tecnología. En 2023, decidí dar un giro completo a mi vida laboral, para dejar atrás el sector de la limpieza y dedicarme al desarrollo web, un campo donde las horas vuelan y la creatividad no tiene límites.',
          philosophy: {
            title: 'Filosofía de desarrollo',
            content: '"El futuro del desarrollo está en la unión entre la creatividad humana y la inteligencia artificial. Aprovechar su potencial nos permite construir soluciones más inteligentes, eficientes y con un impacto real."'
          }
        },
        skills: {
          frontend: ['Angular', 'JavaScript', 'Tailwind CSS', 'Responsive Design'],
          backend: ['Spring Boot', 'Java', 'REST APIs', 'Laravel'],
          ai: ['OpenAI & GPT', 'Windsurf Editor', 'N8N', 'Chatbots Inteligentes'],
          database: ['MySQL', 'MongoDB', 'Prisma ORM']
        },
        images: {}
      };

      return NextResponse.json({
        content: defaultContent,
        message: 'Contenido por defecto cargado'
      });
    }

    // Parsear el contenido JSON
    const content = JSON.parse(config.value);

    return NextResponse.json({
      content,
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    console.error('Error obteniendo contenido about:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/about - Actualizar contenido de la página "sobre mí"
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
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Contenido es requerido' },
        { status: 400 }
      );
    }

    // Validar estructura básica del contenido
    const requiredFields = ['hero', 'story', 'skills'];
    for (const field of requiredFields) {
      if (!content[field]) {
        return NextResponse.json(
          { error: `Campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    // Convertir contenido a JSON string
    const contentString = JSON.stringify(content);

    // Buscar configuración existente
    const existingConfig = await prisma.config.findFirst({
      where: { key: 'about_content' },
    });

    let result;
    if (existingConfig) {
      // Actualizar configuración existente
      result = await prisma.config.update({
        where: { id: existingConfig.id },
        data: {
          value: contentString,
          updatedAt: new Date(),
        },
      });
    } else {
      // Crear nueva configuración
      result = await prisma.config.create({
        data: {
          key: 'about_content',
          value: contentString,
          userId: userId,
        },
      });
    }

    return NextResponse.json({
      message: 'Contenido actualizado correctamente',
      content: JSON.parse(result.value),
      updatedAt: result.updatedAt,
    });
  } catch (error) {
    console.error('Error actualizando contenido about:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
