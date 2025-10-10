import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '../../auth/[...nextauth]/route.js';

// Lista de páginas legales válidas
const validPages = [
  'aviso-legal',
  'politica-privacidad',
  'politica-cookies',
];

const prisma = new PrismaClient();

// GET /api/legal/[slug] - Obtener contenido de página legal
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Validar que el slug sea válido
    if (!validPages.includes(slug)) {
      return NextResponse.json(
        { error: 'Página legal no encontrada' },
        { status: 404 }
      );
    }

    // Buscar en base de datos
    const page = await prisma.legalPage.findUnique({ where: { slug } });
    if (page) {
      return NextResponse.json({ slug, title: page.title, content: page.content });
    }

    // Si no existe en BD, devolver contenido por defecto (sin crear registro aún)
    return NextResponse.json({
      slug,
      title: getPageTitle(slug),
      content: getDefaultContent(slug),
    });
  } catch (error) {
    console.error('Error getting legal page:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/legal/[slug] - Actualizar contenido de página legal
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Validar que el slug sea válido
    if (!validPages.includes(slug)) {
      return NextResponse.json(
        { error: 'Página legal no encontrada' },
        { status: 404 }
      );
    }

    // Requiere sesión
    const session = (await getServerSession(authOptions as any)) as unknown as any;
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Contenido es requerido' },
        { status: 400 }
      );
    }

    // Guardar en base de datos (upsert)
    const saved = await prisma.legalPage.upsert({
      where: { slug },
      create: {
        slug,
        title: getPageTitle(slug),
        content,
        userId,
      },
      update: {
        title: getPageTitle(slug),
        content,
        userId,
      },
    });

    return NextResponse.json({
      message: 'Página legal actualizada correctamente',
      slug,
      title: saved.title,
    });
  } catch (error) {
    console.error('Error updating legal page:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función auxiliar para obtener el título de la página
function getPageTitle(slug: string): string {
  const titles: Record<string, string> = {
    'aviso-legal': 'Aviso Legal',
    'politica-privacidad': 'Política de Privacidad',
    'politica-cookies': 'Política de Cookies',
  };

  return titles[slug] || 'Página Legal';
}

// Función auxiliar para obtener contenido por defecto
function getDefaultContent(slug: string): string {
  const defaultContent: Record<string, string> = {
    'aviso-legal': `# Aviso Legal

**Rebeca Pérez**
Desarrolladora Web Full Stack

## Información General

Este sitio web es propiedad de Rebeca Pérez, con domicilio profesional en [Ciudad, País].

## Contacto

Para cualquier consulta relacionada con este sitio web, puede contactar a través de:
- Email: [su-email@ejemplo.com]
- Teléfono: [número de teléfono]

## Propiedad Intelectual

Todos los derechos de propiedad intelectual del contenido de este sitio web pertenecen a Rebeca Pérez. Queda prohibida la reproducción, distribución o modificación total o parcial del contenido sin autorización expresa.

## Exclusión de Responsabilidad

El contenido de este sitio web se proporciona únicamente con fines informativos. Rebeca Pérez no se hace responsable de posibles errores u omisiones en la información proporcionada.

## Legislación Aplicable

Este sitio web se rige por la legislación española vigente.`,

    'politica-privacidad': `# Política de Privacidad

**Rebeca Pérez**
Desarrolladora Web Full Stack

## Información General

Esta política de privacidad describe cómo se recopila, utiliza y protege la información personal que usted proporciona al utilizar este sitio web.

## Información Recopilada

### Información Personal
- Nombre y apellidos
- Dirección de correo electrónico
- Número de teléfono (opcional)

### Información Técnica
- Dirección IP
- Tipo de navegador
- Páginas visitadas
- Tiempo de permanencia en el sitio

## Uso de la Información

La información recopilada se utiliza para:
- Responder a consultas y solicitudes
- Mejorar el contenido y funcionalidad del sitio
- Enviar información relevante sobre servicios

## Protección de Datos

Se implementan medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, alteración, divulgación o destrucción.

## Derechos del Usuario

De acuerdo con la RGPD, usted tiene derecho a:
- Acceso a sus datos personales
- Rectificación de datos inexactos
- Supresión de sus datos
- Portabilidad de datos
- Oposición al tratamiento

## Cookies

Este sitio web utiliza cookies técnicas necesarias para su funcionamiento básico. No se utilizan cookies de seguimiento o análisis sin consentimiento explícito.

## Cambios en la Política

Esta política de privacidad puede ser actualizada periódicamente. Se recomienda revisar esta página regularmente para estar informado de cualquier cambio.

## Contacto

Para ejercer sus derechos o realizar consultas sobre esta política, contacte a:
- Email: [su-email@ejemplo.com]
- Dirección: [su dirección física]

Última actualización: Octubre 2025`,

    'politica-cookies': `# Política de Cookies

**Rebeca Pérez**
Desarrolladora Web Full Stack

## Información General

Esta política explica cómo se utilizan las cookies y tecnologías similares en este sitio web.

## ¿Qué son las Cookies?

Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten recordar sus preferencias y mejorar la experiencia de navegación.

## Tipos de Cookies Utilizadas

### Cookies Técnicas (Necesarias)
- **Propósito**: Funcionamiento básico del sitio web
- **Duración**: Sesión o persistentes
- **Ejemplos**:
  - Cookies de autenticación
  - Cookies de seguridad
  - Cookies de preferencias de idioma

### Cookies de Análisis (Opcionales)
- **Propósito**: Mejorar el sitio web mediante análisis de uso
- **Duración**: Persistentes
- **Herramientas**: Google Analytics (si se utiliza)

## Gestión de Cookies

Puede gestionar las cookies de las siguientes formas:

### A través del Navegador
- **Chrome**: Configuración > Privacidad y seguridad > Cookies
- **Firefox**: Preferencias > Privacidad y seguridad > Cookies
- **Safari**: Preferencias > Privacidad > Gestionar datos de sitios web
- **Edge**: Configuración > Cookies y permisos del sitio

### A través del Sitio Web
Utilice la herramienta de configuración de cookies disponible en el sitio web (si está implementada).

## Cookies de Terceros

Este sitio web puede contener enlaces a sitios web de terceros que tienen sus propias políticas de cookies. No nos hacemos responsables del contenido o prácticas de privacidad de estos sitios.

## Actualizaciones

Esta política de cookies puede ser actualizada periódicamente para reflejar cambios en nuestras prácticas o en la legislación aplicable.

## Contacto

Para cualquier consulta sobre esta política de cookies, contacte a:
- Email: [su-email@ejemplo.com]

Última actualización: Octubre 2025`,
  };

  return defaultContent[slug] || `# ${getPageTitle(slug)}\n\nContenido de ${getPageTitle(slug).toLowerCase()}...`;
}
