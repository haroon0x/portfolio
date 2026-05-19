import { motion } from "framer-motion";
import { ArrowUpRight, GitPullRequest, ArrowLeft, Calendar, GitCommit, ArrowDownUp, CheckCircle2, Circle, Building2, Filter } from "lucide-react";
import { Link } from 'react-router-dom';
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

  const topOrgs = ["kubeflow", "mem0ai", "google-deepmind", "meta-llama", "owasp", "meshery", "potpie-ai", "retroshare", "moorcheh-ai"];

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
      if (newSet.has(orgName)) {
        newSet.delete(orgName);
      } else {
        newSet.add(orgName);
      }
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
        const dateA = Date.parse(a.date);
        const dateB = Date.parse(b.date);
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

  return (
      <section className="safe-x fluid-section relative z-10 min-h-[100svh] bg-background sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <Magnetic>
              <Link to="/" aria-label="Back to home page" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </Magnetic>
          </div>

          <div ref={ref} className={`transition-[opacity,transform] duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="mb-10 sm:mb-16">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-5 flex items-start gap-3 sm:mb-6 sm:items-center sm:gap-4">
                <div className="rounded-2xl border border-accent/20 bg-accent/10 p-2.5 text-accent sm:p-3">
                  <GitPullRequest className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h2 className="text-[clamp(2rem,10vw,3.5rem)] font-bold leading-tight text-white text-balance md:text-5xl">
                  Open Source <span className="text-accent">Contributions</span>
                </h2>
              </motion.div>
              <p className="max-w-prose text-base leading-7 text-white/60 sm:text-xl sm:leading-relaxed font-light text-pretty">
                Impactful contributions to the open source ecosystem, ranging from feature implementations to core architectural improvements.
              </p>
            </div>

            {/* Stats Overview */}
            {data && !loading && (
              <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 md:mb-12 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5 flex flex-col justify-between">
                  <p className="text-2xl font-bold text-white tabular-nums sm:text-3xl">{data.total}</p>
                  <p className="text-sm text-white/50">Total PRs</p>
                </div>
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 sm:p-5 flex flex-col justify-between">
                  <p className="text-2xl font-bold text-purple-400 tabular-nums sm:text-3xl">{data.merged}</p>
                  <p className="text-sm text-purple-300">Merged</p>
                </div>
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 sm:p-5">
                  <p className="text-2xl font-bold text-green-400 tabular-nums sm:text-3xl">{data.open}</p>
                  <p className="text-sm text-green-300">Open</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5">
                  <p className="text-2xl font-bold text-white tabular-nums sm:text-3xl">+{data.prs.reduce((s, pr) => s + pr.additions, 0)}</p>
                  <p className="text-sm text-white/50">Lines Added</p>
                </div>
              </div>
            )}

            {/* Organization Cards */}
            {orgStats.length > 0 && !loading && (
              <div className="mb-12">
                <div className="mb-6 flex items-center gap-2">
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
                      className={`group rounded-2xl overflow-hidden transition-[border-color,background-color,transform] duration-300 ${
                        org.isTopOrg ? "bg-gradient-to-br from-accent/10 to-purple-500/10 border border-accent/20 hover:border-accent/50" : "bg-zinc-900/40 border border-white/10 hover:border-white/20"
                      }`}
                    >
                      <button
                        onClick={() => toggleOrg(org.name)}
                        aria-expanded={expandedOrgs.has(org.name)}
                        aria-label={`Toggle ${org.name} pull request list`}
                        className="w-full p-4 text-left sm:p-5"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="truncate text-lg font-bold text-white">{org.name}</h4>
                            </div>
                            <p className="text-sm text-white/50">{org.repos.length} repos • {org.totalPRs} PRs</p>
                          </div>
                          <ArrowUpRight className={`h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 ${expandedOrgs.has(org.name) ? 'rotate-90' : ''}`} />
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm sm:gap-4">
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
                          {filteredPRs.filter(pr => pr.repo.startsWith(org.name + '/')).slice(0, 5).map((pr) => (
                            <a key={pr.url} href={pr.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group/pr">
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
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <span className="flex items-center gap-2 text-sm text-white/50">
                <Filter className="w-4 h-4" />
                Filter:
              </span>
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <button
                  onClick={() => setFilterStatus("all")}
                    aria-label="Show all pull requests"
                    className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.96] ${
                    filterStatus === "all" ? "bg-accent text-black" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  All ({data?.total || 0})
                </button>
                <button
                  onClick={() => setFilterStatus("merged")}
                    aria-label="Show merged pull requests"
                    className={`flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.96] ${
                    filterStatus === "merged" ? "bg-purple-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Merged ({data?.merged || 0})
                </button>
                <button
                  onClick={() => setFilterStatus("open")}
                    aria-label="Show open pull requests"
                    className={`flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.96] ${
                    filterStatus === "open" ? "bg-green-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <Circle className="w-4 h-4" />
                  Open ({data?.open || 0})
                </button>
              </div>

              <span className="flex items-center gap-2 text-sm text-white/50 sm:ml-4">
                <ArrowDownUp className="w-4 h-4" />
                Sort:
              </span>
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <button
                  onClick={() => toggleSort("status")}
                    aria-label="Sort pull requests by status"
                    className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.96] ${
                    sortBy === "status" ? "bg-accent text-black" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("date")}
                    aria-label="Sort pull requests by date"
                    className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.96] ${
                    sortBy === "date" ? "bg-accent text-black" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("repo")}
                    aria-label="Sort pull requests by repository"
                    className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.96] ${
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
                    key={pr.url}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="card-container group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-xl transition-[border-color,transform] duration-500 hover:border-accent/50 active:scale-[0.96] sm:rounded-3xl sm:p-6 md:p-8"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
                        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
                          <div className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                            pr.status === "Merged" ? "bg-purple-500/10 text-purple-300 border-purple-500/20" : 
                            pr.status === "Open" ? "bg-green-500/10 text-green-300 border-green-500/20" : "bg-red-500/10 text-red-300 border-red-500/20"
                          }`}>
                            <GitPullRequest className="w-3 h-3" />
                            {pr.status}
                          </div>
                          <span className="flex min-w-0 items-center gap-1.5 text-xs text-white/40">
                            <Calendar className="h-3 w-3 shrink-0" />
                            {pr.date}
                          </span>
                        </div>
                        <div className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-white/5 p-2 text-white/40 transition-[background-color,color,transform] duration-300 group-hover:bg-accent group-hover:text-white">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="cq-card-title mb-2 text-lg font-bold leading-snug text-white transition-colors duration-300 line-clamp-2 group-hover:text-accent sm:text-xl">{pr.title}</h3>

                      <div className="mb-4 flex min-w-0 items-center gap-2 font-mono text-xs text-white/50 sm:text-sm">
                        <GitCommit className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 truncate">{pr.repo}</span>
                      </div>

                      <p className="mb-6 flex-grow text-sm leading-7 text-white/60 line-clamp-3">{pr.description}</p>

                      <div className="mt-auto flex flex-col gap-4 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded tabular-nums">+{pr.additions}</span>
                          <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded tabular-nums">-{pr.deletions}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
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
  );
};

export default PullRequests;
