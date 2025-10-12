const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    console.log('👤 Creando usuario admin...');

    // Hash de contraseña segura (cámbiala por una real)
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Crear usuario admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@portfolio.dev' },
      update: {
        name: 'Admin Portfolio',
        password: hashedPassword,
      },
      create: {
        id: 'admin_' + Date.now(), // ID único
        email: 'admin@portfolio.dev',
        name: 'Admin Portfolio',
        password: hashedPassword,
      },
    });

    console.log('✅ Usuario admin creado:', admin.email);
    console.log('📧 Email: admin@portfolio.dev');
    console.log('🔐 Contraseña: admin123');

    // Crear servicios básicos (si no existen)
    await seedServices();

  } catch (error) {
    console.error('❌ Error creando admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedServices() {
  try {
    console.log('🌱 Seeding servicios por defecto...');

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
  } catch (error) {
    console.error('❌ Error creando servicios:', error);
  }
}

seedAdmin();
