import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, ArrowUpRight, Calendar, CheckCircle2, Circle, Filter, GitCommit, GitPullRequest, Search } from 'lucide-react';
import { loadPRData, type PRData, type PullRequest } from '../data/prData';

type SortBy = 'status' | 'date' | 'repo';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'merged' | 'open';

const PAGE_SIZE = 24;

const statusOrder: Record<PullRequest['status'], number> = {
  Merged: 2,
  Open: 1,
  Closed: 0,
};

const PullRequests = () => {
  const [data, setData] = useState<PRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('status');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let active = true;

    loadPRData()
      .then((prData) => {
        if (active) setData(prData);
      })
      .catch((err: unknown) => {
        if (!active) return;
        console.error('Error loading PR data:', err);
        setError('Failed to load pull requests data.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredPRs = useMemo(() => {
    if (!data) return [];

    const statusFiltered = filterStatus === 'all'
      ? [...data.prs]
      : data.prs.filter((pr) => pr.status.toLowerCase() === filterStatus);
    const query = searchQuery.trim().toLocaleLowerCase();
    const prs = query
      ? statusFiltered.filter((pr) => (
          pr.title.toLocaleLowerCase().includes(query) ||
          pr.repo.toLocaleLowerCase().includes(query) ||
          pr.description.toLocaleLowerCase().includes(query) ||
          pr.languages.some((language) => language.toLocaleLowerCase().includes(query))
        ))
      : statusFiltered;

    return prs.sort((a, b) => {
      if (sortBy === 'status') {
        const difference = statusOrder[a.status] - statusOrder[b.status];
        return sortOrder === 'asc' ? difference : -difference;
      }

      if (sortBy === 'date') {
        const difference = Date.parse(a.date) - Date.parse(b.date);
        return sortOrder === 'asc' ? difference : -difference;
      }

      const difference = a.repo.localeCompare(b.repo);
      return sortOrder === 'asc' ? difference : -difference;
    });
  }, [data, filterStatus, searchQuery, sortBy, sortOrder]);

  const visiblePRs = filteredPRs.slice(0, visibleCount);

  const totalAdditions = useMemo(
    () => data?.prs.reduce((total, pr) => total + pr.additions, 0) ?? 0,
    [data],
  );

  const toggleSort = (nextSortBy: SortBy) => {
    setVisibleCount(PAGE_SIZE);
    if (sortBy === nextSortBy) {
      setSortOrder((currentOrder) => currentOrder === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortBy(nextSortBy);
    setSortOrder(nextSortBy === 'status' ? 'desc' : 'asc');
  };

  const sortLabel = (label: string, value: SortBy) => (
    sortBy === value ? `Sort by ${label}, currently ${sortOrder === 'asc' ? 'ascending' : 'descending'}` : `Sort by ${label}`
  );

  const selectFilter = (status: FilterStatus) => {
    setFilterStatus(status);
    setVisibleCount(PAGE_SIZE);
  };

  const resetControls = () => {
    setFilterStatus('all');
    setSearchQuery('');
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <main id="main-content" className="safe-x mx-auto min-h-[100svh] max-w-[96rem] bg-background pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40 lg:px-12 lg:pb-40">
      <header className="max-w-5xl">
        <p className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-text-muted">Public engineering record</p>
        <h1 className="text-[clamp(2.6rem,6vw,7rem)] font-medium leading-[0.96] tracking-[-0.055em] text-text-primary">
          Open source contributions
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-text-secondary sm:text-xl sm:leading-9">
          Pull requests across infrastructure, developer tooling, machine learning, and the open-source systems behind them.
        </p>
      </header>

      {data && !loading && (
        <dl className="mt-14 grid grid-cols-2 border-y border-border sm:mt-20 md:grid-cols-4">
          <div className="flex flex-col border-b border-r border-border py-6 pr-5 md:border-b-0 md:px-6 md:first:pl-0">
            <dt className="order-2 mt-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">Total</dt>
            <dd className="order-1 text-3xl font-medium tabular-nums tracking-[-0.04em] text-text-primary sm:text-4xl">{data.total}</dd>
          </div>
          <div className="flex flex-col border-b border-border py-6 pl-5 md:border-b-0 md:border-r md:px-6">
            <dt className="order-2 mt-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">Merged</dt>
            <dd className="order-1 text-3xl font-medium tabular-nums tracking-[-0.04em] text-status-merged sm:text-4xl">{data.merged}</dd>
          </div>
          <div className="flex flex-col border-r border-border py-6 pr-5 md:px-6">
            <dt className="order-2 mt-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">Open</dt>
            <dd className="order-1 text-3xl font-medium tabular-nums tracking-[-0.04em] text-status-open sm:text-4xl">{data.open}</dd>
          </div>
          <div className="flex flex-col py-6 pl-5 md:px-6 md:last:pr-0">
            <dt className="order-2 mt-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">Additions</dt>
            <dd className="order-1 text-3xl font-medium tabular-nums tracking-[-0.04em] text-text-primary sm:text-4xl">+{totalAdditions.toLocaleString()}</dd>
          </div>
        </dl>
      )}

      <section aria-label="Pull request controls" className="mt-12 border-y border-border py-5 sm:mt-16">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p aria-live="polite" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text-primary">
            Showing {visiblePRs.length} of {filteredPRs.length} matches
          </p>
          {data?.lastUpdated && (
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-muted">
              Updated {new Date(data.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>

        <label className="relative mt-5 block max-w-2xl">
          <span className="sr-only">Search pull requests</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search title, repository, or technology"
            className="min-h-12 w-full rounded-control border border-border bg-surface py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted hover:border-border-strong focus:border-accent"
          />
        </label>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-muted">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </span>
            <button
              type="button"
              onClick={() => selectFilter('all')}
              aria-label="Show all pull requests"
              aria-pressed={filterStatus === 'all'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-colors ${filterStatus === 'all' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => selectFilter('merged')}
              aria-label="Show merged pull requests"
              aria-pressed={filterStatus === 'merged'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-colors ${filterStatus === 'merged' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              Merged
            </button>
            <button
              type="button"
              onClick={() => selectFilter('open')}
              aria-label="Show open pull requests"
              aria-pressed={filterStatus === 'open'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-colors ${filterStatus === 'open' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              Open
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-muted">
              <ArrowDownUp className="h-3.5 w-3.5" />
              Sort
            </span>
            <button
              type="button"
              onClick={() => toggleSort('status')}
              aria-label={sortLabel('status', 'status')}
              aria-pressed={sortBy === 'status'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-colors ${sortBy === 'status' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('date')}
              aria-label={sortLabel('date', 'date')}
              aria-pressed={sortBy === 'date'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-colors ${sortBy === 'date' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('repo')}
              aria-label={sortLabel('repository', 'repo')}
              aria-pressed={sortBy === 'repo'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-colors ${sortBy === 'repo' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              Repo {sortBy === 'repo' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </section>

      <section aria-label="Pull requests" className="mt-10 border-t border-border sm:mt-12">
        {loading ? (
          <div role="status" aria-label="Loading pull requests">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="grid animate-pulse gap-5 border-b border-border py-8 md:grid-cols-[10rem_minmax(0,1fr)_minmax(12rem,0.45fr)_2.75rem] md:gap-8">
                <div className="h-5 bg-surface-strong" />
                <div className="space-y-3">
                  <div className="h-4 w-1/3 bg-surface-strong" />
                  <div className="h-7 w-4/5 bg-surface-strong" />
                  <div className="h-4 w-full bg-surface" />
                </div>
                <div className="h-12 bg-surface" />
                <div className="h-11 w-11 border border-border bg-surface" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="border-b border-border py-10 text-status-closed">
            <p className="font-mono text-xs uppercase tracking-[0.14em]">{error}</p>
          </div>
        ) : filteredPRs.length === 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-border py-10">
            <p className="text-text-secondary">No pull requests match this search or filter.</p>
            <button
              type="button"
              onClick={resetControls}
              className="min-h-11 rounded-control border border-border px-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-primary transition-colors hover:border-accent hover:text-accent"
            >
              Reset to all
            </button>
          </div>
        ) : (
          <>
            <ul>
            {visiblePRs.map((pr, index) => (
              <motion.li
                key={pr.url}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.025, 0.2), ease: [0.16, 1, 0.3, 1] }}
                className="group border-b border-border transition-colors hover:bg-surface"
              >
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${pr.title} on GitHub`}
                  className={`grid gap-5 py-8 md:grid-cols-[10rem_minmax(0,1fr)_minmax(12rem,0.45fr)_2.75rem] md:gap-8 md:px-4 ${index === 0 ? 'md:pt-10' : ''}`}
                >
                  <div className="flex flex-wrap items-center gap-3 md:block">
                    <span className={`inline-flex items-center gap-1.5 rounded-control border px-2.5 py-1 font-mono text-[0.64rem] uppercase tracking-[0.12em] ${pr.status === 'Merged' ? 'border-status-merged/30 bg-status-merged/10 text-status-merged' : pr.status === 'Open' ? 'border-status-open/30 bg-status-open/10 text-status-open' : 'border-status-closed/30 bg-status-closed/10 text-status-closed'}`}>
                      {pr.status === 'Merged' ? <CheckCircle2 className="h-3.5 w-3.5" /> : pr.status === 'Open' ? <Circle className="h-3.5 w-3.5" /> : <GitPullRequest className="h-3.5 w-3.5" />}
                      {pr.status}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-text-muted md:mt-3 md:flex">
                      <Calendar className="h-3.5 w-3.5" />
                      {pr.date}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="flex min-w-0 items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-muted">
                      <GitCommit className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{pr.repo}</span>
                    </p>
                    <h2 className="mt-3 text-xl font-medium leading-snug tracking-[-0.025em] text-text-primary transition-colors group-hover:text-accent sm:text-2xl">
                      {pr.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-text-secondary line-clamp-3 sm:text-base">{pr.description}</p>
                  </div>

                  <div className="flex flex-col gap-4 md:items-start">
                    <div className="flex gap-3 font-mono text-xs tabular-nums">
                      <span className="text-status-open">+{pr.additions.toLocaleString()}</span>
                      <span className="text-status-closed">−{pr.deletions.toLocaleString()}</span>
                    </div>
                    <p className="font-mono text-[0.62rem] uppercase leading-5 tracking-[0.12em] text-text-muted">
                      {pr.languages.join(', ')}
                    </p>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-control border border-border text-text-primary transition-[border-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-accent group-hover:text-accent">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </a>
              </motion.li>
            ))}
            </ul>
            {visiblePRs.length < filteredPRs.length && (
              <div className="flex justify-center border-b border-border py-8">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="min-h-11 rounded-control border border-border px-5 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-primary transition-colors hover:border-accent hover:text-accent"
                >
                  Show {Math.min(PAGE_SIZE, filteredPRs.length - visiblePRs.length)} more
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default PullRequests;
