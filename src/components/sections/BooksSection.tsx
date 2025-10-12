"use client";

import { useScrollAnimation } from '@/components/useScrollAnimation';
import Image from 'next/image';
import Link from 'next/link';

interface Book {
  title: string;
  subtitle?: string;
  description: string;
  amazonUrl: string;
  imageUrl: string;
  price: string;
  category: string;
}

const books: Book[] = [
  {
    title: "Java",
    subtitle: "Fundamentos sólidos del lenguaje",
    description: "Diseñado para proporcionar una base sólida en los aspectos fundamentales del lenguaje y en la programación orientada a objetos.",
    amazonUrl: "https://www.amazon.es/dp/B0DFWCBQN8",
    imageUrl: "/images/books/java.jpg",
    price: "€11.99",
    category: "Programación Backend"
  },
  {
    title: "JavaScript",
    subtitle: "Para principiantes",
    description: "Enseña a programar desde cero conectando los conceptos de la programación con ejemplos de la vida real.",
    amazonUrl: "https://www.amazon.es/dp/B0D5V5VFKM",
    imageUrl: "/images/books/javascript.jpg",
    price: "€10.99",
    category: "JavaScript"
  },
  {
    title: "React en 48h",
    subtitle: "Para principiantes",
    description: "Diseñado para que aprendas React de forma rápida y eficiente, utilizando analogías y ejemplos del mundo real que facilitan la comprensión de esta poderosa librería.",
    amazonUrl: "https://www.amazon.es/dp/B0DCVLBZV6",
    imageUrl: "/images/books/react.jpg",
    price: "€8.68",
    category: "React"
  }
];

export default function BooksSection() {
  const { ref: booksRef, isVisible: booksVisible } = useScrollAnimation(0.1);

  return (
    <section
      ref={booksRef}
      className={`py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900 transition-all duration-1000 ${
        booksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${
          booksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
         
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Libros que he escrito
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Publicaciones que han ayudado a retener conocimientos y mejorar mis habilidades en desarrollo web.
          </p>
        </div>

        {/* Books Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-500 ${
          booksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {books.map((book, index) => (
            <div
              key={index}
              className={`group relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                booksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Book Cover */}
              <div className="relative mb-6">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-xl relative">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                    onError={(e) => {
                      const parent = (e.target as HTMLElement).parentElement as HTMLElement | null;
                      if (parent) {
                        parent.style.background = 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)';
                      }
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Category Badge */}
                <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full shadow-lg">
                  {book.category}
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {book.title}
                  </h3>
                  {book.subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      {book.subtitle}
                    </p>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {book.description}
                </p>

                {/* Price and Buy Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {book.price}
                  </div>
                  <a
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Comprar en Amazon
                  </a>
                </div>
              </div>

              {/* Hover Effect Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-3xl transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${
          booksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            ¿Quieres conocer más sobre mi experiencia y conocimientos?
          </p>
          <Link
            href="/about"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 dark:from-white dark:to-gray-100 dark:hover:from-gray-100 dark:hover:to-gray-200 text-white dark:text-gray-900 font-medium rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Conoce más sobre mí
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
