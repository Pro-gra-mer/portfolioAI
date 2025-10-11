'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function ManageAbout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState<AboutContent>({
    hero: {
      mainTitle: 'Pasión por la innovación tecnológica',
      subtitle: 'Desarrolladora web fullstack especializada en inteligencia artificial, transformando ideas complejas en soluciones digitales elegantes y funcionales.',
      description: '',
      ctaText: 'Ver proyectos',
      ctaLink: '/projects'
    },
    story: {
      title: 'Mi trayectoria',
      content: `Desarrolladora web con una historia de transformación y pasión por la tecnología. En 2023, decidí dar un giro completo a mi vida laboral, para dejar atrás el sector de la limpieza y dedicarme al desarrollo web, un campo donde las horas vuelan y la creatividad no tiene límites.

Me formé en diferentes plataformas online como: PixelPro, Udemy, Pildorasinformáticas y Grupo Atrium, adquiriendo experiencia en lenguajes y frameworks modernos como JavaScript, Java, Angular y Spring Boot. Me encantan los desafíos de resolver problemas y construir aplicaciones atractivas y funcionales que marquen la diferencia.

Gracias a la formación recibida y a mi esfuerzo constante, he logrado alcanzar mi objetivo de dedicarme profesionalmente al desarrollo web. Este proyecto representa un paso clave en mi trayectoria, al permitirme consolidar mis conocimientos y aplicarlos en un entorno real, uniendo diseño, funcionalidad y experiencia de usuario.

Mi transición profesional me ha enseñado que la dedicación y el aprendizaje continuo son clave para el éxito. Mi experiencia previa me dio habilidades como la adaptabilidad y la atención al detalle, valores que ahora aplico al desarrollo web.

Fuera del código, disfruto de la lectura, el deporte y la videografía, actividades que me inspiran a seguir creciendo tanto personal como profesionalmente.`,
      philosophy: {
        title: 'Filosofía de desarrollo',
        content: '"El futuro del desarrollo está en la unión entre la creatividad humana y la inteligencia artificial. Aprovechar su potencial nos permite construir soluciones más inteligentes, eficientes y con un impacto real."'
      }
    },
    skills: {
      frontend: ['Angular', 'JavaScript', 'Tailwind CSS', 'Responsive Design'],
      backend: ['Spring Boot', 'Java', 'REST APIs', 'Laravel'],
      ai: ['OpenAI & GPT', 'Windsurf Editor', 'N8N', 'Chatbots Inteligentes'],
      database: ['MySQL', 'MongoDB', 'Prisma ORM']
    },
    images: {}
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchContent();
  }, [session, status, router]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          setContent(data.content);
        }
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    try {
      setSaving(true);
      setError('');
      setMessage('');

      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setMessage('Contenido guardado correctamente');
      } else {
        const data = await response.json();
        setError(data.error || 'Error guardando contenido');
      }
    } catch (error) {
      setError('Error interno del servidor');
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (field: keyof AboutContent['hero'], value: string) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const updateStory = (field: keyof AboutContent['story'], value: string) => {
    setContent(prev => ({
      ...prev,
      story: { ...prev.story, [field]: value }
    }));
  };

  const updateStoryPhilosophy = (field: keyof AboutContent['story']['philosophy'], value: string) => {
    setContent(prev => ({
      ...prev,
      story: {
        ...prev.story,
        philosophy: { ...prev.story.philosophy, [field]: value }
      }
    }));
  };

  const updateSkills = (category: keyof AboutContent['skills'], skills: string[]) => {
    setContent(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: skills }
    }));
  };

  const addSkill = (category: keyof AboutContent['skills']) => {
    setContent(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], '']
      }
    }));
  };

  const updateSkillItem = (category: keyof AboutContent['skills'], index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((skill, i) => i === index ? value : skill)
      }
    }));
  };

  const removeSkill = (category: keyof AboutContent['skills'], index: number) => {
    setContent(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const uploadImage = async (file: File, imageType: 'profileImage' | 'heroImage') => {
    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', imageType);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setContent(prev => ({
          ...prev,
          images: { ...prev.images, [imageType]: data.url }
        }));
        setMessage(`Imagen ${imageType} subida correctamente`);
      } else {
        const data = await response.json();
        setError(data.error || 'Error subiendo imagen');
      }
    } catch (error) {
      setError('Error interno del servidor');
    } finally {
      setImageUploading(false);
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
                    Gestión de "Sobre Mí"
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Edita el contenido de tu página personal
                  </p>
                </div>
              </div>

              <button
                onClick={saveContent}
                disabled={saving}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">

            {/* Messages */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                {[
                  { id: 'hero', label: 'Hero Section' },
                  { id: 'story', label: 'Historia' },
                  { id: 'skills', label: 'Habilidades' },
                  { id: 'images', label: 'Imágenes' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Hero Section */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sección Hero
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={content.hero.mainTitle}
                      onChange={(e) => updateHero('mainTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Pasión por la innovación tecnológica"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.subtitle}
                      onChange={(e) => updateHero('subtitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Descripción breve sobre ti..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Texto del botón
                      </label>
                      <input
                        type="text"
                        value={content.hero.ctaText}
                        onChange={(e) => updateHero('ctaText', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Ver proyectos"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enlace del botón
                      </label>
                      <input
                        type="text"
                        value={content.hero.ctaLink}
                        onChange={(e) => updateHero('ctaLink', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: /projects"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Story Section */}
              {activeTab === 'story' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sección Historia
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título de la sección
                    </label>
                    <input
                      type="text"
                      value={content.story.title}
                      onChange={(e) => updateStory('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Mi trayectoria"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contenido de la historia
                    </label>
                    <textarea
                      rows={8}
                      value={content.story.content}
                      onChange={(e) => updateStory('content', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tu historia personal y trayectoria profesional..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título filosofía
                      </label>
                      <input
                        type="text"
                        value={content.story.philosophy.title}
                        onChange={(e) => updateStoryPhilosophy('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Filosofía de desarrollo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contenido filosofía
                      </label>
                      <textarea
                        rows={3}
                        value={content.story.philosophy.content}
                        onChange={(e) => updateStoryPhilosophy('content', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tu filosofía de desarrollo..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Especialidades Técnicas
                  </h2>

                  {/* Frontend */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Frontend
                    </h3>
                    <div className="space-y-3">
                      {content.skills.frontend.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateSkillItem('frontend', index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Tecnología ${index + 1}`}
                          />
                          {content.skills.frontend.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSkill('frontend', index)}
                              className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSkill('frontend')}
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Agregar tecnología</span>
                      </button>
                    </div>
                  </div>

                  {/* Backend */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Backend
                    </h3>
                    <div className="space-y-3">
                      {content.skills.backend.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateSkillItem('backend', index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Tecnología ${index + 1}`}
                          />
                          {content.skills.backend.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSkill('backend', index)}
                              className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSkill('backend')}
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Agregar tecnología</span>
                      </button>
                    </div>
                  </div>

                  {/* AI/ML */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      IA/ML
                    </h3>
                    <div className="space-y-3">
                      {content.skills.ai.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateSkillItem('ai', index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Tecnología ${index + 1}`}
                          />
                          {content.skills.ai.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSkill('ai', index)}
                              className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSkill('ai')}
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Agregar tecnología</span>
                      </button>
                    </div>
                  </div>

                  {/* Database */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Bases de Datos
                    </h3>
                    <div className="space-y-3">
                      {content.skills.database.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateSkillItem('database', index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Tecnología ${index + 1}`}
                          />
                          {content.skills.database.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSkill('database', index)}
                              className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSkill('database')}
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Agregar tecnología</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Images Section */}
              {activeTab === 'images' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Gestión de Imágenes
                  </h2>

                  {/* Profile Image */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Imagen de Perfil
                    </h3>

                    {content.images.profileImage && (
                      <div className="mb-4">
                        <img
                          src={content.images.profileImage}
                          alt="Imagen de perfil actual"
                          className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadImage(file, 'profileImage');
                          }}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30"
                          disabled={imageUploading}
                        />
                        {imageUploading && (
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>

                      {content.images.profileImage && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm('¿Eliminar la imagen de perfil?')) {
                              const updatedContent = {
                                ...content,
                                images: { ...content.images, profileImage: undefined }
                              };
                              setContent(updatedContent);
                              setMessage('Imagen de perfil eliminada');

                              // Guardar automáticamente con el contenido actualizado
                              try {
                                const response = await fetch('/api/about', {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ content: updatedContent }),
                                });

                                if (response.ok) {
                                  setMessage('Imagen de perfil eliminada y cambios guardados');
                                } else {
                                  const data = await response.json();
                                  setError(data.error || 'Error guardando cambios');
                                }
                              } catch (error) {
                                setError('Error guardando cambios');
                              }
                            }
                          }}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                          disabled={imageUploading}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Imagen Hero
                    </h3>

                    {content.images.heroImage && (
                      <div className="mb-4">
                        <img
                          src={content.images.heroImage}
                          alt="Imagen hero actual"
                          className="w-full max-w-md h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadImage(file, 'heroImage');
                          }}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30"
                          disabled={imageUploading}
                        />
                        {imageUploading && (
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>

                      {content.images.heroImage && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm('¿Eliminar la imagen del hero?')) {
                              const updatedContent = {
                                ...content,
                                images: { ...content.images, heroImage: undefined }
                              };
                              setContent(updatedContent);
                              setMessage('Imagen del hero eliminada');

                              // Guardar automáticamente con el contenido actualizado
                              try {
                                const response = await fetch('/api/about', {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ content: updatedContent }),
                                });

                                if (response.ok) {
                                  setMessage('Imagen del hero eliminada y cambios guardados');
                                } else {
                                  const data = await response.json();
                                  setError(data.error || 'Error guardando cambios');
                                }
                              } catch (error) {
                                setError('Error guardando cambios');
                              }
                            }
                          }}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                          disabled={imageUploading}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
