import React, { useState, useEffect } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-all duration-1000 ${
        isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="text-center space-y-8">
          {/* Logo Animation */}
          <div className="text-4xl font-light gradient-text animate-pulse-minimal">
            haroon0x
          </div>
          
          {/* Loading Animation */}
          <div className="flex space-x-2 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-1000 ${
        isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
      }`}>
        {children}
      </div>
    </>
  );
}