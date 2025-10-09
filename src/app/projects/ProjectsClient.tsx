'use client';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import Link from 'next/link';

export type UIProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  technologies: string[];
  gradient: string;
  textColor: string;
  bgColor: string;
  features: string[];
  metrics: Record<string, string>;
};

export default function ProjectsClient({ projects }: { projects: UIProject[] }) {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { ref: projectsRef, isVisible: projectsVisible } = useScrollAnimation(0.1);
  const { ref: featuredRef, isVisible: featuredVisible } = useScrollAnimation(0.1);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.1);

  const hasProjects = projects.length > 0;
  const featured = hasProjects ? projects[0] : null;
  const rest = hasProjects ? projects.slice(1) : [];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden transition-all duration-1000 ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-6">
            <span className={`text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase inline-block transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>Portfolio de Proyectos</span>
            <h1 className={`text-5xl md:text-7xl font-bold tracking-tight transition-all duration-1000 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">Explora mi trabajo</span>
            </h1>
            <p className={`text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Proyectos reales conectados a base de datos, con foco en calidad, performance y diseño.
            </p>
          </div>
        </div>
      </section>

      {featured && (
        <section ref={featuredRef} className={`py-24 bg-white dark:bg-black transition-all duration-1000 ${featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Proyecto destacado</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={`aspect-video ${featured.bgColor} rounded-3xl flex items-center justify-center shadow-2xl`}>
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z" /></svg>
                  </div>
                  <h3 className="text-2xl font-semibold">{featured.title}</h3>
                  <p className="text-sm opacity-90 mt-2">{featured.category}</p>
                </div>
              </div>
              <div>
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium mb-4">{featured.category}</span>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{featured.title}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{featured.longDescription || featured.description}</p>

                <div className="grid grid-cols-3 gap-6 my-8">
                  {Object.entries(featured.metrics).slice(0,3).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{String(value)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                {featured.features.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Características principales</h4>
                    <ul className="space-y-2">
                      {featured.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                          <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 flex gap-3">
                  <Link href={`/projects/${featured.id}`} className="px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-medium transition hover:scale-105">Ver detalle</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects Grid */}
      <section ref={projectsRef} className={`py-24 bg-gray-50 dark:bg-gray-950 transition-all duration-1000 ${projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Todos los proyectos</h2>
          </div>

          {rest.length === 0 && !featured && (
            <div className="text-center text-gray-600 dark:text-gray-400">Aún no hay proyectos publicados.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={project.id} className={`group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800`} style={{ animationDelay: `${index * 120}ms` }}>
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${project.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-white text-sm font-medium">Demo</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                  </div>
                </div>

                <div className="p-8">
                  <span className={`inline-block px-3 py-1 ${project.bgColor} text-white rounded-full text-sm font-medium mb-4`}>{project.category}</span>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <span key={techIndex} className={`px-3 py-1 ${project.bgColor} text-white rounded-full text-sm`}>{tech}</span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/projects/${project.id}`} className={`flex-1 ${project.bgColor} text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-center`}>
                      Ver detalle
                    </Link>
                    {/* Espacio para links externos si decides agregarlos en el modelo */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className={`py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000 delay-300 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">¿Tienes una idea innovadora?</h2>
          <p className={`text-xl text-white/90 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            Cada proyecto es una oportunidad para crear algo extraordinario. Trabajemos juntas para convertir tu visión en realidad.
          </p>
          <a href="/contact" className={`inline-block px-10 py-5 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl`}>
            Empezar proyecto
          </a>
        </div>
      </section>
    </div>
  );
}
