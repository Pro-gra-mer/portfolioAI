'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Callback-ref based hook to ensure the observer attaches even when the ref is null on first render
export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  const ref = useCallback(
    (node) => {
      // Disconnect any previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (node) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              // Once visible, we can stop observing to avoid extra work
              observer.disconnect();
              observerRef.current = null;
            }
          },
          {
            threshold,
            rootMargin: '50px',
          }
        );

        observerRef.current = observer;
        observer.observe(node);
      }
    },
    [threshold]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return { ref, isVisible };
}
