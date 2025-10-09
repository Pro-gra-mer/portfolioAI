
import Link from "next/link";
import prisma from "../../../../lib/prisma";

function parseMaybeJson<T>(val: any, fallback: T): T {
  if (val == null) return fallback;
  if (typeof val === "string") {
    try { return JSON.parse(val) as T; } catch { return fallback; }
  }
  return val as T;
}

export default async function ProjectDetail({ params }: { params: { id: string } }) {
  const id = params.id;

  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Proyecto no encontrado</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Puede que haya sido eliminado o que el identificador sea incorrecto.</p>
          <Link href="/projects" className="px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black font-medium">Volver a proyectos</Link>
        </div>
      </div>
    );
  }

  const technologies = parseMaybeJson<string[]>(project.technologies as any, []);
  const features = parseMaybeJson<string[]>(project.features as any, []);
  const metrics = parseMaybeJson<Record<string, string>>(project.metrics as any, {});

  const gradient = project.bgColor || `bg-gradient-to-br ${project.gradient}`;
  const textColor = project.textColor || "text-white";

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero / Cover */}
      <section className={`${gradient} text-white`}>
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-5xl">
            <div className="mb-4">
              <Link href="/projects" className="inline-flex items-center text-white/90 hover:text-white transition">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                Volver a proyectos
              </Link>
            </div>
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">{project.category}</span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">{project.title}</h1>
            <p className="mt-6 text-lg text-white/90 max-w-3xl">{project.description}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Descripción</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{project.longDescription || project.description}</p>
            </div>

            {features.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Características</h3>
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start text-gray-700 dark:text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mt-2 mr-3" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          <aside className="lg:col-span-1">
            {technologies.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tecnologías</h4>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t, i) => (
                    <span key={i} className={`${gradient} text-white text-sm px-3 py-1 rounded-full`}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(metrics).length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Métricas</h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(metrics).map(([k, v]) => (
                    <div key={k} className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{String(v)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{k}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
