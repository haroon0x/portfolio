import React, { useEffect, useRef } from 'react';

const HandsBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let offset = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawGrid = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gridSize = 40;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            // Horizontal lines (moving)
            for (let y = offset % gridSize; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            offset += 0.2; // Speed of grid movement
            animationFrameId = requestAnimationFrame(drawGrid);
        };

        window.addEventListener('resize', resize);
        resize();
        drawGrid();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-background text-text-primary overflow-hidden">
            {/* Background Image Layer */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: 'url(/hands-high-res.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    // Invert to make white bg dark, and hands light. 
                    // Grayscale to remove color noise.
                    // Opacity to blend with the dark background.
                    filter: 'grayscale(100%) invert(1) contrast(1.3) brightness(0.9)',
                    opacity: 0.7,
                    mixBlendMode: 'screen'
                }}
            />

            {/* Vignette / Gradient Overlay to fade edges */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-transparent to-background" />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-transparent to-background" />

            {/* Grid Overlay */}
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            />

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default HandsBackground;
