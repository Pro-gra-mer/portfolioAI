"use client";

import { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '@/components/useScrollAnimation';

export default function HeroSection() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const [isLoading, setIsLoading] = useState(true);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [heroText, setHeroText] = useState<{
    h1: string;
    subtitle: string;
    description: string;
    gradientStart: number;
    gradientEnd: number;
  }>({
    h1: 'Desarrolladora Web Fullstack',
    subtitle: 'Creando el futuro con IA y código',
    description: 'Transformo ideas en experiencias digitales excepcionales, combinando desarrollo web avanzado con inteligencia artificial.',
    gradientStart: 0,
    gradientEnd: 0
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/public/config/hero-video', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        // Preferir la URL directa primero (suele estar disponible antes que el derivado)
        const direct = (data?.url || '') as string;
        const derived = (data?.playbackUrl || '') as string;
        const chosen = direct || derived;
        if (!cancelled && chosen) {
          const cacheBusted = `${chosen}${chosen.includes('?') ? '&' : '?'}v=${encodeURIComponent(data?.publicId || Date.now())}`;
          setHeroVideoUrl(cacheBusted);
        }
        // Reintento: tras 8s vuelve a intentar con playbackUrl (por si el derivado ya está listo)
        if (derived && !cancelled) {
          setTimeout(() => {
            if (cancelled) return;
            const cacheBusted = `${derived}${derived.includes('?') ? '&' : '?'}v=${encodeURIComponent(data?.publicId || Date.now())}`;
            setHeroVideoUrl(cacheBusted);
          }, 8000);
        }
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/public/config/hero-text', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setHeroText({
          h1: String(data?.h1 || 'Desarrolladora Web Fullstack'),
          subtitle: String(data?.subtitle || 'Creando el futuro con IA y código'),
          description: String(data?.description || 'Transformo ideas en experiencias digitales excepcionales, combinando desarrollo web avanzado con inteligencia artificial.'),
          gradientStart: Number(data?.gradientStart || 0),
          gradientEnd: Number(data?.gradientEnd || 0),
        });
      } catch {
        // ignore
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    // Fuerza recarga del video cuando cambia la URL
    if (videoRef.current) {
      try { videoRef.current.load(); } catch {}
    }
  }, [heroVideoUrl]);

  useEffect(() => {
    // Sincroniza el estado de mute con el elemento de video
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (!isMuted) {
        // Reproducir al activar el sonido (requiere interacción previa del usuario)
        try { videoRef.current.play(); } catch {}
      }
    }
  }, [isMuted]);

  return (
    <>
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            opacity: 0.4;
            transform: scale(1);
          }
          100% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
      <section
        ref={heroRef}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Background: Left BG, Right Video - Gradient Fusion */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900">
          {/* Video with Horizontal Gradient Mask - Right Visible, Left Invisible */}
          {heroVideoUrl && (
            <>
              <video
                key={heroVideoUrl}
                ref={videoRef}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
                style={{
                  maskImage: `linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.6) 100%)`,
                  WebkitMaskImage: `linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.6) 100%)`
                }}
                src={heroVideoUrl}
              />

              {/* Botón Mute/Unmute */}
              <button
                type="button"
                onClick={() => setIsMuted((v) => !v)}
                className="absolute z-20 bottom-6 right-6 px-3 py-2 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/70 transition-colors text-sm flex items-center gap-2"
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar video'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  {isMuted ? (
                    // Icono de volumen off
                    <path fillRule="evenodd" d="M9.586 5.586A2 2 0 0111 5h.172a2 2 0 011.414.586l2.828 2.828A2 2 0 0116 9.828V14.17a2 2 0 01-.586 1.414l-2.828 2.828A2 2 0 0111.172 19H11a2 2 0 01-1.414-.586L6.757 15.586A2 2 0 016 14.172V9.828a2 2 0 01.586-1.414l2.828-2.828A2 2 0 019.586 5.586zM19.293 4.293a1 1 0 011.414 1.414L5.707 20.707a1 1 0 11-1.414-1.414L19.293 4.293z" clipRule="evenodd" />
                  ) : (
                    // Icono de volumen on
                    <path d="M14.5 5.5a1 1 0 011.707-.707l2 2a1 1 0 010 1.414l-2 2A1 1 0 0115.5 9V7a1 1 0 01-.293-.707zM4 9a1 1 0 011-1h2.586l2.121-2.121A2 2 0 0111.414 5H12a2 2 0 012 2v10a2 2 0 01-2 2h-.586a2 2 0 01-1.414-.586L7.586 16H5a1 1 0 01-1-1V9z" />
                  )}
                </svg>
                <span>{isMuted ? 'Sonido off' : 'Sonido on'}</span>
              </button>
            </>
          )}
        </div>
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <div className={`inline-block transition-all duration-1000 delay-300 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              <span className={`text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {heroText.h1}
              </span>
            </div>

            <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight transition-all duration-1000 delay-500 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              {(() => {
                const sub = heroText.subtitle;
                const len = sub.length;
                const s = Math.max(0, Math.min(Number(heroText.gradientStart), len));
                const e = Math.max(0, Math.min(Number(heroText.gradientEnd), len));
                const start = Math.min(s, e);
                const end = Math.max(s, e);
                const a = sub.slice(0, start);
                const b = sub.slice(start, end);
                const c = sub.slice(end);
                return (
                  <>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
                      {a}
                    </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                      {b}
                    </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
                      {c}
                    </span>
                  </>
                );
              })()}
            </h1>

            <p className={`text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              {heroText.description}
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center pt-8 transition-all duration-1000 delay-900 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              <a
                href="/projects"
                className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Ver proyectos</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="/contact"
                className="px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-full font-medium text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105"
              >
                Hablemos
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
    </>
  );
}
