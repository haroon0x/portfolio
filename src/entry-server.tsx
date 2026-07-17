import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppContent } from './App';
import type { PRData } from './data/prData';

export function render(url: string, initialPRData?: PRData) {
  return renderToString(
    <StaticRouter location={url}>
      <AppContent initialPRData={initialPRData} />
    </StaticRouter>,
  );
}
