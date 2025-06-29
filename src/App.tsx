import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Services from './components/Services';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import PageTransition from './components/PageTransition';

function App() {
  return (
    <ThemeProvider>
      <PageTransition>
        <div className="min-h-screen bg-black text-white">
          <CustomCursor />
          <ScrollProgress />
          <Header />
          <main>
            <Hero />
            <About />
            <Work />
            <Services />
          </main>
          <Footer />
        </div>
      </PageTransition>
    </ThemeProvider>
  );
}

export default App;