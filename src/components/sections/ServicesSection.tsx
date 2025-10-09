"use client";

import { useScrollAnimation } from '@/components/useScrollAnimation';

export default function ServicesSection() {
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation(0.1);

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

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-500 ${
          servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* AI Development */}
          <div className={`group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Desarrollo con IA
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Implementación de modelos de ML, procesamiento de lenguaje natural y visión por computadora en aplicaciones web.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  OpenAI API & GPT Integration
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  TensorFlow.js & PyTorch
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Chatbots & Asistentes Virtuales
                </li>
              </ul>
            </div>
          </div>

          {/* Full Stack Development */}
          <div className={`group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Desarrollo Fullstack
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Arquitecturas escalables y modernas con las últimas tecnologías del ecosistema JavaScript y Python.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                  Next.js, React & TypeScript
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                  Node.js, Python & Django
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                  MySQL, PostgreSQL & MongoDB
                </li>
              </ul>
            </div>
          </div>

          {/* UI/UX & Performance */}
          <div className={`group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105`}>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Diseño & Optimización
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Interfaces elegantes y experiencias de usuario excepcionales con rendimiento optimizado.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                  Tailwind CSS & Framer Motion
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                  Responsive & Accessible Design
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                  Performance & SEO Optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
