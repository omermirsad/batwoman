import { useState, useEffect, RefObject } from 'react';

export function useOnScreen(ref: RefObject<HTMLElement>): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    // Ensure IntersectionObserver is available
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        // Fallback for older browsers or server-side rendering
        setIntersecting(true);
        return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when element comes into view
        if (entry.isIntersecting) {
          setIntersecting(true);
          // Stop observing once it's visible
          observer.unobserve(entry.target);
        }
      },
      {
        // Trigger animation when element is 100px from the bottom of the viewport
        rootMargin: '0px 0px -100px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref]); // Only re-run the effect if the ref changes

  return isIntersecting;
}
