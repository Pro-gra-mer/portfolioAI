'use client';

import { useEffect, useRef, useState } from 'react';

type HeroTextPayload = {
  h1: string;           // "Desarrolladora Web Fullstack" - pequeño
  subtitle: string;     // "Creando el futuro con IA y código" - grande
  description: string;  // El párrafo largo
  gradientStart: number; // Índice inicio del degradado en subtitle
  gradientEnd: number;   // Índice fin del degradado en subtitle
};

export default function HomeHeroTextTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState<HeroTextPayload>({
    h1: 'Desarrolladora Web Fullstack',
    subtitle: 'Creando el futuro con IA y código',
    description: 'Transformo ideas en experiencias digitales excepcionales, combinando desarrollo web avanzado con inteligencia artificial.',
    gradientStart: 0,
    gradientEnd: 0,
  });

  const headlineRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCurrent();
  }, []);

  const loadCurrent = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/config/hero-text');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo cargar la configuración');
      setForm({
        h1: data.h1 || 'Desarrolladora Web Fullstack',
        subtitle: data.subtitle || 'Creando el futuro con IA y código',
        description: data.description || 'Transformo ideas en experiencias digitales excepcionales, combinando desarrollo web avanzado con inteligencia artificial.',
        gradientStart: Number(data.gradientStart || 0),
        gradientEnd: Number(data.gradientEnd || 0),
      });
    } catch (e: any) {
      setError(e?.message || 'Error cargando textos del hero');
    } finally {
      setLoading(false);
    }
  };

  const update = (patch: Partial<HeroTextPayload>) => setForm((prev) => ({ ...prev, ...patch }));

  const clampRange = (start: number, end: number): [number, number] => {
    const len = form.subtitle.length;
    let s = Math.max(0, Math.min(start, len));
    let e = Math.max(0, Math.min(end, len));
    if (e < s) [s, e] = [e, s];
    return [s, e];
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError('');
      setMessage('');

      const [s, e] = clampRange(form.gradientStart, form.gradientEnd);
      const payload: HeroTextPayload = { ...form, gradientStart: s, gradientEnd: e };

      const res = await fetch('/api/config/hero-text', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo guardar');

      setMessage('Textos del hero guardados');
      await loadCurrent();
    } catch (e: any) {
      setError(e?.message || 'Error guardando');
    } finally {
      setSaving(false);
    }
  };

  const applySelectionRange = () => {
    const el = headlineRef.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    update({ gradientStart: start, gradientEnd: end });
  };

  const renderHeadlinePreview = () => {
    const s = Math.max(0, Math.min(form.gradientStart, form.subtitle.length));
    const e = Math.max(0, Math.min(form.gradientEnd, form.subtitle.length));
    const a = form.subtitle.slice(0, s);
    const b = form.subtitle.slice(s, e);
    const c = form.subtitle.slice(e);
    return (
      <>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {form.h1}
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          <span>{a}</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {b}
          </span>
          <span>{c}</span>
        </h2>
      </>
    );
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      {message && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>
        </div>
      )}

      {/* Preview */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Vista previa</h3>
        <div className="space-y-3">
          {renderHeadlinePreview()}
          {form.description && (
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl">{form.description}</p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">H1 (título pequeño)</label>
          <input
            type="text"
            value={form.h1}
            onChange={(e) => update({ h1: e.target.value })}
            placeholder="Ej: Desarrolladora Web Fullstack"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtítulo (texto grande con degradado)</label>
          <input
            ref={headlineRef}
            type="text"
            value={form.subtitle}
            onChange={(e) => update({ subtitle: e.target.value })}
            onSelect={applySelectionRange}
            placeholder="Ej: Creando el futuro con IA y código"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Inicio degradado</label>
              <input
                type="number"
                value={form.gradientStart}
                min={0}
                max={form.subtitle.length}
                onChange={(e) => update({ gradientStart: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Fin degradado</label>
              <input
                type="number"
                value={form.gradientEnd}
                min={0}
                max={form.subtitle.length}
                onChange={(e) => update({ gradientEnd: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={applySelectionRange}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
                title="Usar selección del subtítulo"
              >
                Usar selección
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">Longitud actual: {form.subtitle.length}. Selecciona en el campo y pulsa "Usar selección" para aplicar el degradado al tramo seleccionado.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Ej: Transformo ideas en experiencias digitales excepcionales, combinando desarrollo web avanzado con inteligencia artificial."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
