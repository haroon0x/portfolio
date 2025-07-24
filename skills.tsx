// ... existing code ...
return (
    <section id="work" className="py-16 sm:py-24 lg:py-32 bg-black relative overflow-hidden">
      {/* Minimal Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Skills Section */}
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 lg:mb-32"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white leading-none tracking-tighter mb-8">
          <span className="gradient-text font-light">Skills</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-zinc-900/60 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">Programming & Languages</h3>
            <div className="flex flex-wrap gap-2">
              {['Python', 'JavaScript', 'Java', 'C', 'SQL', 'Shell Scripting', 'HTML/CSS'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-zinc-800 text-white/80 rounded-full text-xs font-medium border border-white/10">{skill}</span>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900/60 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">AI & Machine Learning</h3>
            <div className="flex flex-wrap gap-2">
              {['Deep Learning', 'Neural Networks', 'XGBoost', 'PyTorch', 'Pandas', 'NumPy', 'Feature Engineering'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-zinc-800 text-white/80 rounded-full text-xs font-medium border border-white/10">{skill}</span>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900/60 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">Backend & APIs</h3>
            <div className="flex flex-wrap gap-2">
              {['FastAPI', 'Flask', 'REST APIs', 'CORS', 'JSON', 'HTTP', 'Web Scraping', 'Data Extraction', 'Chrome Extensions'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-zinc-800 text-white/80 rounded-full text-xs font-medium border border-white/10">{skill}</span>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900/60 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">AI Agents & Frameworks</h3>
            <div className="flex flex-wrap gap-2">
              {['Google ADK', 'SmolAgents', 'PocketFlow', 'Agent Architectures', 'LLMs', 'Automation'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-zinc-800 text-white/80 rounded-full text-xs font-medium border border-white/10">{skill}</span>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900/60 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">Containerization & DevOps</h3>
            <div className="flex flex-wrap gap-2">
              {['Docker', 'Container Orchestration', 'Git', 'GitHub', 'Postman', 'cURL', 'Render', 'Netlify', 'Supabase'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-zinc-800 text-white/80 rounded-full text-xs font-medium border border-white/10">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
// ... existing code ...