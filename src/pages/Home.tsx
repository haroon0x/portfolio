import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import OpenSourceProof from '../components/OpenSourceProof';
import Work from '../components/Work';

const sectionHashes = new Set(['#hero', '#work', '#about']);

export default function Home() {
  const { hash } = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionHashes.has(hash)) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash, shouldReduceMotion]);

  return (
    <main id="main-content">
      <Hero />
      <OpenSourceProof />
      <Work />
    </main>
  );
}
