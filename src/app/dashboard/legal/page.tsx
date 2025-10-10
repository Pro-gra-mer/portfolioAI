'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LegalPage {
  slug: string;
  title: string;
  content: string;
}

const legalPages = [
  {
    slug: 'aviso-legal',
    title: 'Aviso Legal',
    file: 'src/app/legal/aviso-legal.md'
  },
  {
    slug: 'politica-privacidad',
    title: 'Política de Privacidad',
    file: 'src/app/legal/politica-privacidad.md'
  },
  {
    slug: 'politica-cookies',
    title: 'Política de Cookies',
    file: 'src/app/legal/politica-cookies.md'
  }
];

export default function ManageLegal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('aviso-legal');
  const [pages, setPages] = useState<Record<string, LegalPage>>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchLegalPages();
  }, [session, status, router]);

  const fetchLegalPages = async () => {
    try {
      setLoading(true);
      const pagesData: Record<string, LegalPage> = {};

      for (const page of legalPages) {
        try {
          const response = await fetch(`/api/legal/${page.slug}`);
          if (response.ok) {
            const data = await response.json();
            pagesData[page.slug] = data;
          } else {
            // Si no existe el archivo, crear uno básico
            pagesData[page.slug] = {
              slug: page.slug,
              title: page.title,
              content: `# ${page.title}\n\nContenido de ${page.title.toLowerCase()}...`
            };
          }
        } catch (error) {
          console.error(`Error fetching ${page.slug}:`, error);
        }
      }

      setPages(pagesData);
    } catch (error) {
      console.error('Error fetching legal pages:', error);
      setError('Error cargando páginas legales');
    } finally {
      setLoading(false);
    }
  };

  const savePage = async (slug: string) => {
    try {
      setSaving(true);
      setError('');
      setMessage('');

      const response = await fetch(`/api/legal/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: pages[slug]?.content || '',
        }),
      });

      if (response.ok) {
        setMessage(`Página "${pages[slug]?.title}" guardada correctamente`);
      } else {
        const data = await response.json();
        setError(data.error || 'Error guardando la página');
      }
    } catch (error) {
      setError('Error interno del servidor');
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (slug: string, content: string) => {
    setPages(prev => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        content
      }
    }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const activePage = pages[activeTab];

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
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ← Volver al dashboard
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Páginas Legales
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Edita el contenido de las páginas legales del sitio web
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">

            {/* Messages */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                {legalPages.map((page) => (
                  <button
                    key={page.slug}
                    onClick={() => setActiveTab(page.slug)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === page.slug
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page.title}
                  </button>
                ))}
              </div>

              {activePage && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Editando: {activePage.title}
                    </h2>
                    <button
                      onClick={() => savePage(activeTab)}
                      disabled={saving}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contenido (Markdown)
                    </label>
                    <textarea
                      value={activePage.content}
                      onChange={(e) => updateContent(activeTab, e.target.value)}
                      rows={20}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="Escribe el contenido en formato Markdown..."
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Vista Previa
                    </h3>
                    <div className="prose dark:prose-invert max-w-none text-sm">
                      <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {activePage.content.split('\n').slice(0, 10).join('\n')}
                        {activePage.content.split('\n').length > 10 && '\n...'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-8 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Los cambios se guardan automáticamente en los archivos Markdown</p>
                <p>• Usa formato Markdown para estructurar el contenido</p>
                <p>• Las páginas se generan dinámicamente en <code>/legal/{activeTab}</code></p>
                <p>• Los cambios son inmediatos después de guardar</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
