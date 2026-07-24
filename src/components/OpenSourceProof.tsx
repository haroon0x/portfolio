import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loadPRData, type PRData } from '../data/prData';

export default function OpenSourceProof() {
  const [data, setData] = useState<PRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    loadPRData()
      .then((prData) => {
        if (active) setData(prData);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('Error loading contribution data:', error);
        setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const scope = useMemo(() => {
    if (!data) return null;
    const repositories = new Set(data.prs.map((pr) => pr.repo));
    const organizations = new Set([...repositories].map((repo) => repo.split('/')[0]));
    return { repositories: repositories.size, organizations: organizations.size };
  }, [data]);

  return (
    <section aria-labelledby="open-source-proof-title" className="safe-x mx-auto max-w-[96rem] sm:px-8 lg:px-12">
      <div className="grid border-y border-border lg:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1.2fr)]">
        <div className="border-b border-border py-7 lg:border-b-0 lg:border-r lg:pr-10">
          <h2 id="open-source-proof-title" className="max-w-sm text-2xl font-medium tracking-[-0.035em] text-text-primary sm:text-3xl">
            Work visible in public.
          </h2>
          {error && <p role="status" className="mt-3 text-sm text-text-muted">Contribution data is temporarily unavailable.</p>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4">
          <ProofStat value={data?.total} label="Pull requests" loading={loading} />
          <ProofStat value={data?.merged} label="Merged" loading={loading} />
          <ProofStat value={scope?.repositories} label="Repositories" loading={loading} />
          <div className="flex min-h-28 flex-col justify-between border-l border-t border-border p-5 sm:border-t-0 sm:p-6">
            <ProofStatValue value={scope?.organizations} loading={loading} />
            <Link to="/pull-requests" className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-accent">
              Organizations
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofStat({ value, label, loading }: { value?: number; label: string; loading: boolean }) {
  return (
    <div className="flex min-h-28 flex-col justify-between border-l border-border p-5 first:border-l-0 sm:p-6 [&:nth-child(3)]:border-l-0 [&:nth-child(n+3)]:border-t sm:[&:nth-child(3)]:border-l sm:[&:nth-child(n+3)]:border-t-0">
      <ProofStatValue value={value} loading={loading} />
      <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-text-muted">{label}</p>
    </div>
  );
}

function ProofStatValue({ value, loading }: { value?: number; loading: boolean }) {
  return (
    <p aria-busy={loading} className="text-3xl font-medium tabular-nums tracking-[-0.04em] text-text-primary">
      {value ?? '--'}
    </p>
  );
}
