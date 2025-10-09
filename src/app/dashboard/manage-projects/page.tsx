'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManageProjects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const goToEdit = (id: string) => {
    try {
      router.push(`/dashboard/projects/${id}`);
    } catch (e) {
      console.error('router.push falló, usando fallback', e);
      if (typeof window !== 'undefined') {
        window.location.href = `/dashboard/projects/${id}`;
      }
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchProjects();
  }, [session, status, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error obteniendo proyectos');
      }

      setProjects(data.projects || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (projectId: string, isCurrentlyFeatured: boolean) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          isFeatured: !isCurrentlyFeatured,
        }),
      });

      if (!response.ok) {
        throw new Error('Error actualizando proyecto destacado');
      }

      // Actualizar la lista de proyectos
      setProjects(projects.map(p =>
        p.id === projectId
          ? { ...p, isFeatured: !isCurrentlyFeatured }
          : { ...p, isFeatured: false } // Solo un proyecto puede estar destacado
      ));
    } catch (error: any) {
      setError(error.message);
    }
  };
  const deleteProject = async (projectId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error eliminando proyecto');
      }

      // Actualizar la lista de proyectos
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
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
                    Gestionar Proyectos
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Administra los proyectos de tu portfolio
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/projects"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                + Nuevo Proyecto
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                No tienes proyectos aún
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Comienza creando tu primer proyecto para mostrar en tu portfolio
              </p>
              <Link
                href="/dashboard/projects"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Crear Primer Proyecto
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  {/* Project Preview */}
                  <div className={`aspect-video ${project.bgColor} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <p className="text-sm opacity-90 mt-2">{project.category}</p>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(JSON.parse(project.technologies || '[]')) &&
                      JSON.parse(project.technologies).slice(0, 3).map((tech: string, index: number) => (
                          <span
                            key={index}
                            className={`px-2 py-1 ${project.bgColor} text-white rounded-full text-xs`}
                          >
                            {tech}
                          </span>
                        ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(JSON.parse(project.metrics || '{}')).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {String(value)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Featured Badge */}
                    {project.isFeatured && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-medium">
                          ⭐ Proyecto destacado
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(project.id, project.isFeatured || false)}
                        className={`flex-1 ${project.isFeatured ? 'bg-gray-500 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105`}
                      >
                        {project.isFeatured ? 'Quitar destacado' : 'Marcar destacado'}
                      </button>
                      <button
                        type="button"
                        onClick={() => goToEdit(project.id)}
                        className={`flex-1 ${project.bgColor} text-white py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 cursor-pointer`}
                        aria-label={`Editar ${project.title}`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
