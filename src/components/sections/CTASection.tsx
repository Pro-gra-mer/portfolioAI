"use client";

import { useScrollAnimation } from '@/components/useScrollAnimation';
import Link from 'next/link';

export default function CTASection() {
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.1);

  return (
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
          ¿Tienes un proyecto en mente?
        </h2>
        <p className={`text-xl text-white/90 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          Colaboremos para crear algo extraordinario. Desde la idea inicial hasta el lanzamiento y más allá.
        </p>
        <Link
          href="/contact"
          className={`inline-block px-10 py-5 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl`}
        >
          Iniciar conversación
        </Link>
      </div>
    </section>
  );
}
