import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';

interface LegalPageProps {
  params: {
    slug: string;
  };
}

// Lista de páginas legales válidas
const validPages = [
  'aviso-legal',
  'politica-privacidad',
  'politica-cookies'
];

// Función para obtener el contenido de un archivo Markdown
async function getLegalContent(slug: string): Promise<string | null> {
  try {
    // Verificar que el slug sea válido
    if (!validPages.includes(slug)) {
      return null;
    }

    const filePath = path.join(process.cwd(), 'src', 'app', 'legal', `${slug}.md`);
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading legal file ${slug}:`, error);
    return null;
  }
}

// Metadata para SEO
export async function generateMetadata({ params }: LegalPageProps) {
  const { slug } = params;

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
  const { slug } = params;
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
                <a
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ← Volver al inicio
                </a>
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
                  <a
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
                  </a>
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
