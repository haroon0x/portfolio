import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import Home from './pages/Home';
import PullRequests from './pages/PullRequests';
import ScrollProgress from './components/ScrollProgress';
import PageTransition from './components/PageTransition';
import Hero from './components/Hero';
import SmoothScroll from './components/SmoothScroll';
import HandsBackground from './components/HandsBackground';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <SmoothScroll />
        <HandsBackground>
          <PageTransition>
            <div className="min-h-screen text-text-primary">
              <ScrollProgress />
              <Routes>
                <Route path="/" element={<><Hero /><Home /></>} />
                <Route path="/pull-requests" element={<PullRequests />} />
              </Routes>
            </div>
          </PageTransition>
        </HandsBackground>
      </Router>
    </ThemeProvider>
  );
}

export default App;