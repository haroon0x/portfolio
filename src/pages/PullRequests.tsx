import { motion } from "framer-motion";
import { ArrowUpRight, GitPullRequest, ArrowLeft, Calendar, GitCommit, ArrowDownUp, CheckCircle2, Circle, Star, Building2, Filter, Trophy } from "lucide-react";
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
  bounty?: string;
}

interface PRData {
  prs: PullRequest[];
  topRepos: string[];
  lastUpdated: string;
  total: number;
  open: number;
  merged: number;
}

interface OrgStats {
  name: string;
  repos: string[];
  totalPRs: number;
  mergedPRs: number;
  openPRs: number;
  totalAdditions: number;
  totalDeletions: number;
  languages: string[];
  isTopOrg: boolean;
}

const PullRequests = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const [data, setData] = useState<PRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"status" | "date" | "repo">("status")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"all" | "merged" | "open">("all");
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());

  const topOrgs = ["kubeflow", "mem0ai", "google-deepmind", "meta-llama", "OWASP"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/pr-data.json');
        if (!response.ok) throw new Error('Failed to load PR data');
        const prData = (await response.json()) as PRData;
        setData(prData);
        const prsArray: string[] = prData.prs.map((pr: PullRequest) => pr.repo.split('/')[0]);
        const orgs = Array.from(new Set<string>(prsArray));
        setExpandedOrgs(new Set<string>(orgs));
      } catch (err) {
        console.error('Error loading PR data:', err);
        setError('Failed to load pull requests data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const orgStats: OrgStats[] = data ? Object.entries(
    data.prs.reduce((acc: Record<string, PullRequest[]>, pr: PullRequest) => {
      const org = pr.repo.split('/')[0];
      if (!acc[org]) acc[org] = [];
      acc[org].push(pr);
      return acc;
    }, {})
  ).map(([org, prs]) => {
    const prList = prs as PullRequest[];
    const allLanguages = prList.flatMap(pr => pr.languages);
    return {
      name: org,
      repos: [...new Set(prList.map(pr => pr.repo))],
      totalPRs: prList.length,
      mergedPRs: prList.filter(pr => pr.status === "Merged").length,
      openPRs: prList.filter(pr => pr.status === "Open").length,
      totalAdditions: prList.reduce((sum, pr) => sum + pr.additions, 0),
      totalDeletions: prList.reduce((sum, pr) => sum + pr.deletions, 0),
      languages: [...new Set(allLanguages)].slice(0, 5),
      isTopOrg: topOrgs.includes(org.toLowerCase())
    };
  }).sort((a, b) => {
    if (a.isTopOrg && !b.isTopOrg) return -1;
    if (!a.isTopOrg && b.isTopOrg) return 1;
    return b.totalPRs - a.totalPRs;
  }) : [];

  const toggleOrg = (orgName: string) => {
    setExpandedOrgs(prev => {
      const newSet = new Set(prev);
      newSet.has(orgName) ? newSet.delete(orgName) : newSet.add(orgName);
      return newSet;
    });
  };

  // Filter and sort PRs
  const getFilteredAndSortedPRs = () => {
    if (!data) return [];
    
    let prs = [...data.prs];
    
    // Apply status filter
    if (filterStatus !== "all") {
      prs = prs.filter(pr => pr.status.toLowerCase() === filterStatus);
    }
    
    // Sort
    return prs.sort((a, b) => {
      const aIsTop = a.isTopRepo || false;
      const bIsTop = b.isTopRepo || false;
      
      if (aIsTop && !bIsTop) return -1;
      if (!aIsTop && bIsTop) return 1;
      
      if (sortBy === "status") {
        const statusOrder = { "Merged": 2, "Open": 1, "Closed": 0 };
        const aOrder = statusOrder[a.status];
        const bOrder = statusOrder[b.status];
        return sortOrder === "asc" ? aOrder - bOrder : bOrder - aOrder;
      } else if (sortBy === "date") {
        const dateA = new Date(a.date.split(' ').reverse().join(' ')).getTime();
        const dateB = new Date(b.date.split(' ').reverse().join(' ')).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === "asc" ? a.repo.localeCompare(b.repo) : b.repo.localeCompare(a.repo);
      }
    });
  };

  const toggleSort = (newSortBy: "status" | "date" | "repo") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === "status" ? "desc" : "asc");
    }
  };

  const filteredPRs = getFilteredAndSortedPRs();

  const totalBounty = data ? data.prs.reduce((acc, pr) => {
    if (pr.bounty) {
      const amount = parseFloat(pr.bounty.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(amount)) return acc + amount;
    }
    return acc;
  }, 0) : 0;

  return (
    <PageTransition>
      <section className="min-h-screen py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative z-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Magnetic>
              <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </Magnetic>
          </div>

          <div ref={ref} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="mb-16">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center gap-4 mb-6">
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

            {/* Stats Overview */}
            {data && !loading && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/10 flex flex-col justify-between">
                  <p className="text-3xl font-bold text-white">{data.total}</p>
                  <p className="text-sm text-white/50">Total PRs</p>
                </div>
                <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <p className="text-3xl font-bold text-yellow-400">${totalBounty}</p>
                  </div>
                  <p className="text-sm text-yellow-300">Total Bounties</p>
                </div>
                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col justify-between">
                  <p className="text-3xl font-bold text-purple-400">{data.merged}</p>
                  <p className="text-sm text-purple-300">Merged</p>
                </div>
                <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20">
                  <p className="text-3xl font-bold text-green-400">{data.open}</p>
                  <p className="text-sm text-green-300">Open</p>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/10">
                  <p className="text-3xl font-bold text-white">+{data.prs.reduce((s, pr) => s + pr.additions, 0)}</p>
                  <p className="text-sm text-white/50">Lines Added</p>
                </div>
              </div>
            )}

            {/* Organization Cards */}
            {orgStats.length > 0 && !loading && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-semibold text-white">Organizations</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orgStats.map((org, index) => (
                    <motion.div
                      key={org.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                        org.isTopOrg ? "bg-gradient-to-br from-accent/10 to-purple-500/10 border border-accent/20 hover:border-accent/50" : "bg-zinc-900/40 border border-white/10 hover:border-white/20"
                      }`}
                    >
                      <button onClick={() => toggleOrg(org.name)} className="w-full p-5 text-left">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-lg font-bold text-white">{org.name}</h4>
                              {org.isTopOrg && <Star className="w-4 h-4 text-accent fill-accent" />}
                            </div>
                            <p className="text-sm text-white/50">{org.repos.length} repos • {org.totalPRs} PRs</p>
                          </div>
                          <ArrowUpRight className={`w-5 h-5 text-white/40 transition-transform duration-300 ${expandedOrgs.has(org.name) ? 'rotate-90' : ''}`} />
                        </div>

                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-purple-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{org.mergedPRs} merged</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-green-400">
                            <Circle className="w-3.5 h-3.5" />
                            <span>{org.openPRs} open</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {org.languages.map(lang => (
                            <span key={lang} className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">{lang}</span>
                          ))}
                        </div>
                      </button>

                      <motion.div
                        initial={false}
                        animate={{ height: expandedOrgs.has(org.name) ? 'auto' : 0, opacity: expandedOrgs.has(org.name) ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-2">
                          {filteredPRs.filter(pr => pr.repo.startsWith(org.name + '/')).slice(0, 5).map((pr, i) => (
                            <a key={i} href={pr.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group/pr">
                              <div className={`w-2 h-2 rounded-full ${pr.status === "Merged" ? "bg-purple-500" : pr.status === "Open" ? "bg-green-500" : "bg-red-500"}`} />
                              <span className="text-sm text-white/70 group-hover/pr:text-white truncate flex-1">{pr.title}</span>
                              <GitPullRequest className="w-3.5 h-3.5 text-white/40" />
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm text-white/50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filterStatus === "all" ? "bg-accent text-black" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  All ({data?.total || 0})
                </button>
                <button
                  onClick={() => setFilterStatus("merged")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                    filterStatus === "merged" ? "bg-purple-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Merged ({data?.merged || 0})
                </button>
                <button
                  onClick={() => setFilterStatus("open")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                    filterStatus === "open" ? "bg-green-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <Circle className="w-4 h-4" />
                  Open ({data?.open || 0})
                </button>
              </div>

              <span className="text-sm text-white/50 flex items-center gap-2 ml-4">
                <ArrowDownUp className="w-4 h-4" />
                Sort:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleSort("status")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    sortBy === "status" ? "bg-accent text-black" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("date")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    sortBy === "date" ? "bg-accent text-black" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("repo")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    sortBy === "repo" ? "bg-accent text-black" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <GitCommit className="w-4 h-4" />
                  Repo {sortBy === "repo" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>

            {/* Last Updated */}
            {data?.lastUpdated && (
              <div className="mb-6 text-xs text-white/40">
                Last updated: {new Date(data.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
                ))}
              </div>
            ) : error ? (
              <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-200 text-center">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPRs.map((pr, index) => (
                  <motion.a
                    key={index}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group relative flex flex-col p-6 md:p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-accent/50 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${
                            pr.status === "Merged" ? "bg-purple-500/10 text-purple-300 border-purple-500/20" : 
                            pr.status === "Open" ? "bg-green-500/10 text-green-300 border-green-500/20" : "bg-red-500/10 text-red-300 border-red-500/20"
                          }`}>
                            <GitPullRequest className="w-3 h-3" />
                            {pr.status}
                          </div>
                          <span className="text-xs text-white/40 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {pr.date}
                          </span>
                          {pr.bounty && (
                            <div className="px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                              <Trophy className="w-3 h-3" />
                              {pr.bounty} Bounty
                            </div>
                          )}
                        </div>
                        <div className="p-2 rounded-full bg-white/5 text-white/40 group-hover:text-white group-hover:bg-accent transition-all duration-300">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">{pr.title}</h3>

                      <div className="flex items-center gap-2 text-sm text-white/50 mb-4 font-mono">
                        <GitCommit className="w-4 h-4" />
                        <span>{pr.repo}</span>
                        {pr.isTopRepo && <Star className="w-3 h-3 text-accent fill-accent" />}
                      </div>

                      <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{pr.description}</p>

                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded">+{pr.additions}</span>
                          <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded">-{pr.deletions}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {pr.languages.map((lang) => (
                            <span key={lang} className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded border border-white/5">{lang}</span>
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
