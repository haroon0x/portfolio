import { motion } from "framer-motion";
import { ArrowUpRight, GitPullRequest, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from 'react-router-dom';
import PageTransition from "../components/PageTransition";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useEffect, useState } from "react";

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

              // Try to fetch languages, but don't fail if it's not available
              let languages = [];
              if (data.head && data.head.repo && data.head.repo.languages_url) {
                try {
                  const langResponse = await fetch(data.head.repo.languages_url, {
                    headers: {
                      'Accept': 'application/vnd.github.v3+json'
                    }
                  });

                  if (langResponse.ok) {
                    const langData = await langResponse.json();
                    languages = Object.keys(langData);
                  }
                } catch {
                  // Silently ignore language fetch errors
                }
              }

              return {
                title: data.title,
                repo: `${owner}/${repo}`,
                url: data.html_url,
                description: data.body?.slice(0, 150) + '...' || 'No description provided',
                status: data.merged ? "Merged" : (data.state === "open" ? "Open" : "Closed") as "Merged" | "Open" | "Closed",
                date: new Date(data.created_at).toLocaleDateString(),
                additions: data.additions || 0,
                deletions: data.deletions || 0,
                languages
              };
            } catch {
              return null;
            }
          })
        );

        const validPRs = prs.filter(pr => pr !== null);
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
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors duration-300 mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-light">Back to Home</span>
          </Link>

          <div
            ref={ref}
            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
          >
            {/* Subtle Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px'
              }}
            />

            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <GitPullRequest className="w-6 h-6 text-white/60" />
                </motion.div>
                <h2 className="text-4xl font-light text-white/90">
                  Pull Requests
                </h2>
              </div>
              <p className="text-lg text-white/60 max-w-3xl mx-auto font-light">
                Contributing to open source through meaningful code improvements and feature additions.
              </p>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-white/60" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : pullRequests.map((pr, index) => (
                <motion.div
                  key={index}
                  className={`group relative ${isVisible ? 'animate-fade-in' : ''
                    }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-light text-white group-hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                          {pr.title}
                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </h3>
                        <p className="text-white/40 mt-1 font-light">{pr.repo}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${pr.status === "Merged" ? "bg-purple-500/10 text-purple-300 border border-purple-500/20" :
                            pr.status === "Open" ? "bg-green-500/10 text-green-300 border border-green-500/20" :
                              "bg-red-500/10 text-red-300 border border-red-500/20"
                          }`}>
                          {pr.status}
                        </span>
                        <span className="text-sm text-white/40">{pr.date}</span>
                      </div>
                    </div>

                    <p className="text-white/60 mb-4 font-light">{pr.description}</p>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-4 text-sm font-light">
                        <span className="text-green-400/60">+{pr.additions}</span>
                        <span className="text-red-400/60">−{pr.deletions}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pr.languages.map((lang, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-full text-xs bg-white/5 text-white/60 border border-white/10"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default PullRequests;