"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useScrollAnimation } from '@/components/useScrollAnimation';

export default function Projects() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { ref: projectsRef, isVisible: projectsVisible } = useScrollAnimation(0.1);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.1);
  const [projects, setProjects] = useState<any[]>([]);
  const [featuredProject, setFeaturedProject] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/public/projects', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const list = (data?.projects || []).map((p: any) => {
          const parse = (v: any, fb: any) => {
            if (v == null) return fb;
            if (typeof v === 'string') {
              try { return JSON.parse(v); } catch { return fb; }
            }
            return v;
          };
          return {
            ...p,
            technologies: parse(p.technologies, []),
            features: parse(p.features, []),
            metrics: parse(p.metrics, {}),
            longDescription: p.longDescription || p.description,
            bgColor: p.bgColor || `bg-gradient-to-br ${p.gradient}`,
            textColor: p.textColor || 'text-white',
          };
        });
        setProjects(list);

        // Establecer proyecto destacado
        if (data.featuredProject) {
          const featured = data.featuredProject;
          const parse = (v: any, fb: any) => {
            if (v == null) return fb;
            if (typeof v === 'string') {
              try { return JSON.parse(v); } catch { return fb; }
            }
            return v;
          };
          setFeaturedProject({
            ...featured,
            technologies: parse(featured.technologies, []),
            features: parse(featured.features, []),
            metrics: parse(featured.metrics, {}),
            longDescription: featured.longDescription || featured.description,
            bgColor: featured.bgColor || `bg-gradient-to-br ${featured.gradient}`,
            textColor: featured.textColor || 'text-white',
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section - Apple Style */}
      <section
        ref={heroRef}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900"></div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <div className={`inline-block transition-all duration-1000 delay-300 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              <span className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                Portfolio de Proyectos
              </span>
            </div>

            <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight transition-all duration-1000 delay-500 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
                Innovación que
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                transforma industrias
              </span>
            </h1>

            <p className={`text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              Una colección de proyectos donde la inteligencia artificial se encuentra con el diseño excepcional,
              creando soluciones que marcan la diferencia en el mundo digital.
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center pt-8 transition-all duration-1000 delay-900 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              <a
                href="#destacado"
                className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Explorar proyectos</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="/contact"
                className="px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-full font-medium text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105"
              >
                Colaborar
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Projects Grid */}
      <section
        ref={projectsRef}
        className={`py-32 bg-gray-50 dark:bg-gray-950 transition-all duration-1000 ${
          projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 delay-300 ${
            projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Todos los proyectos
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Una colección diversa de soluciones innovadoras que demuestran versatilidad técnica y creatividad
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 delay-500 ${
            projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {(projects.length > 1 ? projects.slice(1) : projects).map((project, index) => (
              <div
                key={project.id}
                className={`group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${project.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-white text-sm font-medium">Demo</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                  </div>
                </div>

                <div className="p-8">
                  <span className={`inline-block px-3 py-1 ${project.bgColor} text-white rounded-full text-sm font-medium mb-4`}>
                    {project.category}
                  </span>

                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{project.metrics.users}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Usuarios</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{project.metrics.conversion || project.metrics.accuracy || project.metrics.engagement}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Métrica</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{project.metrics.satisfaction || project.metrics.revenue || project.metrics.retention}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Valor</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className={`px-3 py-1 ${project.bgColor} text-white rounded-full text-sm`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/projects/${project.id}`} className={`flex-1 ${project.bgColor} text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-center`}>
                      Ver detalle
                    </Link>
                    <div className="flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className={`py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden transition-all duration-1000 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000 delay-300 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            ¿Tienes una idea innovadora?
          </h2>
          <p className={`text-xl text-white/90 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            Cada proyecto es una oportunidad para crear algo extraordinario.
            Trabajemos juntos para convertir tu visión en realidad.
          </p>
          <a
            href="/contact"
            className={`inline-block px-10 py-5 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl`}
          >
            Empezar proyecto
          </a>
        </div>
      </section>
    </div>
  );
}
