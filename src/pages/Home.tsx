import React from 'react';
import Header from '../components/Header';
import Work from '../components/Work';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Work order="latest" />
      </main>
      <Footer />
    </>
  );
}