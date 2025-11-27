import React, { useEffect, useRef } from 'react';

const AsciiBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let mouse = { x: 0, y: 0 };

        // Configuration
        const charSize = 14;
        const chars = '01'; // Binary theme for "digital" feel
        // const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'; // Matrix style

        class Particle {
            x: number;
            y: number;
            char: string;
            color: string;
            originalX: number;
            originalY: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.originalX = x;
                this.originalY = y;
                this.char = chars[Math.floor(Math.random() * chars.length)];
                this.color = 'rgba(255, 255, 255, 0.05)'; // Default faint color
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.font = `${charSize}px "JetBrains Mono"`;
                ctx.fillText(this.char, this.x, this.y);
            }

            update() {
                // Interactive logic: brighten and move slightly when mouse is near
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    this.color = `rgba(0, 217, 255, ${force * 0.8})`; // Glow color (cyan)

                    // Slight movement away from mouse
                    // const angle = Math.atan2(dy, dx);
                    // this.x -= Math.cos(angle) * force * 2;
                    // this.y -= Math.sin(angle) * force * 2;
                } else {
                    this.color = 'rgba(255, 255, 255, 0.03)'; // Back to faint

                    // Return to original position
                    // this.x += (this.originalX - this.x) * 0.1;
                    // this.y += (this.originalY - this.y) * 0.1;
                }

                // Randomly change character for "glitch" effect
                if (Math.random() > 0.98) {
                    this.char = chars[Math.floor(Math.random() * chars.length)];
                }

                this.draw();
            }
        }

        const init = () => {
            if (!canvas || !containerRef.current) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            particles = [];
            const columns = Math.floor(canvas.width / charSize);
            const rows = Math.floor(canvas.height / charSize);

            for (let i = 0; i < columns; i++) {
                for (let j = 0; j < rows; j++) {
                    particles.push(new Particle(i * charSize, j * charSize));
                }
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => particle.update());

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-background text-text-primary overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            />
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default AsciiBackground;
