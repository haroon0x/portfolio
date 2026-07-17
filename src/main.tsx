import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import type { PRData } from './data/prData.ts';
import './index.css';

const serializedPRData = document.getElementById('pr-data')?.textContent;
const initialPRData = serializedPRData ? JSON.parse(serializedPRData) as PRData : undefined;

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App initialPRData={initialPRData} />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
