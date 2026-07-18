import { useEffect, useState } from 'react';

const VISITOR_ID_KEY = 'haroon0x-visitor-id';
const VISITOR_COUNTER_URL = import.meta.env.VITE_VISITOR_COUNTER_URL?.trim() || 'https://visits.haroon0x.dev/visit';
const visitorCountFormatter = new Intl.NumberFormat('en-US');
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getVisitorId() {
  const storedVisitorId = window.localStorage.getItem(VISITOR_ID_KEY);
  if (storedVisitorId && uuidPattern.test(storedVisitorId)) return storedVisitorId;

  const visitorId = window.crypto.randomUUID();
  window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
  return visitorId;
}

export default function VisitorCounter() {
  const [count, setCount] = useState<number>();

  useEffect(() => {
    const controller = new AbortController();

    const registerVisit = async () => {
      const response = await fetch(VISITOR_COUNTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId: getVisitorId() }),
        credentials: 'omit',
        signal: controller.signal,
      });

      if (!response.ok) return;
      const data = await response.json() as { count?: unknown };
      if (typeof data.count === 'number' && Number.isSafeInteger(data.count) && data.count >= 0) {
        setCount(data.count);
      }
    };

    registerVisit().catch(() => undefined);
    return () => controller.abort();
  }, []);

  return (
    <span
      aria-hidden={count === undefined}
      aria-live="polite"
      aria-label={count === undefined ? undefined : `Approximately ${count} unique visitors`}
      className={`inline-flex items-center gap-2 tabular-nums ${count === undefined ? 'invisible' : ''}`}
    >
      <span>Visitors</span>
      <span aria-hidden="true" className="text-border-strong">/</span>
      <span className="min-w-[3ch] text-text-secondary">
        {count === undefined ? '0' : visitorCountFormatter.format(count)}
      </span>
    </span>
  );
}
