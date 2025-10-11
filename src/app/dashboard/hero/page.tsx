'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManageHeroVideo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [videoUrl, setVideoUrl] = useState<string>('');
  const [publicId, setPublicId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    loadCurrent();
  }, [session, status, router]);

  const loadCurrent = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/config/hero-video');
      if (res.status === 401) {
        router.push('/auth/signin');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo cargar la configuración');
      setVideoUrl(data.url || '');
      setPublicId(data.publicId || '');
    } catch (e: any) {
      setError(e?.message || 'Error cargando configuración');
    } finally {
      setLoading(false);
    }
  };

  const onUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setMessage('');

      const file = fileInputRef.current?.files?.[0];
      if (!file) throw new Error('Selecciona un video');

      const form = new FormData();
      form.append('file', file);
      form.append('type', 'heroVideo');

      // 1) Subir a Cloudinary
      const up = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const upData = await up.json();
      if (!up.ok) throw new Error(upData.error || 'No se pudo subir el video');

      // 2) Guardar en config
      const save = await fetch('/api/config/hero-video', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: upData.url, publicId: upData.publicId }),
      });
      const saveData = await save.json();
      if (!save.ok) throw new Error(saveData.error || 'No se pudo guardar la configuración');

      setMessage('Video actualizado correctamente');
      setVideoUrl(upData.url);
      setPublicId(upData.publicId || '');
    } catch (e: any) {
      setError(e?.message || 'Error guardando video');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm('¿Eliminar el video del hero? (Se eliminará de Cloudinary si es posible)')) return;
    try {
      setSaving(true);
      setError('');
      setMessage('');

      const res = await fetch('/api/config/hero-video', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo eliminar');

      setMessage('Video eliminado correctamente');
      setVideoUrl('');
      setPublicId('');
    } catch (e: any) {
      setError(e?.message || 'Error eliminando video');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                ← Volver al dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Video del Hero</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Sube un video a Cloudinary y úsalo como fondo dinámico del hero</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
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
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Vista previa</h3>
            {videoUrl ? (
              <video controls className="w-full rounded-xl" src={videoUrl} />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No hay video configurado.</p>
            )}
            {publicId && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Public ID: {publicId}</p>
            )}
          </div>

          {/* Upload form */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Subir video</h3>
            <form onSubmit={onUpload} className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white hover:file:from-blue-700 hover:file:to-purple-700"
              />
              <div className="flex justify-end space-x-3">
                {videoUrl && (
                  <button
                    type="button"
                    onClick={onDelete}
                    disabled={saving}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 text-sm"
                  >
                    Eliminar video
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                  {saving ? 'Subiendo...' : 'Guardar' }
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">Formatos recomendados: MP4 (H.264). Tamaño máximo: 100MB.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
