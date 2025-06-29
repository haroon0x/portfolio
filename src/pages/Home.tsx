import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Work from '../components/Work';
import Blog from '../components/Blog';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Work />
        <About />
        <Blog />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}