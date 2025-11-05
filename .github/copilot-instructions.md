# AI Agent Instructions for haroon0x Portfolio

This guide helps AI agents understand the essential patterns and workflows of this portfolio project.

## Project Overview

A React + TypeScript portfolio website showcasing AI/ML projects with:
- Modern React practices (hooks, context)
- Smooth page transitions and animations
- Theme switching with system preference detection
- Real-time GitHub integration

## Architecture & Patterns

### Frontend Structure
- `src/pages/` - Route components (`Home.tsx`, `PullRequests.tsx`)
- `src/components/` - Reusable UI components with animations
- `src/contexts/` - React Context providers (theme, etc.)
- `src/hooks/` - Custom React hooks

### Key Patterns

1. **Theme Management**
```tsx
// Use the useTheme hook for theme access:
import { useTheme } from '../hooks/useTheme';
const { isDark, toggleTheme } = useTheme();
```

2. **Page Transitions**
- Components are wrapped in `PageTransition` for smooth loading effects
- See `PageTransition.tsx` for animation implementation

3. **GitHub Integration**
- Webhook endpoint in `backend-webhoook/main.py` handles GitHub events
- Real-time PR updates in `pages/PullRequests.tsx`

## Development Workflow

### Setup & Running
```bash
# Frontend
npm install
npm run dev   # Start dev server

# Backend webhook (optional)
cd backend-webhoook
pip install -r requirements.txt
uvicorn main:app --reload
```

### Common Tasks
- Type checking: `npm run type-check`
- Linting: `npm run lint`
- Production build: `npm run build`

## Tech Stack Dependencies
- Vite for build tooling
- Framer Motion for animations
- Tailwind CSS for styling
- Lucide React for icons
- FastAPI for backend webhook

## Best Practices
1. Always wrap page content in `PageTransition` component
2. Use `useScrollAnimation` hook for scroll-triggered animations
3. Theme-sensitive styles should check `isDark` from ThemeContext
4. Keep components focused and reusable
5. Use TypeScript types/interfaces for component props

## Project Structure Summary
```
src/
  ├── components/   # Reusable UI components
  ├── contexts/    # React Context providers
  ├── hooks/       # Custom React hooks
  ├── pages/       # Route components
  └── App.tsx      # Root component
```