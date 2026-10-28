import { memo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import Graphic from './Graphic.jsx';
import { day, month, weekday, time, seatState } from '../lib/format.js';

function EventRow({ event: e }) {
  const seat = seatState(e);
  return (
    <li className="border-t border-rule first:border-t-0">
      <Link to={`/events/${e.id}`} className="group grid grid-cols-[4.25rem_1fr] gap-x-5 gap-y-4 py-6 sm:grid-cols-[6.5rem_1fr_10rem] sm:gap-x-8 lg:grid-cols-[8rem_1fr_13rem]">
        <time dateTime={e.startsAt} className="block leading-none">
          <span className="block font-display text-5xl font-semibold tabular-nums sm:text-6xl lg:text-7xl">{day(e.startsAt)}</span>
          <span className="mt-2 block text-sm font-semibold text-cobalt">{month(e.startsAt)}</span>
          <span className="block text-xs text-mute">{weekday(e.startsAt).slice(0, 3)}</span>
        </time>
        <div className="min-w-0">
          <p className="label">{e.category}{e.organiser ? ` by ${e.organiser}` : ''}</p>
          <h3 className="mt-1 font-display text-2xl leading-tight decoration-cobalt decoration-2 underline-offset-4 group-hover:underline sm:text-3xl">{e.title}</h3>
          <p className="mt-2 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-mute">{e.description}</p>
          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1.5"><Clock size={14} aria-hidden="true" />{time(e.startsAt)}</span>
            {e.venue && <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" />{e.venue}</span>}
            <span className={`font-semibold ${seat.kind === 'full' ? 'text-vermilion-ink' : seat.kind === 'unknown' ? 'text-mute' : ''}`}>{seat.text}</span>
          </p>
        </div>
        <div className="col-span-2 aspect-[5/2] overflow-hidden border border-rule sm:col-span-1 sm:aspect-auto sm:h-28 lg:h-32">
          <Graphic category={e.category} />
        </div>
      </Link>
    </li>
  );
}
export default memo(EventRow);
