import { motion } from "framer-motion";
import { ArrowUpRight, GitPullRequest, ArrowLeft, Loader2, Calendar, FileCode, GitCommit } from "lucide-react";
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
}

const prUrls = [
  "https://github.com/gemma-facet/cloud-services/pull/82",
  "https://github.com/gemma-facet/synthetic-data-kit/pull/1",
  "https://github.com/gemma-facet/synthetic-data-kit/pull/2",
  "https://github.com/sktime/sktime/pull/7795",
];

const PullRequests = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const prs = await Promise.all(
          prUrls.map(async (url) => {
            try {
              const urlParts = url.split('/');
              const owner = urlParts[3];
              const repo = urlParts[4];
              const prNumber = urlParts[6];
              const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;

              const response = await fetch(apiUrl, {
                headers: {
                  'Accept': 'application/vnd.github.v3+json'
                }
              });

              if (!response.ok) {
                throw new Error(`Failed to fetch PR data: ${response.status}`);
              }

              const data = await response.json();

              // Try to fetch languages
              let languages: string[] = [];
              if (data.head && data.head.repo && data.head.repo.languages_url) {
                try {
                  const langResponse = await fetch(data.head.repo.languages_url, {
                    headers: {
                      'Accept': 'application/vnd.github.v3+json'
                    }
                  });

                  if (langResponse.ok) {
                    const langData = await langResponse.json();
                    languages = Object.keys(langData).slice(0, 3); // Limit to top 3
                  }
                } catch {
                  // Silently ignore language fetch errors
                }
              }

              return {
                title: data.title,
                repo: `${owner}/${repo}`,
                url: data.html_url,
                description: data.body?.slice(0, 120) + '...' || 'No description provided',
                status: data.merged ? "Merged" : (data.state === "open" ? "Open" : "Closed") as "Merged" | "Open" | "Closed",
                date: new Date(data.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                additions: data.additions || 0,
                deletions: data.deletions || 0,
                languages
              };
            } catch {
              return null;
            }
          })
        );

        const validPRs = prs.filter((pr): pr is PullRequest => pr !== null);
        setPullRequests(validPRs);
      } catch (error) {
        console.error('Error fetching PR data:', error);
        setError('Failed to fetch pull requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPRs();
  }, []);

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
                {pullRequests.map((pr, index) => (
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
                    {/* Hover Gradient */}
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