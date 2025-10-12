"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import Image from 'next/image';

type Metrics = Record<string, string | number>;
interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  longDescription: string;
  gradient?: string | null;
  bgColor: string;
  textColor: string;
  technologies: string[];
  features: string[];
  metrics: Metrics;
  imageUrl?: string | null;
}

export default function FeaturedProjectSection() {
  const { ref: featuredRef, isVisible: featuredVisible } = useScrollAnimation(0.1);
  const [featuredProject, setFeaturedProject] = useState<FeaturedProject | null>(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/public/projects', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.featuredProject) {
            const p = data.featuredProject;
            const parse = <T,>(v: unknown, fb: T): T => {
              if (v == null) return fb;
              if (typeof v === 'string') {
                try { return JSON.parse(v) as T; } catch { return fb; }
              }
              return v as T;
            };
            setFeaturedProject({
              ...p,
              technologies: parse(p.technologies, []),
              features: parse(p.features, []),
              metrics: parse(p.metrics, {}),
              longDescription: p.longDescription || p.description,
              bgColor: p.bgColor || `bg-gradient-to-br ${p.gradient}`,
              textColor: p.textColor || 'text-white',
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadFeatured();
  }, []);

  if (!featuredProject) {
    return (
      <section
        id="featured-home"
        ref={featuredRef}
        className={`py-32 bg-white dark:bg-black transition-all duration-1000 ${
          featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-12 transition-all duration-1000 delay-300 ${
            featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Proyecto destacado
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Aún no hay proyectos publicados para destacar.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="featured-home"
      ref={featuredRef}
      className={`py-32 bg-white dark:bg-black transition-all duration-1000 ${
        featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-1000 delay-300 ${
          featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Proyecto destacado
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Una muestra de lo que puedo aportar en cada proyecto.
          </p>
        </div>

        <div className={`transition-all duration-1000 delay-500 ${
          featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className={`aspect-video ${featuredProject.bgColor} rounded-3xl relative overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500`}>
                {featuredProject.imageUrl ? (
                  <>
                    <Image
                      src={featuredProject.imageUrl}
                      alt={featuredProject.title}
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                        {featuredProject.category}
                      </span>
                      <h3 className="mt-2 text-2xl font-semibold text-white drop-shadow">
                        {featuredProject.title}
                      </h3>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-white">
                    <div>
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold">{featuredProject.title}</h3>
                      <p className="text-sm opacity-90 mt-2">{featuredProject.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium mb-4">
                  {featuredProject.category}
                </span>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {featuredProject.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {featuredProject.longDescription}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {Object.entries(featuredProject.metrics || {})
                  .filter(([k]) => !['users','accuracy','satisfaction','conversion','engagement','revenue','retention'].includes(k))
                  .slice(0,3)
                  .map(([model, percent], index) => {
                    // Función para asignar colores diferentes a cada modelo de IA
                    const getModelColor = (index: number) => {
                      const colors = [
                        'text-blue-600 dark:text-blue-400',   // Azul para el primero
                        'text-green-600 dark:text-green-400', // Verde para el segundo
                        'text-purple-600 dark:text-purple-400' // Púrpura para el tercero
                      ];
                      return colors[index % colors.length];
                    };

                    return (
                      <div key={model} className="text-center">
                        <div className={`text-3xl font-bold ${getModelColor(index)}`}>
                          {String(percent)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {model}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Tecnologías utilizadas */}
              {featuredProject.technologies && featuredProject.technologies.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tecnologías utilizadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredProject.technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className={`px-3 py-1 ${featuredProject.bgColor} text-white rounded-full text-sm`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <Link href={`/projects/${featuredProject.id}`} className={`inline-block px-6 py-3 ${featuredProject.bgColor} text-white rounded-xl font-medium transition-all duration-300 hover:scale-105`}>
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
