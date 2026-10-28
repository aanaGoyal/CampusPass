import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, CheckCircle, Ticket, X } from 'lucide-react';
import { useEvents } from '../EventsContext.jsx';
import { useAuth } from '../AuthContext.jsx';
import Graphic from '../components/Graphic.jsx';
import { ErrorState } from '../components/States.jsx';
import { longDate, time, seatState } from '../lib/format.js';

export default function EventDetail() {
  const { id } = useParams();
  const { events, status, error, reload } = useEvents();
  const { user, isAuthenticated, bookTicket, cancelBooking, isBooked } = useAuth();
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const e = events.find((x) => x.id === id);

  if (status === 'loading') {
    return (
      <div className="wrap py-24" role="status">
        <div className="skeleton h-12 w-2/3" />
        <div className="skeleton mt-6 h-72" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="wrap py-16">
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  if (!e) {
    return (
      <div className="wrap py-24">
        <h1 className="font-display text-4xl">This event is not available</h1>
        <p className="mt-3 max-w-md text-mute">It may have finished, or it has not been approved yet.</p>
        <Link to="/#events" className="btn-solid mt-6">
          See upcoming events
        </Link>
      </div>
    );
  }

  const seat = seatState(e);
  const full = seat.kind === 'full';
  const booked = isBooked(e.id);

  function handleBooking() {
    bookTicket(e);
    setBookingSuccess(true);
  }

  function handleCancel() {
    cancelBooking(e.id);
    setBookingSuccess(false);
  }

  const Row = ({ icon: Icon, label, children }) => (
    <div className="flex gap-3 border-t border-rule py-4">
      <Icon size={18} className="mt-0.5 shrink-0 text-cobalt" aria-hidden="true" />
      <div>
        <dt className="label">{label}</dt>
        <dd className="mt-0.5 font-semibold text-ink">{children}</dd>
      </div>
    </div>
  );

  return (
    <article className="wrap pb-12 pt-8 sm:pt-12">
      <Link
        to="/#events"
        className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        All events
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <div>
          <p className="label">
            {e.category}
            {e.organiser ? ` by ${e.organiser}` : ''}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl text-ink">
            {e.title}
          </h1>

          <div className="mt-8 aspect-[5/2] overflow-hidden border border-ink">
            {e.imageUrl ? (
              <img src={e.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <Graphic category={e.category} />
            )}
          </div>

          <h2 className="mt-10 text-sm font-semibold text-mute uppercase tracking-wider">
            About this event
          </h2>
          <p className="mt-2 max-w-prose whitespace-pre-line font-display text-xl leading-relaxed sm:text-2xl sm:leading-relaxed text-ink">
            {e.description || 'The organiser has not added a description yet.'}
          </p>
        </div>

        {/* Aside: Booking Box */}
        <aside
          aria-label="Event details and booking"
          className="h-fit border border-ink bg-paper p-6 lg:sticky lg:top-24 shadow-sm"
        >
          <div className="border-b border-rule pb-3 mb-2 flex items-center justify-between">
            <span className="label uppercase tracking-widest text-cobalt font-semibold">Pass Ledger</span>
            <span className="font-mono text-[11px] text-mute">EVENT #{e.id}</span>
          </div>

          <dl>
            <Row icon={CalendarDays} label="Date">
              <time dateTime={e.startsAt}>{longDate(e.startsAt)}</time>
            </Row>
            <Row icon={Clock} label="Starts">
              {time(e.startsAt)}
            </Row>
            {e.venue && <Row icon={MapPin} label="Venue">{e.venue}</Row>}
            <Row icon={Users} label="Seats">
              <span className={full ? 'text-vermilion-ink' : ''}>{seat.text}</span>
              {e.capacity != null && <span className="font-normal text-mute"> of {e.capacity}</span>}
            </Row>
          </dl>

          <div className="border-t border-ink pt-5">
            {booked ? (
              <div className="space-y-4">
                <div className="border-l-4 border-emerald-600 bg-emerald-50/60 p-4 text-emerald-950">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600" />
                    <span className="font-semibold text-sm">Pass Confirmed</span>
                  </div>
                  <p className="mt-1 text-xs text-emerald-900">
                    Your digital student seat is reserved under <strong>{user?.name}</strong>. Present this confirmation at the door.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-line w-full !py-2.5 text-xs text-vermilion-ink border-vermilion-ink/40 hover:bg-vermilion-ink hover:text-paper"
                >
                  Cancel this seat booking
                </button>
              </div>
            ) : full ? (
              <>
                <button type="button" className="btn w-full" disabled>
                  This event is full
                </button>
                <p className="mt-3 text-sm text-mute">
                  All seats are taken. Check back in case a booking is cancelled.
                </p>
              </>
            ) : isAuthenticated ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleBooking}
                  className="btn-solid w-full flex items-center justify-center gap-2"
                >
                  <Ticket size={16} />
                  <span>Reserve your seat</span>
                </button>
                <p className="text-xs text-mute leading-relaxed">
                  Booking as <strong>{user.name}</strong> ({user.role}). One seat per pass, cancellable up to 2 hours before the start.
                </p>
              </div>
            ) : (
              <>
                <Link
                  to={`/login?next=${encodeURIComponent(`/events/${e.id}`)}`}
                  className="btn-solid w-full"
                >
                  Sign in to book a seat
                </Link>
                <p className="mt-3 text-xs text-mute leading-relaxed">
                  You need an active campus account to book.{' '}
                  <Link
                    to={`/signup?next=${encodeURIComponent(`/events/${e.id}`)}`}
                    className="font-semibold text-ink underline hover:text-cobalt"
                  >
                    Create a free account
                  </Link>
                </p>
              </>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
