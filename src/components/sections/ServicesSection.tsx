"use client";

import { useScrollAnimation } from '@/components/useScrollAnimation';
import { useEffect, useState } from 'react';

type Service = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  theme: 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'indigo' | 'red' | 'yellow' | 'teal' | 'cyan' | string;
  order: number;
};

const fallbackServices: Service[] = [
  {
    id: 'fallback-1',
    title: 'Desarrollo con IA',
    description: 'Implementación de modelos de ML, procesamiento de lenguaje natural y visión por computadora en aplicaciones web.',
    bullets: ['OpenAI API & GPT Integration', 'TensorFlow.js & PyTorch', 'Chatbots & Asistentes Virtuales'],
    theme: 'blue',
    order: 0,
  },
  {
    id: 'fallback-2',
    title: 'Desarrollo Fullstack',
    description: 'Arquitecturas escalables y modernas con las últimas tecnologías del ecosistema JavaScript y Python.',
    bullets: ['Next.js, React & TypeScript', 'Node.js, Python & Django', 'MySQL, PostgreSQL & MongoDB'],
    theme: 'purple',
    order: 1,
  },
  {
    id: 'fallback-3',
    title: 'Diseño & Optimización',
    description: 'Interfaces elegantes y experiencias de usuario excepcionales con rendimiento optimizado.',
    bullets: ['Tailwind CSS & Framer Motion', 'Responsive & Accessible Design', 'Performance & SEO Optimization'],
    theme: 'pink',
    order: 2,
  },
  {
    id: 'fallback-4',
    title: 'Consultoría & Estrategia',
    description: 'Asesoramiento experto en transformación digital y estrategias de implementación tecnológica.',
    bullets: ['Análisis de necesidades', 'Planificación estratégica', 'Optimización de procesos'],
    theme: 'green',
    order: 3,
  },
];

function themeStyles(theme: string) {
  switch (theme) {
    case 'blue':
      return {
        overlay: 'from-blue-500/5 to-purple-500/5',
        icon: 'from-blue-500 to-blue-600',
        dot: 'bg-blue-500',
      };
    case 'purple':
      return {
        overlay: 'from-purple-500/5 to-pink-500/5',
        icon: 'from-purple-500 to-purple-600',
        dot: 'bg-purple-500',
      };
    case 'pink':
      return {
        overlay: 'from-pink-500/5 to-orange-500/5',
        icon: 'from-pink-500 to-pink-600',
        dot: 'bg-pink-500',
      };
    case 'green':
      return {
        overlay: 'from-green-500/5 to-teal-500/5',
        icon: 'from-green-500 to-green-600',
        dot: 'bg-green-500',
      };
    case 'orange':
      return {
        overlay: 'from-orange-500/5 to-red-500/5',
        icon: 'from-orange-500 to-orange-600',
        dot: 'bg-orange-500',
      };
    case 'indigo':
      return {
        overlay: 'from-indigo-500/5 to-purple-500/5',
        icon: 'from-indigo-500 to-indigo-600',
        dot: 'bg-indigo-500',
      };
    case 'red':
      return {
        overlay: 'from-red-500/5 to-pink-500/5',
        icon: 'from-red-500 to-red-600',
        dot: 'bg-red-500',
      };
    case 'yellow':
      return {
        overlay: 'from-yellow-500/5 to-orange-500/5',
        icon: 'from-yellow-500 to-yellow-600',
        dot: 'bg-yellow-500',
      };
    case 'teal':
      return {
        overlay: 'from-teal-500/5 to-cyan-500/5',
        icon: 'from-teal-500 to-teal-600',
        dot: 'bg-teal-500',
      };
    case 'cyan':
      return {
        overlay: 'from-cyan-500/5 to-blue-500/5',
        icon: 'from-cyan-500 to-cyan-600',
        dot: 'bg-cyan-500',
      };
    default:
      return {
        overlay: 'from-gray-500/5 to-gray-500/10',
        icon: 'from-gray-500 to-gray-600',
        dot: 'bg-gray-500',
      };
  }
}

export default function ServicesSection() {
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation(0.1);
  const [services, setServices] = useState<Service[]>(fallbackServices);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/public/services', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const list: Service[] = (data?.services || []).slice(0, 4);
          if (list.length) setServices(list);
        }
      } catch {
        // keep fallback
      }
    }
    loadServices();
  }, []);

  return (
    <section
      ref={servicesRef}
      className={`py-32 bg-white dark:bg-black transition-all duration-1000 ${
        servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-1000 delay-300 ${
          servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Especialización en IA
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Integrando inteligencia artificial en cada proyecto para crear soluciones más inteligentes y eficientes
          </p>
        </div>

        <div className={`grid gap-8 transition-all duration-1000 delay-500 ${
          servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${
          services.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
          services.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
          services.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {services.map((svc) => {
            const t = themeStyles(svc.theme);
            return (
              <div key={svc.id} className={`group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${t.overlay} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${t.icon} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{svc.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{svc.description}</p>
                  {!!svc.bullets?.length && (
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                      {svc.bullets.slice(0, 6).map((b, i) => (
                        <li className="flex items-center" key={i}>
                          <span className={`w-1.5 h-1.5 ${t.dot} rounded-full mr-2`}></span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
