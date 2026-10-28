import { useDeferredValue, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useEvents } from '../EventsContext.jsx';
import { usingMock } from '../api/events.js';
import Hero from '../components/Hero.jsx';
import EventRow from '../components/EventRow.jsx';
import { EmptyState, ErrorState, ListSkeleton } from '../components/States.jsx';

const PAGE = 8; // rendered in pages so a long event list never mounts thousands of rows at once

export default function Home() {
  const { events, status, error, reload } = useEvents();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [shown, setShown] = useState(PAGE);
  const q = useDeferredValue(query.trim().toLowerCase());

  const categories = useMemo(() => {
    const m = new Map();
    events.forEach((e) => m.set(e.category, (m.get(e.category) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [events]);

  const filtered = useMemo(() => events.filter((e) =>
    (category === 'All' || e.category === category) &&
    (!q || [e.title, e.description, e.venue, e.category, e.organiser].some((f) => f && f.toLowerCase().includes(q)))
  ), [events, category, q]);

  const reset = () => { setQuery(''); setCategory('All'); setShown(PAGE); };
  const visible = filtered.slice(0, shown);

  return (
    <>
      <Hero next={events[0]} count={events.length} status={status} />

      <section id="events" aria-labelledby="guide-h" className="wrap scroll-mt-16 pt-16 sm:pt-20">
        {usingMock && <p className="mb-8 border-l-4 border-vermilion bg-paper px-4 py-3 text-sm">Sample data. Set <code>VITE_API_URL</code> to show real CampusPass events.</p>}
        <div className="grid gap-8 border-b border-ink pb-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="label">The event guide</p>
            <h2 id="guide-h" className="mt-2 font-display text-4xl font-semibold leading-none tracking-tight sm:text-6xl">Coming up</h2>
          </div>
          <div>
            <label htmlFor="search" className="label">Search by title, venue or organiser</label>
            <div className="relative mt-2">
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" aria-hidden="true" />
              <input id="search" type="search" value={query} onChange={(e) => { setQuery(e.target.value); setShown(PAGE); }}
                className="w-full border border-ink bg-paper py-3 pl-10 pr-3 text-base placeholder:text-mute" placeholder="Try “workshop” or “Main Quad”" />
            </div>
          </div>
        </div>

        <div id="categories" role="group" aria-label="Filter by category" className="scroll-mt-32 flex gap-2 overflow-x-auto border-b border-rule py-4 [scrollbar-width:thin]">
          {[['All', events.length], ...categories].map(([name, n]) => (
            <button key={name} type="button" aria-pressed={category === name} onClick={() => { setCategory(name); setShown(PAGE); }}
              className={`shrink-0 border px-3.5 py-2 text-sm font-semibold transition-colors ${category === name ? 'border-cobalt bg-cobalt text-paper' : 'border-rule bg-paper hover:border-ink'}`}>
              {name} <span className={category === name ? 'text-paper/80' : 'text-mute'}>{n}</span>
            </button>
          ))}
        </div>

        <div aria-live="polite" className="pt-2">
          {status === 'loading' && <ListSkeleton />}
          {status === 'error' && <div className="pt-8"><ErrorState message={error} onRetry={reload} /></div>}
          {status === 'ready' && (filtered.length === 0
            ? <EmptyState hasEvents={events.length > 0} onReset={reset} />
            : <>
                <p className="sr-only">{filtered.length} events shown</p>
                <ul>{visible.map((e) => <EventRow key={e.id} event={e} />)}</ul>
                {shown < filtered.length && (
                  <div className="border-t border-ink pt-6 text-center">
                    <button type="button" className="btn-line" onClick={() => setShown((n) => n + PAGE)}>Show more events ({filtered.length - shown} remaining)</button>
                  </div>
                )}
              </>)}
        </div>
      </section>

      <section id="how" aria-labelledby="how-h" className="wrap scroll-mt-16 pt-24">
        <h2 id="how-h" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Booking a seat takes three steps</h2>
        <ol className="mt-8 grid border-t border-ink sm:grid-cols-3">
          {[['Browse', 'Look through upcoming events without an account.'],
            ['Sign in', 'Create a student account when you find something you want to attend.'],
            ['Book', 'Take one seat per event. You can cancel until two hours before it starts.']].map(([t, d], i) => (
            <li key={t} className="border-b border-rule py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0">
              <span className="font-display text-5xl italic text-cobalt">{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{t}</h3>
              <p className="mt-1 max-w-xs text-mute">{d}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
