import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { ArrowDownUp, ArrowUpRight, ChevronDown, Filter, Search } from 'lucide-react';
import { loadPRData, type PRData, type PullRequest } from '../data/prData';

type SortBy = 'depth' | 'date' | 'repo';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'merged' | 'open';

const EASE = [0.16, 1, 0.3, 1] as const;

interface OrganizationSummary {
  name: string;
  pullRequests: number;
  repositories: number;
  merged: number;
  open: number;
  closed: number;
}

interface RepositorySummary {
  name: string;
  pullRequests: number;
  merged: number;
  open: number;
  closed: number;
  latestActivity: number;
  languages: string[];
}

interface RepositoryGroup extends RepositorySummary {
  prs: PullRequest[];
}

const cleanDescription = (description: string) => description
  .replace(/#{1,6}\s*/g, '')
  .replace(/[*_`]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const PullRequests = ({ initialData }: { initialData?: PRData }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<PRData | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('depth');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const organizationParam = searchParams.get('org');
  const repositoryParam = searchParams.get('repo');

  useEffect(() => {
    if (initialData) return;

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
  }, [initialData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable;

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if (event.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const monthlyActivity = useMemo(() => {
    const now = new Date();
    const currentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const counts = new Map<string, number>();

    data?.prs.forEach((pr) => {
      const date = new Date(pr.date);
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - (11 - index), 1));
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      return {
        key,
        date,
        count: counts.get(key) ?? 0,
        isCurrent: index === 11,
      };
    });
  }, [data]);

  const peakMonth = monthlyActivity.reduce((peak, month) => month.count > peak.count ? month : peak, monthlyActivity[0]);
  const peakMonthLabel = peakMonth.date.toLocaleDateString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const peakCount = Math.max(...monthlyActivity.map((month) => month.count), 1);

  const organizations = useMemo<OrganizationSummary[]>(() => {
    if (!data) return [];
    const summaries = new Map<string, OrganizationSummary & { repositoryNames: Set<string> }>();

    data.prs.forEach((pr) => {
      const [owner, repository] = pr.repo.split('/');
      const key = owner.toLocaleLowerCase();
      const existing = summaries.get(key) ?? {
        name: owner,
        pullRequests: 0,
        repositories: 0,
        merged: 0,
        open: 0,
        closed: 0,
        repositoryNames: new Set<string>(),
      };

      existing.pullRequests += 1;
      existing.merged += pr.status === 'Merged' ? 1 : 0;
      existing.open += pr.status === 'Open' ? 1 : 0;
      existing.closed += pr.status === 'Closed' ? 1 : 0;
      existing.repositoryNames.add(repository);
      existing.repositories = existing.repositoryNames.size;
      summaries.set(key, existing);
    });

    return Array.from(summaries.values())
      .map((summary) => ({
        name: summary.name,
        pullRequests: summary.pullRequests,
        repositories: summary.repositories,
        merged: summary.merged,
        open: summary.open,
        closed: summary.closed,
      }))
      .sort((a, b) => b.pullRequests - a.pullRequests || a.name.localeCompare(b.name));
  }, [data]);

  const activeOrganization = organizations.find(
    (organization) => organization.name.toLocaleLowerCase() === organizationParam?.toLocaleLowerCase(),
  ) ?? null;

  const organizationPRs = useMemo(() => {
    if (!data) return [];
    return activeOrganization
      ? data.prs.filter((pr) => pr.repo.split('/')[0].toLocaleLowerCase() === activeOrganization.name.toLocaleLowerCase())
      : data.prs;
  }, [activeOrganization, data]);

  const repositories = useMemo<RepositorySummary[]>(() => {
    const summaries = new Map<string, RepositorySummary>();

    organizationPRs.forEach((pr) => {
      const existing = summaries.get(pr.repo) ?? {
        name: pr.repo,
        pullRequests: 0,
        merged: 0,
        open: 0,
        closed: 0,
        latestActivity: 0,
        languages: [],
      };
      existing.pullRequests += 1;
      existing.merged += pr.status === 'Merged' ? 1 : 0;
      existing.open += pr.status === 'Open' ? 1 : 0;
      existing.closed += pr.status === 'Closed' ? 1 : 0;
      existing.latestActivity = Math.max(existing.latestActivity, Date.parse(pr.date));
      existing.languages = Array.from(new Set([...existing.languages, ...pr.languages])).slice(0, 3);
      summaries.set(pr.repo, existing);
    });

    return Array.from(summaries.values())
      .sort((a, b) => b.pullRequests - a.pullRequests || a.name.localeCompare(b.name));
  }, [organizationPRs]);

  const activeRepository = repositories.find(
    (repository) => repository.name.toLocaleLowerCase() === repositoryParam?.toLocaleLowerCase(),
  ) ?? null;

  const filteredPRs = useMemo(() => {
    const repositoryFiltered = activeRepository
      ? organizationPRs.filter((pr) => pr.repo.toLocaleLowerCase() === activeRepository.name.toLocaleLowerCase())
      : organizationPRs;
    const statusFiltered = filterStatus === 'all'
      ? [...repositoryFiltered]
      : repositoryFiltered.filter((pr) => pr.status.toLowerCase() === filterStatus);
    const query = searchQuery.trim().toLocaleLowerCase();
    return query
      ? statusFiltered.filter((pr) => (
          pr.title.toLocaleLowerCase().includes(query) ||
          pr.repo.toLocaleLowerCase().includes(query) ||
          pr.description.toLocaleLowerCase().includes(query) ||
          pr.languages.some((language) => language.toLocaleLowerCase().includes(query))
        ))
      : statusFiltered;
  }, [activeRepository, filterStatus, organizationPRs, searchQuery]);

  const repositoryGroups = useMemo<RepositoryGroup[]>(() => {
    const groups = new Map<string, RepositoryGroup>();

    filteredPRs.forEach((pr) => {
      const existing = groups.get(pr.repo) ?? {
        name: pr.repo,
        pullRequests: 0,
        merged: 0,
        open: 0,
        closed: 0,
        latestActivity: 0,
        languages: [],
        prs: [],
      };
      existing.prs.push(pr);
      existing.pullRequests += 1;
      existing.merged += pr.status === 'Merged' ? 1 : 0;
      existing.open += pr.status === 'Open' ? 1 : 0;
      existing.closed += pr.status === 'Closed' ? 1 : 0;
      existing.latestActivity = Math.max(existing.latestActivity, Date.parse(pr.date));
      existing.languages = Array.from(new Set([...existing.languages, ...pr.languages])).slice(0, 3);
      groups.set(pr.repo, existing);
    });

    const direction = sortOrder === 'asc' ? 1 : -1;
    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        prs: group.prs.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
      }))
      .sort((a, b) => {
        if (sortBy === 'depth') return (a.pullRequests - b.pullRequests) * direction || a.name.localeCompare(b.name);
        if (sortBy === 'date') return (a.latestActivity - b.latestActivity) * direction || a.name.localeCompare(b.name);
        return a.name.localeCompare(b.name) * direction;
      });
  }, [filteredPRs, sortBy, sortOrder]);

  const toggleSort = (nextSortBy: SortBy) => {
    if (sortBy === nextSortBy) {
      setSortOrder((currentOrder) => currentOrder === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortBy(nextSortBy);
    setSortOrder(nextSortBy === 'repo' ? 'asc' : 'desc');
  };

  const sortLabel = (label: string, value: SortBy) => (
    sortBy === value ? `Sort by ${label}, currently ${sortOrder === 'asc' ? 'ascending' : 'descending'}` : `Sort by ${label}`
  );

  const selectFilter = (status: FilterStatus) => {
    setFilterStatus(status);
  };

  const selectOrganization = (organization: string | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (organization) {
      nextParams.set('org', organization);
    } else {
      nextParams.delete('org');
    }
    nextParams.delete('repo');
    setSearchParams(nextParams, { replace: true });
  };

  const selectRepository = (repository: string | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (repository) {
      nextParams.set('repo', repository);
    } else {
      nextParams.delete('repo');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const resetControls = () => {
    setFilterStatus('all');
    setSearchQuery('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('org');
    nextParams.delete('repo');
    setSearchParams(nextParams, { replace: true });
  };

  const renderRepositoryIndex = () => (
    <nav aria-label="Repository index">
      <button
        type="button"
        onClick={() => selectRepository(null)}
        aria-pressed={!activeRepository}
        className={`flex min-h-11 w-full items-center justify-between border-b border-border px-4 text-left font-mono text-[0.7rem] uppercase tracking-[0.13em] transition-colors ${!activeRepository ? 'bg-accent-muted text-accent' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}
      >
        <span>All repositories</span>
        <span className="tabular-nums">{organizationPRs.length.toString().padStart(2, '0')}</span>
      </button>
      <ol>
        {repositories.map((repository, index) => {
          const isActive = activeRepository?.name === repository.name;
          const label = activeOrganization ? repository.name.split('/')[1] : repository.name;

          return (
            <li key={repository.name}>
              <button
                type="button"
                onClick={() => selectRepository(isActive ? null : repository.name)}
                aria-pressed={isActive}
                aria-label={`${isActive ? 'Clear' : 'Show'} ${repository.name}: ${repository.pullRequests} pull requests`}
                className={`group flex min-h-12 w-full items-center gap-3 border-b border-border px-4 text-left transition-colors ${isActive ? 'bg-accent-muted' : 'hover:bg-surface'}`}
              >
                <span className={`font-mono text-[0.7rem] tabular-nums tracking-[0.12em] ${isActive ? 'text-accent' : 'text-text-muted'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`min-w-0 flex-1 truncate text-sm tracking-[-0.015em] ${isActive ? 'text-accent' : 'text-text-primary'}`}>
                  {label}
                </span>
                <span className="font-mono text-[0.7rem] tabular-nums tracking-[0.1em] text-text-muted">
                  {repository.pullRequests.toString().padStart(2, '0')}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return (
    <main id="main-content" className="safe-x mx-auto min-h-[100svh] max-w-[96rem] bg-background pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40 lg:px-12 lg:pb-40">
      <header className="max-w-5xl">
        <h1 className="text-[clamp(2.6rem,6vw,7rem)] font-medium leading-[0.96] tracking-[-0.055em] text-text-primary">
          Open source contributions
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-text-secondary sm:text-xl sm:leading-9">
          Pull requests across infrastructure, developer tooling, machine learning, and the open-source systems behind them.
        </p>
      </header>

      {data && !loading && (
        <dl className="mt-14 grid grid-cols-2 border-y border-border sm:mt-20 md:grid-cols-5">
          <div className="flex flex-col border-b border-r border-border py-6 pr-5 md:border-b-0 md:px-6 md:first:pl-0">
            <dt className="order-2 mt-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-muted">Total</dt>
            <dd className="order-1 text-3xl font-medium tabular-nums tracking-[-0.04em] text-text-primary sm:text-4xl">{data.total}</dd>
          </div>
          <div className="flex flex-col border-b border-border py-6 pl-5 md:border-b-0 md:border-r md:px-6">
            <dt className="order-2 mt-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-muted">Merged</dt>
            <dd className="order-1 text-3xl font-medium tabular-nums tracking-[-0.04em] text-status-merged sm:text-4xl">{data.merged}</dd>
          </div>
          <div className="flex flex-col border-b border-r border-border py-6 pr-5 md:border-b-0 md:px-6">
            <dt className="order-2 mt-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-muted">Open</dt>
            <dd className="order-1 text-3xl font-medium tabular-nums tracking-[-0.04em] text-status-open sm:text-4xl">{data.open}</dd>
          </div>
          <div className="flex flex-col border-b border-border py-6 pl-5 md:border-b-0 md:border-r md:px-6">
            <dt className="order-2 mt-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-muted">Organizations</dt>
            <dd className="order-1 text-3xl font-medium tabular-nums tracking-[-0.04em] text-accent sm:text-4xl">{organizations.length}</dd>
          </div>
          <div className="col-span-2 flex flex-col py-6 md:col-span-1 md:px-6 md:last:pr-0">
            <dt className="order-2 mt-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-muted">Merge rate</dt>
            <dd className="order-1 text-3xl font-medium tabular-nums tracking-[-0.04em] text-accent sm:text-4xl">{data.total ? Math.round((data.merged / data.total) * 100) : 0}%</dd>
          </div>
        </dl>
      )}

      {data && !loading && (
        <section aria-labelledby="activity-timeline-title" className="mt-10 border-b border-border pb-8 sm:mt-12">
          <div className="flex items-center justify-between gap-6">
            <h2 id="activity-timeline-title" className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-muted">Activity / last 12 months</h2>
            <span className="font-mono text-[0.7rem] tabular-nums uppercase tracking-[0.14em] text-text-muted">{monthlyActivity.reduce((total, month) => total + month.count, 0)} PRs</span>
          </div>
          <p className="sr-only">12-month activity: peak {peakMonth.count} pull requests in {peakMonthLabel}.</p>
          <div aria-hidden="true" className="mt-5 grid h-[4.25rem] grid-cols-12 gap-1.5 sm:gap-3">
            {monthlyActivity.map((month, index) => {
              const monthLabel = month.date.toLocaleDateString('en', { month: 'short', timeZone: 'UTC' });
              const showLabel = month.isCurrent || month.date.getUTCMonth() === 0;
              const height = `${Math.max(month.count ? 4 : 1, (month.count / peakCount) * 48)}px`;

              return (
                <div key={month.key} className="relative flex h-12 items-end">
                  <motion.span
                    initial={shouldReduceMotion ? false : { height: 0 }}
                    animate={{ height }}
                    transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : index * 0.025, ease: EASE }}
                    className={`block w-full ${month.isCurrent ? 'bg-accent' : 'bg-border-strong'}`}
                  />
                  {showLabel && (
                    <span className={`absolute top-14 font-mono text-[0.7rem] uppercase tracking-[0.1em] ${month.isCurrent ? 'right-0 text-accent' : 'left-0 text-text-muted'}`}>
                      {monthLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {data && !loading && (
        <section aria-labelledby="organization-index-title" className="mt-16 scroll-mt-28 sm:mt-24">
          <div className="grid gap-8 border-b border-border pb-9 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.55fr)] lg:items-end lg:gap-16">
            <div>
              <h2 id="organization-index-title" className="max-w-3xl text-[clamp(2.4rem,5vw,5.6rem)] font-medium leading-[0.92] tracking-[-0.055em] text-text-primary">
                Where the work landed.
              </h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
                An organization-level view of contribution depth, repository reach, and current outcomes. Select one to inspect its complete record.
              </p>
              <button
                type="button"
                onClick={() => selectOrganization(null)}
                aria-pressed={!activeOrganization}
                className={`mt-6 inline-flex min-h-11 items-center gap-3 rounded-control border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-[border-color,background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${!activeOrganization ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-accent hover:text-accent'}`}
              >
                All organizations
                <span className="tabular-nums">{data.total.toString().padStart(2, '0')} PRs</span>
              </button>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-text-muted">
                <span className="text-status-merged">M / merged</span>
                <span className="text-status-open">O / open</span>
                <span className="text-status-closed">C / closed</span>
              </p>
            </div>
          </div>

          <ol className="grid border-l border-t border-border sm:grid-cols-2 xl:grid-cols-4">
            {organizations.map((organization, index) => {
              const isActive = activeOrganization?.name === organization.name;
              const contributionWidth = Math.max(8, (organization.pullRequests / organizations[0].pullRequests) * 100);
              const mark = organization.name.replace(/[^a-z0-9]/gi, '').slice(0, 3).toLocaleUpperCase();

              return (
                <li key={organization.name} className={`border-b border-r border-border ${index === 0 ? 'xl:col-span-2' : ''}`}>
                  <button
                    type="button"
                    onClick={() => selectOrganization(isActive ? null : organization.name)}
                    aria-pressed={isActive}
                    aria-label={`${isActive ? 'Clear' : 'Show'} ${organization.name} contributions: ${organization.pullRequests} pull requests across ${organization.repositories} repositories`}
                    className={`group relative flex min-h-40 w-full flex-col overflow-hidden p-5 text-left transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.985] sm:p-6 ${isActive ? 'bg-accent-muted' : 'hover:bg-surface'}`}
                  >
                    <span className={`absolute inset-y-0 left-0 w-0.5 transition-colors duration-150 ${isActive ? 'bg-accent' : 'bg-transparent group-hover:bg-border-strong'}`} />
                    <span className="flex w-full items-start justify-between gap-5">
                      <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-muted">
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <span aria-hidden="true" className={`flex h-8 min-w-10 items-center justify-center border px-2 tracking-[0.1em] transition-colors duration-150 ${isActive ? 'border-accent text-accent' : 'border-border text-text-secondary group-hover:border-border-strong group-hover:text-text-primary'}`}>
                          {mark}
                        </span>
                      </span>
                      <span className={`font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors duration-150 ${isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-primary'}`}>
                        {organization.pullRequests.toString().padStart(2, '0')} PRs
                      </span>
                    </span>

                    <span className={`mt-5 block font-medium tracking-[-0.035em] text-text-primary ${index === 0 ? 'text-[clamp(1.4rem,2.4vw,2.15rem)]' : 'text-[clamp(1.25rem,2vw,1.65rem)]'}`}>
                      {organization.name}
                    </span>

                    <span className="mt-auto block w-full pt-5">
                      <span className="block h-px w-full bg-border">
                        <span className={`block h-px ${isActive ? 'bg-accent' : 'bg-border-strong'}`} style={{ width: `${contributionWidth}%` }} />
                      </span>
                      <span className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-text-muted">
                        <span>{organization.repositories} {organization.repositories === 1 ? 'repository' : 'repositories'}</span>
                        <span className="flex items-center gap-3 tabular-nums">
                          <span className="text-status-merged">M {organization.merged}</span>
                          <span className="text-status-open">O {organization.open}</span>
                          <span className="text-status-closed">C {organization.closed}</span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section aria-label="Pull request controls" className="mt-12 border-y border-border py-5 sm:mt-16">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p aria-live="polite" className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-primary">
            {activeOrganization ? `${activeOrganization.name} / ` : ''}{activeRepository ? `${activeRepository.name.split('/')[1]} / ` : ''}{filteredPRs.length} matches
          </p>
          {data?.lastUpdated && (
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-muted">
              Updated {new Date(data.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>

        <label className="relative mt-5 block max-w-2xl">
          <span className="sr-only">Search pull requests</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            ref={searchInputRef}
            type="search"
            aria-keyshortcuts="/ Escape"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search title, repository, or technology"
            className="min-h-12 w-full rounded-control border border-border bg-surface py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted hover:border-border-strong focus:border-accent"
          />
        </label>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-muted">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </span>
            <button
              type="button"
              onClick={() => selectFilter('all')}
              aria-label="Show all pull requests"
              aria-pressed={filterStatus === 'all'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${filterStatus === 'all' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => selectFilter('merged')}
              aria-label="Show merged pull requests"
              aria-pressed={filterStatus === 'merged'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${filterStatus === 'merged' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              Merged
            </button>
            <button
              type="button"
              onClick={() => selectFilter('open')}
              aria-label="Show open pull requests"
              aria-pressed={filterStatus === 'open'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${filterStatus === 'open' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              Open
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-muted">
              <ArrowDownUp className="h-3.5 w-3.5" />
              Sort
            </span>
            <button
              type="button"
              onClick={() => toggleSort('depth')}
              aria-label={sortLabel('pull request volume', 'depth')}
              aria-pressed={sortBy === 'depth'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${sortBy === 'depth' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              Volume {sortBy === 'depth' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('date')}
              aria-label={sortLabel('recent activity', 'date')}
              aria-pressed={sortBy === 'date'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${sortBy === 'date' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              Recent {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('repo')}
              aria-label={sortLabel('repository', 'repo')}
              aria-pressed={sortBy === 'repo'}
              className={`min-h-11 rounded-control border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${sortBy === 'repo' ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'}`}
            >
              Repository {sortBy === 'repo' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </section>

      <section aria-label="Pull requests" className="mt-10 border-t border-border sm:mt-12">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-border py-7 sm:py-9">
          <div>
            <h2 className="text-2xl font-medium tracking-[-0.035em] text-text-primary sm:text-3xl">
              {activeRepository?.name ?? (activeOrganization ? `${activeOrganization.name} repositories` : 'Every repository')}
            </h2>
            <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.13em] text-text-muted">
              {filteredPRs.length} pull requests / {repositoryGroups.length} {repositoryGroups.length === 1 ? 'repository' : 'repositories'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeRepository && (
              <button
                type="button"
                onClick={() => selectRepository(null)}
                className="min-h-11 rounded-control border border-accent bg-accent-muted px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
              >
                Clear {activeRepository.name.split('/')[1]} ×
              </button>
            )}
            {activeOrganization && (
              <button
                type="button"
                onClick={() => selectOrganization(null)}
                className="min-h-11 rounded-control border border-border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-secondary transition-[border-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-accent hover:text-accent active:scale-[0.97]"
              >
                Clear {activeOrganization.name} ×
              </button>
            )}
          </div>
        </header>
        {loading ? (
          <div role="status" aria-label="Loading pull requests">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="grid animate-pulse gap-4 border-b border-border py-6 md:grid-cols-[5rem_7rem_minmax(0,1fr)_10rem_2.75rem] md:px-6">
                <div className="h-4 bg-surface-strong" />
                <div className="h-8 bg-surface" />
                <div className="space-y-2">
                  <div className="h-5 w-4/5 bg-surface-strong" />
                  <div className="h-4 w-full bg-surface" />
                </div>
                <div className="h-8 bg-surface" />
                <div className="h-9 w-9 border border-border bg-surface" />
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
              className="min-h-11 rounded-control border border-border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-primary transition-colors hover:border-accent hover:text-accent"
            >
              Reset to all
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
            <details className="group border-b border-border lg:hidden [&>summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-primary">
                <span className="min-w-0 truncate">{activeRepository ? activeRepository.name : `Repository index / ${repositories.length}`}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform duration-150 group-open:rotate-180" />
              </summary>
              <div className="max-h-[24rem] overflow-y-auto border-t border-border">
                {renderRepositoryIndex()}
              </div>
            </details>

            <aside className="hidden border-r border-border lg:block">
              <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto overscroll-contain">
                <div className="border-b border-border px-4 py-4">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-text-muted">Repository index / {repositories.length.toString().padStart(2, '0')}</p>
                </div>
                {renderRepositoryIndex()}
              </div>
            </aside>

            <div className="min-w-0">
              {repositoryGroups.map((repository) => {
                const repositoryId = `repository-${repository.name.replace(/[^a-z0-9]+/gi, '-').toLocaleLowerCase()}`;

                return (
                  <section key={repository.name} aria-labelledby={repositoryId} className="scroll-mt-24">
                    <header className="sticky top-20 z-20 flex flex-wrap items-end justify-between gap-4 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:top-24">
                      <div>
                        <h3 id={repositoryId} className="text-lg font-medium tracking-[-0.025em] text-text-primary sm:text-xl">{repository.name}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.11em] text-text-muted">
                        <span>{repository.pullRequests} PRs</span>
                        <span className="flex items-center gap-3 tabular-nums">
                          <span className="text-status-merged">M {repository.merged}</span>
                          <span className="text-status-open">O {repository.open}</span>
                          <span className="text-status-closed">C {repository.closed}</span>
                        </span>
                        <span className="hidden max-w-56 truncate xl:inline">{repository.languages.join(' / ')}</span>
                      </div>
                    </header>

                    <ul>
                      {repository.prs.map((pr, index) => {
                        const number = pr.url.split('/').filter(Boolean).at(-1);
                        const branch = index === repository.prs.length - 1 ? '└─' : '├─';
                        const statusClass = pr.status === 'Merged'
                          ? 'text-status-merged'
                          : pr.status === 'Open'
                            ? 'text-status-open'
                            : 'text-status-closed';
                        const totalChanges = pr.additions + pr.deletions;
                        const additionsWidth = totalChanges ? (pr.additions / totalChanges) * 100 : 0;
                        const deletionsWidth = totalChanges ? (pr.deletions / totalChanges) * 100 : 0;

                        return (
                          <li key={pr.url} className="group border-b border-border transition-colors hover:bg-surface">
                            <a
                              href={pr.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${pr.title} on GitHub`}
                              className="grid grid-cols-[auto_minmax(0,1fr)_2.5rem] gap-x-3 gap-y-3 px-4 py-5 sm:px-6 md:grid-cols-[5rem_7rem_minmax(0,1fr)_minmax(9rem,0.35fr)_2.5rem] md:items-center md:gap-5"
                            >
                              <span className="flex items-center gap-2 font-mono text-[0.7rem] tabular-nums tracking-[0.08em] text-text-muted">
                                <span aria-hidden="true">{branch}</span>
                                <span className="text-text-secondary">#{number}</span>
                              </span>

                              <span className="flex items-center gap-3 md:block">
                                <span className={`block font-mono text-[0.7rem] uppercase tracking-[0.13em] ${statusClass}`}>{pr.status}</span>
                                <span className="block font-mono text-[0.7rem] uppercase tracking-[0.09em] text-text-muted md:mt-1.5">{pr.date}</span>
                              </span>

                              <span className="col-span-3 min-w-0 md:col-span-1">
                                <span className="block text-base font-medium leading-6 tracking-[-0.018em] text-text-primary transition-colors group-hover:text-accent sm:text-lg">{pr.title}</span>
                                <span className="mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-6 text-text-secondary">{cleanDescription(pr.description)}</span>
                              </span>

                              <span className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1 md:col-span-1 md:block">
                                <span className="flex gap-2 font-mono text-[0.7rem] tabular-nums">
                                  <span className="text-status-open">+{pr.additions.toLocaleString()}</span>
                                  <span className="text-status-closed">−{pr.deletions.toLocaleString()}</span>
                                </span>
                                <span aria-hidden="true" className="mt-1.5 flex h-0.5 w-16 overflow-hidden bg-border">
                                  <span className="h-full bg-status-open" style={{ width: `${additionsWidth}%` }} />
                                  <span className="h-full bg-status-closed" style={{ width: `${deletionsWidth}%` }} />
                                </span>
                                <span className="font-mono text-[0.7rem] uppercase tracking-[0.09em] text-text-muted md:mt-2 md:block md:truncate">{pr.languages.slice(0, 2).join(' / ')}</span>
                              </span>

                              <span className="col-start-3 row-start-1 flex h-10 w-10 items-center justify-center justify-self-end rounded-control border border-border text-text-primary transition-[border-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-accent group-hover:text-accent md:col-start-auto md:row-start-auto">
                                <ArrowUpRight className="h-4.5 w-4.5" />
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default PullRequests;
