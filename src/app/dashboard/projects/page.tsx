'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    longDescription: '',
    technologies: [''],
    gradient: 'from-blue-500 to-purple-600',
    textColor: 'text-white',
    bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
    videoUrl: '',
    imageUrl: '',
    imagePublicId: '',
    features: [''],
    tools: [''],
    metrics: [
      { model: '', percent: '' },
    ],
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleProjectImageSelect = async (file: File | null) => {
    if (!file) return;
    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.set('file', file);
      fd.set('type', 'projectImage');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error subiendo imagen');
      setFormData(prev => ({ ...prev, imageUrl: data.url || '', imagePublicId: data.publicId || '' }));
    } catch (e: any) {
      setError(e?.message || 'Error subiendo imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const gradientOptions = [
    { value: 'from-blue-500 to-purple-600', label: 'Azul a Púrpura' },
    { value: 'from-purple-500 to-pink-600', label: 'Púrpura a Rosa' },
    { value: 'from-green-500 to-teal-600', label: 'Verde a Verde Azulado' },
    { value: 'from-orange-500 to-red-600', label: 'Naranja a Rojo' },
    { value: 'from-indigo-500 to-blue-600', label: 'Índigo a Azul' },
    { value: 'from-pink-500 to-purple-600', label: 'Rosa a Púrpura' },
    { value: 'from-amber-500 to-orange-600', label: 'Ámbar a Naranja' },
  ];

  const categoryOptions = [
    'Inteligencia Artificial',
    'E-commerce & Machine Learning',
    'Business Intelligence & AI',
    'Realidad Aumentada & Computer Vision',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'DevOps & Cloud',
    'Cybersecurity',
    'Blockchain',
    'IoT & Embedded Systems',
    'Otro',
  ];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Transformar lista de usos de modelos en objeto { [modelo]: porcentaje }
      const metricsObj = Object.fromEntries(
        (formData.metrics || [])
          .filter((m) => m.model?.trim())
          .map((m) => [m.model.trim(), (m.percent || '').toString().trim()])
      );

      const payload = { ...formData, metrics: metricsObj };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error creando proyecto');
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError(error?.message || 'Error creando proyecto');
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, ''],
    }));
  };

  const updateTechnology = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => i === index ? value : tech),
    }));
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const addTool = () => {
    setFormData(prev => ({
      ...prev,
      tools: [...prev.tools, ''],
    }));
  };

  const updateTool = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.map((t, i) => (i === index ? value : t)),
    }));
  };

  const removeTool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature),
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addModelUsage = () => {
    setFormData(prev => ({
      ...prev,
      metrics: [...prev.metrics, { model: '', percent: '' }],
    }));
  };

  const updateModelUsage = (index: number, field: 'model' | 'percent', value: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    }));
  };

  const removeModelUsage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index),
    }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
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
                    Nuevo Proyecto
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Crea una nueva entrada en tu portfolio
                  </p>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información Básica */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Información Básica
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título del Proyecto *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ej: Asistente Virtual IA"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoría *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción Corta *
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Breve descripción del proyecto..."
                    required
                  />
                </div>

                <div className="mt-6">
                  <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción Detallada
                  </label>
                  <textarea
                    id="longDescription"
                    rows={4}
                    value={formData.longDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Descripción más detallada del proyecto, características principales, etc."
                  />
                </div>

                {/* Video URL */}
                <div className="mt-6">
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vídeo del proyecto (YouTube o Vimeo)
                  </label>
                  <input
                    type="url"
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Pega un enlace de YouTube o Vimeo. Lo mostraremos embebido en la ficha del proyecto.
                  </p>
                </div>

                {/* Imagen del proyecto (Cloudinary) */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagen del proyecto (Cloudinary)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProjectImageSelect(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-900 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 hover:file:text-gray-900 dark:file:bg-gray-800 dark:file:text-gray-200"
                    />
                    {uploadingImage && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">Subiendo...</span>
                    )}
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <img src={formData.imageUrl} alt="Previsualización" className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700" />
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Se subirá a tu cuenta de Cloudinary definida en <code>.env</code> con <code>CLOUDINARY_URL</code>.
                  </p>
                </div>
              </div>

              {/* Apariencia */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Apariencia Visual
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="gradient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Esquema de Colores *
                    </label>
                    <select
                      id="gradient"
                      value={formData.gradient}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        gradient: e.target.value,
                        bgColor: `bg-gradient-to-br ${e.target.value}`,
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      {gradientOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="textColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color del Texto
                    </label>
                    <select
                      id="textColor"
                      value={formData.textColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="text-white">Blanco</option>
                      <option value="text-black">Negro</option>
                      <option value="text-gray-900">Gris Oscuro</option>
                    </select>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vista Previa
                  </label>
                  <div className={`w-full h-20 ${formData.bgColor} rounded-xl flex items-center justify-center`}>
                    <span className={`${formData.textColor} font-semibold`}>
                      {formData.title || 'Título del Proyecto'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tecnologías Principales */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Tecnologías Principales
                </h3>

                <div className="space-y-4">
                  {formData.technologies.map((tech, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => updateTechnology(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={`Tecnología principal ${index + 1}`}
                      />
                      {formData.technologies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTechnology(index)}
                          className="p-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar tecnología principal</span>
                  </button>
                </div>
              </div>

              {/* Características */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Características Principales
                </h3>

                <div className="space-y-4">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={`Característica ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar característica</span>
                  </button>
                </div>
              </div>

              {/* Herramientas y Tecnologías utilizadas */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Herramientas y Tecnologías utilizadas
                </h3>

                <div className="space-y-4">
                  {formData.tools.map((tool, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={tool}
                        onChange={(e) => updateTool(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={`Herramienta ${index + 1}`}
                      />
                      {formData.tools.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTool(index)}
                          className="p-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTool}
                    className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar herramienta</span>
                  </button>
                </div>
              </div>

              {/* Uso de modelos de IA */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Uso de los modelos de IA
                </h3>

                <div className="space-y-4">
                  {formData.metrics.map((m, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Modelo
                        </label>
                        <input
                          type="text"
                          value={m.model}
                          onChange={(e) => updateModelUsage(index, 'model', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Ej: GPT-4o, Llama 3, Claude..."
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Porcentaje de uso
                        </label>
                        <input
                          type="text"
                          value={m.percent}
                          onChange={(e) => updateModelUsage(index, 'percent', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Ej: 60%"
                        />
                      </div>
                      <div className="md:col-span-2 flex md:justify-end">
                        {formData.metrics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeModelUsage(index)}
                            className="p-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            aria-label="Eliminar modelo"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addModelUsage}
                    className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar modelo</span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:scale-100 disabled:shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creando proyecto...
                    </div>
                  ) : (
                    'Crear Proyecto'
                  )}
                </button>

                <Link
                  href="/dashboard"
                  className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
