'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ServiceForm {
  id?: string;
  title: string;
  description: string;
  bullets: string[];
  theme: 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'indigo' | 'red' | 'yellow' | 'teal' | 'cyan' | string;
  order: number;
  active: boolean;
}

const themes = [
  { value: 'blue', label: 'Azul' },
  { value: 'purple', label: 'Púrpura' },
  { value: 'pink', label: 'Rosa' },
  { value: 'green', label: 'Verde' },
  { value: 'orange', label: 'Naranja' },
  { value: 'indigo', label: 'Índigo' },
  { value: 'red', label: 'Rojo' },
  { value: 'yellow', label: 'Amarillo' },
  { value: 'teal', label: 'Teal' },
  { value: 'cyan', label: 'Cyan' },
];

const defaults: ServiceForm[] = [
  {
    title: 'Desarrollo con IA',
    description:
      'Implementación de modelos de ML, procesamiento de lenguaje natural y visión por computadora en aplicaciones web.',
    bullets: ['OpenAI API & GPT Integration', 'TensorFlow.js & PyTorch', 'Chatbots & Asistentes Virtuales'],
    theme: 'blue',
    order: 0,
    active: true,
  },
  {
    title: 'Desarrollo Fullstack',
    description:
      'Arquitecturas escalables y modernas con las últimas tecnologías del ecosistema JavaScript y Python.',
    bullets: ['Next.js, React & TypeScript', 'Node.js, Python & Django', 'MySQL, PostgreSQL & MongoDB'],
    theme: 'purple',
    order: 1,
    active: true,
  },
  {
    title: 'Diseño & Optimización',
    description:
      'Interfaces elegantes y experiencias de usuario excepcionales con rendimiento optimizado.',
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

export default function ManageServices() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [services, setServices] = useState<ServiceForm[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchServices();
  }, [session, status, router]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const res = await fetch('/api/services');
      if (res.status === 401) {
        router.push('/auth/signin');
        return;
      }
      if (!res.ok) throw new Error('Error cargando servicios');

      const data = await res.json();
      const list = (data?.services || []) as any[];
      if (!list.length) {
        setServices(defaults);
      } else {
        setServices(
          list
            .map((s) => ({
              id: s.id,
              title: s.title,
              description: s.description,
              bullets: Array.isArray(s.bullets) ? (s.bullets as string[]) : [],
              theme: s.theme,
              order: s.order,
              active: s.active,
            }))
            .sort((a, b) => a.order - b.order)
        );
      }
    } catch (e) {
      setError('No se pudo cargar la lista de servicios');
      setServices(defaults);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (index: number, patch: Partial<ServiceForm>) => {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const saveOne = async (index: number) => {
    try {
      const item = services[index];
      setSavingId(item.id || `new-${index}`);
      setError('');
      setMessage('');

      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          description: item.description,
          bullets: item.bullets,
          theme: item.theme,
          order: Number(item.order) || 0,
          active: !!item.active,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error guardando servicio');

      setMessage('Servicio guardado correctamente');
      await fetchServices();
    } catch (e: any) {
      setError(e?.message || 'Error guardando servicio');
    } finally {
      setSavingId(null);
    }
  };

  const deleteOne = async (index: number) => {
    try {
      const item = services[index];
      if (!item.id || !confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
        return;
      }

      setError('');
      setMessage('');

      const res = await fetch(`/api/services?id=${item.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error eliminando servicio');

      setMessage('Servicio eliminado correctamente');
      await fetchServices();
    } catch (e: any) {
      setError(e?.message || 'Error eliminando servicio');
    }
  };

  const addNew = () => {
    setServices((prev) => [
      ...prev,
      {
        title: 'Nuevo servicio',
        description: 'Describe brevemente el servicio...',
        bullets: ['Punto 1', 'Punto 2', 'Punto 3'],
        theme: 'blue',
        order: prev.length,
        active: true,
      },
    ]);
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Servicios</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Edita el contenido de la sección "Especialización en IA" de la home (máximo 4 servicios)
                </p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  <p><strong>Diseño responsivo:</strong></p>
                  <p>• 1 servicio: centrado</p>
                  <p>• 2 servicios: 2 columnas en tablet+ (más anchas)</p>
                  <p>• 3 servicios: 3 columnas en desktop (más anchas)</p>
                  <p>• 4 servicios: 4 columnas en desktop XL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Messages */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>
            </div>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Card #{idx + 1}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={svc.active}
                        onChange={(e) => updateField(idx, { active: e.target.checked })}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Activo</span>
                    </label>
                    <input
                      type="number"
                      value={svc.order}
                      onChange={(e) => updateField(idx, { order: Number(e.target.value) })}
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
                    <input
                      type="text"
                      value={svc.title}
                      onChange={(e) => updateField(idx, { title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                    <textarea
                      value={svc.description}
                      onChange={(e) => updateField(idx, { description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bullets (uno por línea)</label>
                    <textarea
                      value={svc.bullets.join('\n')}
                      onChange={(e) => updateField(idx, { bullets: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema</label>
                    <select
                      value={svc.theme}
                      onChange={(e) => updateField(idx, { theme: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {themes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => deleteOne(idx)}
                      disabled={savingId !== null}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 text-sm"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => saveOne(idx)}
                      disabled={savingId !== null}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {savingId ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={addNew}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300"
            >
              Añadir card
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
