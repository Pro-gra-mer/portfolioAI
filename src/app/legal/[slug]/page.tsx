import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

interface LegalPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Lista de páginas legales válidas
const validPages = [
  'aviso-legal',
  'politica-privacidad',
  'politica-cookies'
];

const prisma = new PrismaClient();

// Contenido por defecto y títulos
function getPageTitle(slug: string): string {
  const titles: Record<string, string> = {
    'aviso-legal': 'Aviso Legal',
    'politica-privacidad': 'Política de Privacidad',
    'politica-cookies': 'Política de Cookies',
  };
  return titles[slug] || 'Página Legal';
}

function getDefaultContent(slug: string): string {
  const defaults: Record<string, string> = {
    'aviso-legal': `# Aviso Legal\n\n**Rebeca Pérez**\nDesarrolladora Web Full Stack\n\n## Información General\n\nEste sitio web es propiedad de Rebeca Pérez, con domicilio profesional en [Ciudad, País].\n\n## Contacto\n\nPara cualquier consulta relacionada con este sitio web, puede contactar a través de:\n- Email: [su-email@ejemplo.com]\n- Teléfono: [número de teléfono]\n\n## Propiedad Intelectual\n\nTodos los derechos de propiedad intelectual del contenido de este sitio web pertenecen a Rebeca Pérez. Queda prohibida la reproducción, distribución o modificación total o parcial del contenido sin autorización expresa.\n\n## Exclusión de Responsabilidad\n\nEl contenido de este sitio web se proporciona únicamente con fines informativos. Rebeca Pérez no se hace responsable de posibles errores u omisiones en la información proporcionada.\n\n## Legislación Aplicable\n\nEste sitio web se rige por la legislación española vigente.`,
    'politica-privacidad': `# Política de Privacidad\n\n**Rebeca Pérez**\nDesarrolladora Web Full Stack\n\n## Información General\n\nEsta política de privacidad describe cómo se recopila, utiliza y protege la información personal que usted proporciona al utilizar este sitio web.\n\n## Información Recopilada\n\n### Información Personal\n- Nombre y apellidos\n- Dirección de correo electrónico\n- Número de teléfono (opcional)\n\n### Información Técnica\n- Dirección IP\n- Tipo de navegador\n- Páginas visitadas\n- Tiempo de permanencia en el sitio\n\n## Uso de la Información\n\nLa información recopilada se utiliza para:\n- Responder a consultas y solicitudes\n- Mejorar el contenido y funcionalidad del sitio\n- Enviar información relevante sobre servicios\n\n## Protección de Datos\n\nSe implementan medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, alteración, divulgación o destrucción.\n\n## Derechos del Usuario\n\nDe acuerdo con la RGPD, usted tiene derecho a:\n- Acceso a sus datos personales\n- Rectificación de datos inexactos\n- Supresión de sus datos\n- Portabilidad de datos\n- Oposición al tratamiento\n\n## Cookies\n\nEste sitio web utiliza cookies técnicas necesarias para su funcionamiento básico. No se utilizan cookies de seguimiento o análisis sin consentimiento explícito.\n\n## Cambios en la Política\n\nEsta política de privacidad puede ser actualizada periódicamente. Se recomienda revisar esta página regularmente para estar informado de cualquier cambio.\n\n## Contacto\n\nPara ejercer sus derechos o realizar consultas sobre esta política, contacte a:\n- Email: [su-email@ejemplo.com]\n- Dirección: [su dirección física]\n\nÚltima actualización: Octubre 2025`,
    'politica-cookies': `# Política de Cookies\n\n**Rebeca Pérez**\nDesarrolladora Web Full Stack\n\n## Información General\n\nEsta política explica cómo se utilizan las cookies y tecnologías similares en este sitio web.\n\n## ¿Qué son las Cookies?\n\nLas cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten recordar sus preferencias y mejorar la experiencia de navegación.\n\n## Tipos de Cookies Utilizadas\n\n### Cookies Técnicas (Necesarias)\n- **Propósito**: Funcionamiento básico del sitio web\n- **Duración**: Sesión o persistentes\n- **Ejemplos**:\n  - Cookies de autenticación\n  - Cookies de seguridad\n  - Cookies de preferencias de idioma\n\n### Cookies de Análisis (Opcionales)\n- **Propósito**: Mejorar el sitio web mediante análisis de uso\n- **Duración**: Persistentes\n- **Herramientas**: Google Analytics (si se utiliza)\n\n## Gestión de Cookies\n\nPuede gestionar las cookies de las siguientes formas:\n\n### A través del Navegador\n- Chrome: Configuración > Privacidad y seguridad > Cookies\n- Firefox: Preferencias > Privacidad y seguridad > Cookies\n- Safari: Preferencias > Privacidad > Gestionar datos de sitios web\n- Edge: Configuración > Cookies y permisos del sitio\n\n### A través del Sitio Web\nUtilice la herramienta de configuración de cookies disponible en el sitio web (si está implementada).\n\n## Cookies de Terceros\n\nEste sitio web puede contener enlaces a sitios web de terceros que tienen sus propias políticas de cookies. No nos hacemos responsables del contenido o prácticas de privacidad de estos sitios.\n\n## Actualizaciones\n\nEsta política de cookies puede ser actualizada periódicamente para reflejar cambios en nuestras prácticas o en la legislación aplicable.\n\n## Contacto\n\nPara cualquier consulta sobre esta política de cookies, contacte a:\n- Email: [su-email@ejemplo.com]\n\nÚltima actualización: Octubre 2025`,
  };
  return defaults[slug] || `# ${getPageTitle(slug)}\n\nContenido de ${getPageTitle(slug).toLowerCase()}...`;
}

// Leer desde BD con fallback
async function getLegalContent(slug: string): Promise<string | null> {
  if (!validPages.includes(slug)) return null;
  const page = await prisma.legalPage.findUnique({ where: { slug } }).catch(() => null);
  if (page?.content) return page.content as string;
  return getDefaultContent(slug);
}

// Metadata para SEO
export async function generateMetadata({ params }: LegalPageProps) {
  const { slug } = await params;

  const titles: Record<string, string> = {
    'aviso-legal': 'Aviso Legal - Rebeca Pérez',
    'politica-privacidad': 'Política de Privacidad - Rebeca Pérez',
    'politica-cookies': 'Política de Cookies - Rebeca Pérez',
  };

  const descriptions: Record<string, string> = {
    'aviso-legal': 'Información legal sobre el sitio web de Rebeca Pérez, desarrolladora web full stack.',
    'politica-privacidad': 'Política de privacidad y protección de datos personales en el sitio web de Rebeca Pérez.',
    'politica-cookies': 'Política de cookies y tecnologías de seguimiento utilizadas en el sitio web.',
  };

  return {
    title: titles[slug] || 'Página Legal - Rebeca Pérez',
    description: descriptions[slug] || 'Información legal del sitio web.',
    keywords: ['legal', 'privacidad', 'cookies', 'Rebeca Pérez'],
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const content = await getLegalContent(slug);

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ← Volver al inicio
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Información Legal
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Documentación legal y políticas del sitio web
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <nav className="mb-8">
              <div className="flex flex-wrap gap-4">
                {validPages.map((page) => (
                  <Link
                    key={page}
                    href={`/legal/${page}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      slug === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page === 'aviso-legal' && 'Aviso Legal'}
                    {page === 'politica-privacidad' && 'Política de Privacidad'}
                    {page === 'politica-cookies' && 'Política de Cookies'}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Content */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-700 dark:text-gray-300">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900 dark:text-white">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Última actualización: Octubre 2025
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
