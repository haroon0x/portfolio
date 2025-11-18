import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import Home from './pages/Home';
import PullRequests from './pages/PullRequests';
import ScrollProgress from './components/ScrollProgress';
import PageTransition from './components/PageTransition';
import Hero from './components/Hero';
import SmoothScroll from './components/SmoothScroll';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <SmoothScroll />
        <PageTransition>
          <div className="min-h-screen bg-black text-white">
            <ScrollProgress />
            <Routes>
              <Route path="/" element={<><Hero /><Home /></>} />
              <Route path="/pull-requests" element={<PullRequests />} />
            </Routes>
          </div>
        </PageTransition>
      </Router>
    </ThemeProvider>
  );
}

export default App