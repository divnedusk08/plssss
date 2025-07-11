import React, { useRef, useState, useEffect } from 'react';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  className?: string;
}

const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}`}
    >
      {children}
    </div>
  );
};

export default FadeInOnScroll; 