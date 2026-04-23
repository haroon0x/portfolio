import React from 'react';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export default class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-[100svh] flex items-center justify-center px-6">
          <div className="max-w-lg text-center rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
            <h1 className="text-2xl font-semibold text-white text-balance">Something went wrong</h1>
            <p className="mt-3 text-white/70 text-pretty">
              Unexpected error crashed this page. Refresh once. If issue persists, come back later.
            </p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
