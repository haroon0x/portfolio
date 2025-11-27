import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';

interface Project {
    title: string;
    description: string;
    tags: string[];
    link?: string;
    github?: string;
    image?: string;
    size?: 'small' | 'medium' | 'large';
}

interface BentoGridProps {
    projects: Project[];
}

const BentoGrid: React.FC<BentoGridProps> = ({ projects }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {projects.map((project, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`
            group relative overflow-hidden rounded-3xl border border-white/10 bg-surface/50 backdrop-blur-md
            hover:border-accent/50 transition-colors duration-500
            ${project.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
            ${project.size === 'medium' ? 'md:col-span-2' : ''}
            ${project.size === 'small' ? 'md:col-span-1' : ''}
          `}
                >
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
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                            <Github size={18} />
                                        </a>
                                    )}
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
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
            ))}
        </div>
    );
};

export default BentoGrid;
