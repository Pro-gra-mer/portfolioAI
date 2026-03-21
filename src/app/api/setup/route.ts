import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('👤 Creando usuario admin...');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@portfolio.dev' },
      update: {
        name: 'Admin Portfolio',
        password: hashedPassword,
      },
      create: {
        id: 'admin_' + Date.now(),
        email: 'admin@portfolio.dev',
        name: 'Admin Portfolio',
        password: hashedPassword,
      },
    });

    console.log('✅ Usuario admin creado:', admin.email);

    const services = [
      {
        title: 'Desarrollo con IA',
        description: 'Implementación de modelos de ML, procesamiento de lenguaje natural y visión por computadora en aplicaciones web.',
        bullets: ['OpenAI API & GPT Integration', 'TensorFlow.js & PyTorch', 'Chatbots & Asistentes Virtuales'],
        theme: 'blue',
        order: 0,
        active: true,
      },
      {
        title: 'Desarrollo Fullstack',
        description: 'Arquitecturas escalables y modernas con las últimas tecnologías del ecosistema JavaScript y Python.',
        bullets: [],
        theme: 'purple',
        order: 1,
        active: true,
      },
      {
        title: 'Diseño & Optimización',
        description: 'Interfaces elegantes y experiencias de usuario excepcionales con rendimiento optimizado.',
        bullets: ['Tailwind CSS & Framer Motion', 'Responsive & Accessible Design', 'Performance & SEO Optimization'],
        theme: 'pink',
        order: 2,
        active: true,
      },
      {
        title: 'Consultoría & Estrategia',
        description: 'Asesoramiento experto en transformación digital y estrategias de implementación tecnológica.',
        bullets: ['Análisis de necesidades', 'Planificación estratégica', 'Optimización de procesos'],
        theme: 'green',
        order: 3,
        active: true,
      },
    ];

    for (const service of services) {
      await prisma.serviceCard.upsert({
        where: { title: service.title },
        update: {
          title: service.title,
          description: service.description,
          bullets: service.bullets ?? [],
          theme: service.theme,
          order: service.order,
          active: service.active,
        },
        create: {
          title: service.title,
          description: service.description,
          bullets: service.bullets ?? [],
          theme: service.theme,
          order: service.order,
          active: service.active,
        },
      });
    }

    console.log('✅ Servicios por defecto creados');

    return NextResponse.json({
      success: true,
      message: 'Setup completado',
      admin: {
        email: admin.email,
        name: admin.name,
      },
      credentials: {
        email: 'admin@portfolio.dev',
        password: 'admin123',
      },
    });
  } catch (error: any) {
    console.error('❌ Error en setup:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
