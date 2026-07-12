import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ScrollProgress from './components/ScrollProgress';
import Hero from './components/Hero';
import SmoothScroll from './components/SmoothScroll';
import HandsBackground from './components/HandsBackground';
import LilyGarden from './components/LilyGarden';
import AppErrorBoundary from './components/AppErrorBoundary';

const Home = React.lazy(() => import('./pages/Home'));
const PullRequests = React.lazy(() => import('./pages/PullRequests'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
  </div>
);

function AppShell() {
  const { theme } = useTheme();
  const Wrapper = theme === 'dark' ? HandsBackground : LilyGarden;

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <SmoothScroll />
      <Wrapper>
        <AppErrorBoundary>
          <MotionConfig reducedMotion="user">
            <div className="min-h-screen text-text-primary">
              <ScrollProgress />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<><Hero /><Home /></>} />
                  <Route path="/pull-requests" element={<PullRequests />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </MotionConfig>
        </AppErrorBoundary>
      </Wrapper>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </Router>
  );
}

export default App;
