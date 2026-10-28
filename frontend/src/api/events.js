import { MOCK } from '../data/mock.js';

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const usingMock = !BASE;
const PATH = import.meta.env.VITE_EVENTS_PATH || '/events';

/**
 * The only place that knows the API's response shape. If the real field names differ,
 * adjust this function. Nothing else in the UI should change.
 */
const normalise = (e) => ({
  id: String(e.id),
  title: e.title ?? e.name ?? 'Untitled event',
  description: e.description ?? '',
  category: e.category ?? 'Culture',
  venue: e.venue ?? e.location ?? '',
  startsAt: e.startsAt ?? e.date ?? e.start_time ?? e.startTime ?? null,
  capacity: e.capacity ?? null,
  seatsLeft: e.seatsLeft ?? e.availableSeats ?? e.available_seats ?? e.remainingSeats ?? null,
  organiser: (typeof e.organiser === 'object' ? e.organiser?.name : e.organiser) ?? null,
  imageUrl: e.imageUrl ?? e.image ?? null,
});

export async function listEvents(signal) {
  if (usingMock) { await new Promise((r) => setTimeout(r, 450)); return MOCK.map(normalise); }
  const res = await fetch(BASE + PATH, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`The events service answered with status ${res.status}.`);
  const body = await res.json();
  const rows = Array.isArray(body) ? body : body.events ?? body.data ?? body.results ?? [];
  return rows.map(normalise).filter((e) => e.startsAt);
}
