import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';

const Home = React.lazy(() => import('./pages/Home'));
const PullRequests = React.lazy(() => import('./pages/PullRequests'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
  </div>
);
import ScrollProgress from './components/ScrollProgress';
import PageTransition from './components/PageTransition';
import Hero from './components/Hero';
import SmoothScroll from './components/SmoothScroll';
import HandsBackground from './components/HandsBackground';
import AppErrorBoundary from './components/AppErrorBoundary';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <SmoothScroll />
        <HandsBackground>
          <AppErrorBoundary>
            <PageTransition>
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
            </PageTransition>
          </AppErrorBoundary>
        </HandsBackground>
      </Router>
    </ThemeProvider>
  );
}

export default App;
