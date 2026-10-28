import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { listEvents } from './api/events.js';

const Ctx = createContext(null);
export const useEvents = () => useContext(Ctx);

export function EventsProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', events: [], error: null });
  const load = useCallback(() => {
    const ac = new AbortController();
    setState((s) => ({ ...s, status: 'loading', error: null }));
    listEvents(ac.signal)
      .then((rows) => {
        const now = Date.now();
        const upcoming = rows.filter((e) => new Date(e.startsAt).getTime() >= now)
          .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
        setState({ status: 'ready', events: upcoming, error: null });
      })
      .catch((err) => { if (err.name !== 'AbortError') setState({ status: 'error', events: [], error: err.message }); });
    return () => ac.abort();
  }, []);
  useEffect(() => load(), [load]);
  const value = useMemo(() => ({ ...state, reload: load }), [state, load]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
