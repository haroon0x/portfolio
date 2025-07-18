import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import ScrollProgress from './components/ScrollProgress';
import PageTransition from './components/PageTransition';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <PageTransition>
          <div className="min-h-screen bg-black text-white">
            <ScrollProgress />
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </PageTransition>
      </Router>
    </ThemeProvider>
  );
}

export default App