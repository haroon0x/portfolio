import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import ScrollProgress from './components/ScrollProgress';
import AppErrorBoundary from './components/AppErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';

const Home = React.lazy(() => import('./pages/Home'));
const Blog = React.lazy(() => import('./pages/Blog'));
const PullRequests = React.lazy(() => import('./pages/PullRequests'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const SITE_ORIGIN = 'https://haroon0x.onrender.com';

interface RouteMetadata {
  title: string;
  description: string;
  schemaType: 'ProfilePage' | 'Blog' | 'CollectionPage' | 'WebPage';
  robots: string;
}

const PERSON_SCHEMA = {
  '@type': 'Person',
  '@id': `${SITE_ORIGIN}/#person`,
  name: 'Muhammed Haroon',
  alternateName: 'haroon0x',
  url: `${SITE_ORIGIN}/`,
  jobTitle: 'Independent Engineer & Builder',
  sameAs: [
    'https://github.com/haroon0x',
    'https://linkedin.com/in/muhammed-haroon-0399962b8',
    'https://x.com/skywalkerr0x',
  ],
  knowsAbout: [
    'Artificial intelligence',
    'Machine learning',
    'Developer tools',
    'Distributed systems',
    'Open-source software',
  ],
};

const WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': `${SITE_ORIGIN}/#website`,
  url: `${SITE_ORIGIN}/`,
  name: 'Muhammed Haroon',
  description: 'Muhammed Haroon is an independent engineer building reliable systems and ambitious products.',
  publisher: { '@id': `${SITE_ORIGIN}/#person` },
  inLanguage: 'en',
};

const ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': {
    title: 'Muhammed Haroon | Independent Engineer & Builder',
    description: 'Muhammed Haroon is an independent engineer building reliable systems and ambitious products.',
    schemaType: 'ProfilePage',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/pull-requests': {
    title: 'Open-Source Contributions | Muhammed Haroon',
    description: "Explore Muhammed Haroon's open-source contributions across infrastructure, developer tools, and AI systems.",
    schemaType: 'CollectionPage',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  '/blog': {
    title: 'Writing | Muhammed Haroon',
    description: 'Technical essays and engineering notes from Muhammed Haroon on building reliable systems, open source, and AI products.',
    schemaType: 'Blog',
    robots: 'noindex, follow',
  },
};

const NOT_FOUND_METADATA: RouteMetadata = {
  title: 'Page Not Found | Muhammed Haroon',
  description: "The requested page could not be found on Muhammed Haroon's portfolio.",
  schemaType: 'WebPage',
  robots: 'noindex, nofollow',
};

function createStructuredData(pathname: string, metadata: RouteMetadata) {
  const url = new URL(pathname, SITE_ORIGIN).href;
  const page: Record<string, unknown> = {
    '@type': metadata.schemaType,
    '@id': `${url}#webpage`,
    url,
    name: metadata.title,
    description: metadata.description,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    inLanguage: 'en',
  };

  if (metadata.schemaType === 'ProfilePage') {
    page.mainEntity = { '@id': `${SITE_ORIGIN}/#person` };
  } else if (metadata.schemaType !== 'WebPage') {
    page.author = { '@id': `${SITE_ORIGIN}/#person` };
    page.about = { '@id': `${SITE_ORIGIN}/#person` };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [PERSON_SCHEMA, WEBSITE_SCHEMA, page],
  };
}

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
  </div>
);

function RouteScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

function RouteMetadataManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = ROUTE_METADATA[pathname] ?? NOT_FOUND_METADATA;
    const pageUrl = new URL(pathname, SITE_ORIGIN).href;
    const updateMeta = (selector: string, content: string) => {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
    };

    document.title = metadata.title;
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', pageUrl);
    updateMeta('meta[name="description"]', metadata.description);
    updateMeta('meta[property="og:title"]', metadata.title);
    updateMeta('meta[property="og:description"]', metadata.description);
    updateMeta('meta[property="og:url"]', pageUrl);
    updateMeta('meta[name="twitter:title"]', metadata.title);
    updateMeta('meta[name="twitter:description"]', metadata.description);
    updateMeta('meta[name="robots"]', metadata.robots);
    const structuredData = document.querySelector<HTMLScriptElement>('#structured-data');
    if (structuredData) {
      structuredData.textContent = JSON.stringify(createStructuredData(pathname, metadata)).replaceAll('<', '\\u003c');
    }
  }, [pathname]);

  return null;
}

function AppShell() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <RouteScrollManager />
      <RouteMetadataManager />
      <div className="site-shell">
        <AppErrorBoundary>
          <MotionConfig reducedMotion="user">
            <div className="min-h-screen text-text-primary">
              <ScrollProgress />
              <Header />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/pull-requests" element={<PullRequests />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Footer />
            </div>
          </MotionConfig>
        </AppErrorBoundary>
      </div>
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
