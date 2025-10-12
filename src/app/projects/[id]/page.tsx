
import Link from "next/link";
import prisma from "../../../../lib/prisma";
import ProjectVideoEmbed from "@/components/ProjectVideoEmbed";
import Image from "next/image";

function parseMaybeJson<T>(val: unknown, fallback: T): T {
  if (val == null) return fallback;
  if (typeof val === "string") {
    try { return JSON.parse(val) as T; } catch { return fallback; }
  }
  return val as T;
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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

  const technologies = parseMaybeJson<string[]>(project.technologies as unknown, []);
  const features = parseMaybeJson<string[]>(project.features as unknown, []);
  const challenges = parseMaybeJson<string[]>((project as any).challenges as unknown, []);
  const tools = parseMaybeJson<string[]>((project as any).tools as unknown, []);
  const metrics = parseMaybeJson<Record<string, string | number>>(project.metrics as unknown, {});

  const gradient = project.bgColor || `bg-gradient-to-br ${project.gradient}`;
  const videoUrl = project.videoUrl ?? undefined;
  const imageUrl = project.imageUrl ?? undefined;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero / Cover */}
      <section className={`${gradient} text-white relative overflow-hidden`}>
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Texto del hero */}
            <div className="max-w-2xl">
              <div className="mb-3 sm:mb-4">
                <Link href="/projects" className="inline-flex items-center text-white/90 hover:text-white transition text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  Volver a proyectos
                </Link>
              </div>
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-white/20 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">{project.category}</span>
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight">{project.title}</h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/90">{project.description}</p>
            </div>

            {/* Project Image - a la derecha */}
            {imageUrl && (
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
                <Image
                  src={imageUrl}
                  alt={`Imagen de ${project.title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Descripción</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line line-clamp-6">{project.longDescription || project.description}</p>
            </div>

            {/* Video embed (YouTube/Vimeo) */}
            {videoUrl && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Demo en vídeo</h3>
                <ProjectVideoEmbed videoUrl={videoUrl} />
              </div>
            )}

            {features.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Características</h3>
                <ul className="space-y-2 list-disc pl-6 marker:text-gray-400 dark:marker:text-gray-500">
                  {features.map((f, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {challenges.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Desafíos superados</h3>
                <ul className="space-y-2 list-disc pl-6 marker:text-gray-400 dark:marker:text-gray-500">
                  {challenges.map((c, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {tools.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Herramientas y Tecnologías utilizadas</h3>
                <ul className="space-y-2 list-disc pl-6 marker:text-gray-400 dark:marker:text-gray-500">
                  {tools.map((t, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{t}</li>
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
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modelos</h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(metrics).map(([k, v], index) => {
                    // Función para asignar colores diferentes a cada métrica
                    const getMetricColor = (index: number) => {
                      const colors = [
                        'text-blue-600 dark:text-blue-400',   // Azul para el primero
                        'text-green-600 dark:text-green-400', // Verde para el segundo
                        'text-purple-600 dark:text-purple-400' // Púrpura para el tercero
                      ];
                      return colors[index % colors.length];
                    };

                    return (
                      <div key={k} className="text-center">
                        <div className={`text-2xl font-bold ${getMetricColor(index)}`}>
                          {String(v)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {k}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
