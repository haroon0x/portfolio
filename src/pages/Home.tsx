import React from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Work from '../components/Work';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Work />
        <About />
      </main>
      <Footer />
    </>
  );
}