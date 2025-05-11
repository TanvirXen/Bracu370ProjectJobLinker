
import React, { useEffect, useRef, useState } from 'react';

type AnimationProps = {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-in' | 'scale-in';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
};

export function AnimatedElement({
  children,
  className = '',
  animation = 'fade-in',
  delay = 0,
  duration = 300,
  threshold = 0.1,
  once = true,
}: AnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold]);

  const animationClass = isVisible ? `animate-${animation}` : 'opacity-0';
  const style = {
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
  };

  return (
    <div ref={ref} className={`${animationClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
