import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';

interface Project {
    title: string;
    description: string;
    tags: string[];
    link?: string;
    github?: string;
    image?: string;
    size?: 'small' | 'medium' | 'large' | 'wide';
}

interface BentoGridProps {
    projects: Project[];
}

const BentoCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`
                group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md
                hover:border-white/20 transition-colors duration-500
                ${project.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${project.size === 'medium' ? 'md:col-span-2' : ''}
                ${project.size === 'wide' ? 'md:col-span-3' : ''}
                ${project.size === 'small' ? 'md:col-span-1' : ''}
            `}
        >
            {/* Spotlight Effect */}
            <div
                className='pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100'
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
                }}
            />

            {/* Background Gradient/Image */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative h-full p-6 md:p-8 flex flex-col justify-between z-10">
                <div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-2 flex-wrap">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 border border-white/10 text-white/60">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {project.github && (
                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors z-20">
                                    <Github size={18} />
                                </a>
                            )}
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors z-20">
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    <h3 className="text-2xl font-heading font-bold text-white mb-2 group-hover:text-accent transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                        {project.description}
                    </p>
                </div>

                <div className="mt-auto pt-6">
                    <motion.div
                        className="flex items-center gap-2 text-accent font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                        <span>View Project</span>
                        <ArrowUpRight size={16} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

const BentoGrid: React.FC<BentoGridProps> = ({ projects }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] grid-flow-dense">
            {projects.map((project, index) => (
                <BentoCard key={index} project={project} index={index} />
            ))}
        </div>
    );
};

export default BentoGrid;
