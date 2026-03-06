import { motion } from "framer-motion";
import { ArrowUpRight, GitPullRequest, ArrowLeft, Calendar, GitCommit, ArrowDownUp, CheckCircle2, Circle, Star } from "lucide-react";
import { Link } from 'react-router-dom';
import PageTransition from "../components/PageTransition";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useEffect, useState } from "react";
import Magnetic from "../components/Magnetic";

interface PullRequest {
  title: string;
  repo: string;
  url: string;
  description: string;
  status: "Merged" | "Open" | "Closed";
  date: string;
  additions: number;
  deletions: number;
  languages: string[];
  isTopRepo?: boolean;
}

interface PRData {
  prs: PullRequest[];
  topRepos: string[];
  lastUpdated: string;
  total: number;
  open: number;
  merged: number;
}

const PullRequests = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const [data, setData] = useState<PRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"status" | "date" | "repo">("status");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/pr-data.json');
        if (!response.ok) {
          throw new Error('Failed to load PR data');
        }
        const prData = await response.json();
        setData(prData);
      } catch (err) {
        console.error('Error loading PR data:', err);
        setError('Failed to load pull requests data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sort PRs based on current sort settings
  const sortedPRs = data ? [...data.prs].sort((a, b) => {
    // First, prioritize top repos
    const aIsTop = a.isTopRepo || false;
    const bIsTop = b.isTopRepo || false;
    
    if (aIsTop && !bIsTop) return -1;
    if (!aIsTop && bIsTop) return 1;
    
    // Within same priority group, sort by selected field
    if (sortBy === "status") {
      const statusOrder = { "Open": 0, "Merged": 1, "Closed": 2 };
      const aOrder = statusOrder[a.status];
      const bOrder = statusOrder[b.status];
      return sortOrder === "asc" ? aOrder - bOrder : bOrder - aOrder;
    } else if (sortBy === "date") {
      const dateA = new Date(a.date.split(' ').reverse().join(' ')).getTime();
      const dateB = new Date(b.date.split(' ').reverse().join(' ')).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === "asc" 
        ? a.repo.localeCompare(b.repo) 
        : b.repo.localeCompare(a.repo);
    }
  }) : [];

  const toggleSort = (newSortBy: "status" | "date" | "repo") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  return (
    <PageTransition>
      <section className="min-h-screen py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative z-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Magnetic>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </Magnetic>
          </div>

          <div
            ref={ref}
            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
          >
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20 text-accent">
                  <GitPullRequest className="w-8 h-8" />
                </div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
                  Open Source <span className="text-accent">Contributions</span>
                </h2>
              </motion.div>
              <p className="text-xl text-white/60 max-w-2xl font-light leading-relaxed">
                Impactful contributions to the open source ecosystem, ranging from feature implementations to core architectural improvements.
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-sm text-white/50 flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4" />
                Sort by:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleSort("status")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    sortBy === "status" 
                      ? "bg-accent text-black" 
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <GitPullRequest className="w-4 h-4" />
                  Status
                  {sortBy === "status" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </button>
                <button
                  onClick={() => toggleSort("date")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    sortBy === "date" 
                      ? "bg-accent text-black" 
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Date
                  {sortBy === "date" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </button>
                <button
                  onClick={() => toggleSort("repo")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    sortBy === "repo" 
                      ? "bg-accent text-black" 
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <GitCommit className="w-4 h-4" />
                  Repository
                  {sortBy === "repo" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </button>
              </div>

              {/* PR Count */}
              <div className="ml-auto flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-green-400">
                  <Circle className="w-3 h-3 fill-current" />
                  {data?.open || 0} Open
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <CheckCircle2 className="w-3 h-3 fill-current" />
                  {data?.merged || 0} Merged
                </span>
              </div>
            </div>

            {/* Last Updated */}
            {data?.lastUpdated && (
              <div className="mb-4 text-xs text-white/40">
                Last updated: {new Date(data.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            )}

            {/* Top Repos Section */}
            {data?.topRepos && data.topRepos.length > 0 && !loading && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold text-white">My Contributions</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.topRepos.map(repo => (
                    <span 
                      key={repo}
                      className="px-3 py-1.5 rounded-full text-sm bg-accent/10 text-accent border border-accent/20 flex items-center gap-2"
                    >
                      <GitCommit className="w-3 h-3" />
                      {repo}
                      <span className="text-white/40 text-xs">
                        ({data.prs.filter(pr => pr.repo === repo).length})
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
                ))}
              </div>
            ) : error ? (
              <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-200 text-center">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedPRs.map((pr, index) => (
                  <motion.a
                    key={index}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative flex flex-col p-6 md:p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-accent/50 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`
                            px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5
                            ${pr.status === "Merged"
                              ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                              : pr.status === "Open"
                                ? "bg-green-500/10 text-green-300 border-green-500/20"
                                : "bg-red-500/10 text-red-300 border-red-500/20"
                            }
                          `}>
                            <GitPullRequest className="w-3 h-3" />
                            {pr.status}
                          </div>
                          <span className="text-xs text-white/40 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {pr.date}
                          </span>
                        </div>

                        <div className="p-2 rounded-full bg-white/5 text-white/40 group-hover:text-white group-hover:bg-accent transition-all duration-300">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                        {pr.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-white/50 mb-4 font-mono">
                        <GitCommit className="w-4 h-4" />
                        <span>{pr.repo}</span>
                        {pr.isTopRepo && (
                          <Star className="w-3 h-3 text-accent fill-accent" />
                        )}
                      </div>

                      <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                        {pr.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded">+{pr.additions}</span>
                          <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded">-{pr.deletions}</span>
                        </div>

                        <div className="flex gap-2">
                          {pr.languages.map((lang) => (
                            <span key={lang} className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded border border-white/5">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default PullRequests;
