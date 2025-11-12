import { useState, useEffect, RefObject } from 'react';

// Check if IntersectionObserver is available (once, outside component)
const hasIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;

export function useOnScreen(ref: RefObject<HTMLElement | null>): boolean {
  // Initialize state based on IntersectionObserver availability
  const [isIntersecting, setIntersecting] = useState(!hasIntersectionObserver);

  useEffect(() => {
    // If IntersectionObserver is not available, element is already visible
    if (!hasIntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when element comes into view
        if (entry && entry.isIntersecting) {
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
