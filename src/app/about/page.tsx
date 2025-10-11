'use client';

import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../../components/useScrollAnimation';

interface AboutContent {
  hero: {
    mainTitle: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };
  story: {
    title: string;
    content: string;
    philosophy: {
      title: string;
      content: string;
    };
  };
  skills: {
    frontend: string[];
    backend: string[];
    ai: string[];
    database: string[];
  };
  images: {
    profileImage?: string;
    heroImage?: string;
  };
}

interface Experience {
  id: string;
  position: string;
  company: string;
  period: string;
  description: string;
  isCurrent: boolean;
}

export default function About() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { ref: storyRef, isVisible: storyVisible } = useScrollAnimation(0.1);
  const { ref: skillsRef, isVisible: skillsVisible } = useScrollAnimation(0.1);
  const { ref: experienceRef, isVisible: experienceVisible } = useScrollAnimation(0.1);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.1);

  const [content, setContent] = useState<AboutContent>({
    hero: {
      mainTitle: 'Pasión por la innovación tecnológica',
      subtitle:
        'Desarrolladora web fullstack especializada en inteligencia artificial, transformando ideas complejas en soluciones digitales elegantes y funcionales.',
      description: '',
      ctaText: 'Ver proyectos',
      ctaLink: '/projects',
    },
    story: {
      title: 'Mi trayectoria',
      content:
        'Desarrolladora web con una historia de transformación y pasión por la tecnología. En 2023, decidí dar un giro completo a mi vida laboral, para dejar atrás el sector de la limpieza y dedicarme al desarrollo web, un campo donde las horas vuelan y la creatividad no tiene límites.\n\nMe formé en diferentes plataformas online como: PixelPro, Udemy, Pildorasinformáticas y Grupo Atrium, adquiriendo experiencia en lenguajes y frameworks modernos como JavaScript, Java, Angular y Spring Boot. Me encantan los desafíos de resolver problemas y construir aplicaciones atractivas y funcionales que marquen la diferencia.\n\nGracias a la formación recibida y a mi esfuerzo constante, he logrado alcanzar mi objetivo de dedicarme profesionalmente al desarrollo web. Este proyecto representa un paso clave en mi trayectoria, al permitirme consolidar mis conocimientos y aplicarlos en un entorno real, uniendo diseño, funcionalidad y experiencia de usuario.\n\nMi transición profesional me ha enseñado que la dedicación y el aprendizaje continuo son clave para el éxito. Mi experiencia previa me dio habilidades como la adaptabilidad y la atención al detalle, valores que ahora aplico al desarrollo web.',
      philosophy: {
        title: 'Filosofía de desarrollo',
        content:
          '"El futuro del desarrollo está en la unión entre la creatividad humana y la inteligencia artificial. Aprovechar su potencial nos permite construir soluciones más inteligentes, eficientes y con un impacto real."',
      },
    },
    skills: {
      frontend: ['Angular', 'JavaScript', 'Tailwind CSS', 'Responsive Design'],
      backend: ['Spring Boot', 'Java', 'REST APIs', 'Laravel'],
      ai: ['OpenAI & GPT', 'Windsurf Editor', 'N8N', 'Chatbots Inteligentes'],
      database: ['MySQL', 'MongoDB', 'Prisma ORM'],
    },
    images: {},
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    fetchExperiences();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error obteniendo contenido about:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/public/experience');
      const data = await response.json();

      if (response.ok) {
        setExperiences(data.experiences || []);
      }
    } catch (error) {
      console.error('Error obteniendo experiencia laboral:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section - Apple Style */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
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
                Sobre Mí
              </span>
            </div>

            {/* Hero Image - Modern Floating Design */}
            {content.images.heroImage && (
              <div className={`relative transition-all duration-1000 delay-400 ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}>
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
                  <img
                    src={content.images.heroImage}
                    alt="Imagen representativa"
                    className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-2xl ring-4 ring-white/50 dark:ring-gray-900/50 hover:ring-white dark:hover:ring-gray-800 transition-all duration-500 hover:scale-110"
                    loading="eager"
                  />
                </div>
              </div>
            )}

            <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight transition-all duration-1000 delay-500 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
                {content.hero.mainTitle.split(' ').slice(0, 2).join(' ')}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                {content.hero.mainTitle.split(' ').slice(2).join(' ')}
              </span>
            </h1>

            <p className={`text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              {content.hero.subtitle}
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center pt-8 transition-all duration-1000 delay-900 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              <a
                href={content.hero.ctaLink}
                className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">{content.hero.ctaText}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="/contact"
                className="px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-full font-medium text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105"
              >
                Contactar
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

      {/* Story Section */}
      <section
        ref={storyRef}
        className={`py-32 bg-white dark:bg-black transition-all duration-1000 ${
          storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`space-y-8 transition-all duration-1000 delay-300 ${
              storyVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                {content.story.title}
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {content.story.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className={`relative transition-all duration-1000 delay-500 ${
              storyVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              {/* Profile Image (optional) */}
              {content.images.profileImage && (
                <div className="mb-8 flex justify-center lg:justify-start">
                  <img
                    src={content.images.profileImage}
                    alt="Foto de perfil"
                    className="w-48 h-48 md:w-64 md:h-64 rounded-3xl object-cover shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{content.story.philosophy.title}</h3>
                <p className="text-blue-100 leading-relaxed">
                  {content.story.philosophy.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        ref={skillsRef}
        className={`py-32 bg-gray-50 dark:bg-gray-950 transition-all duration-1000 ${
          skillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 delay-300 ${
            skillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Especialidades técnicas
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Dominio de tecnologías modernas y metodologías avanzadas para crear soluciones robustas y escalables
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-500 ${
            skillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Frontend */}
            <div className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Frontend</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {content.skills.frontend.map((skill, index) => (
                    <li key={index}>• {skill}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Backend */}
            <div className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 002 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2 0V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Backend</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {content.skills.backend.map((skill, index) => (
                    <li key={index}>• {skill}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI/ML */}
            <div className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">IA/ML</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {content.skills.ai.map((skill, index) => (
                    <li key={index}>• {skill}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Database */}
            <div className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bases de Datos</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {content.skills.database.map((skill, index) => (
                    <li key={index}>• {skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section
        ref={experienceRef}
        className={`py-32 bg-white dark:bg-black transition-all duration-1000 ${
          experienceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 delay-300 ${
            experienceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Experiencia profesional
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Trayectoria construyendo soluciones digitales innovadoras para empresas y startups
            </p>
          </div>

          <div className={`relative transition-all duration-1000 delay-500 ${
            experienceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="space-y-12">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
                </div>
              ) : experiences.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    La experiencia profesional se mostrará aquí una vez que se añada desde el dashboard.
                  </p>
                </div>
              ) : (
                experiences.map((experience, index) => (
                  <div key={experience.id} className="relative flex items-start space-x-8">
                    <div className={`flex-shrink-0 w-4 h-4 rounded-full mt-2 ${
                      experience.isCurrent
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : index % 2 === 0
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}></div>
                    <div className="flex-1 pb-12">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {experience.position}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            {experience.isCurrent && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                                Trabajo actual
                              </span>
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {experience.period}
                            </span>
                          </div>
                        </div>
                        <p className="text-lg text-blue-600 dark:text-blue-400 mb-4">{experience.company}</p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {experience.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
            ¿Listos para colaborar?
          </h2>
          <p className={`text-xl text-white/90 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            Tengo la experiencia y la visión para llevar tu proyecto al siguiente nivel.
            Hablemos sobre cómo podemos crear algo extraordinario juntos.
          </p>
          <a
            href="/contact"
            className={`inline-block px-10 py-5 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl`}
          >
            Iniciar proyecto
          </a>
        </div>
      </section>
    </div>
  );
}
