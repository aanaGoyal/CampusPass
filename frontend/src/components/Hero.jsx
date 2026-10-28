import { Link } from 'react-router-dom';
import Graphic from './Graphic.jsx';
import { day, month, weekday, time, seatState } from '../lib/format.js';

// Concept: the next real event is the poster. Its date numeral is the largest type on the page.
export default function Hero({ next, count, status }) {
  return (
    <section className="paper-grain border-b border-ink">
      <div className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-20">
        <div className="rise flex flex-col justify-between">
          <h1 className="font-display text-[2.75rem] font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-[5.25rem]">
            Find out what is on before it is over.
          </h1>
          <div className="mt-8 max-w-md lg:mt-14">
            <p className="text-lg leading-relaxed">Every approved event on campus, with the date, the venue and the seats still open. Browse freely and book when you are ready.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/#events" className="btn-solid">Discover events</Link>
              <Link to="/#categories" className="btn-line">Browse categories</Link>
            </div>
            {status === 'ready' && <p className="mt-6 text-sm text-mute"><span className="font-semibold text-ink">{count}</span> upcoming {count === 1 ? 'event' : 'events'} open for booking</p>}
          </div>
        </div>

        <aside aria-label="Next event" className="rise relative border border-ink bg-paper [animation-delay:120ms]">
          {next ? (
            <Link to={`/events/${next.id}`} className="group block">
              <div className="flex items-baseline justify-between border-b border-ink px-5 py-3 text-sm font-semibold">
                <span>Next on campus</span><span className="text-mute">{next.category}</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-end gap-x-5 px-5 pt-6">
                <time dateTime={next.startsAt} className="font-display text-[8.5rem] font-semibold leading-[0.8] tracking-tighter text-cobalt tabular-nums sm:text-[11rem]">{day(next.startsAt)}</time>
                <div className="pb-1 leading-tight"><div className="font-display text-3xl sm:text-4xl">{month(next.startsAt)}</div><div className="text-sm text-mute">{weekday(next.startsAt)}, {time(next.startsAt)}</div></div>
              </div>
              <div className="px-5 pb-5 pt-6">
                <h2 className="font-display text-2xl leading-tight decoration-2 underline-offset-4 group-hover:underline sm:text-3xl">{next.title}</h2>
                <p className="mt-2 text-sm text-mute">{next.venue} &nbsp;|&nbsp; <span className="font-semibold text-ink">{seatState(next).text}</span></p>
              </div>
              <div className="h-24 border-t border-ink sm:h-28"><Graphic category={next.category} /></div>
            </Link>
          ) : (
            <div className="p-8"><div className="h-64 sm:h-80" aria-hidden="true">{status === 'loading' && <div className="skeleton h-full" />}</div>
              <p className="text-sm text-mute">{status === 'loading' ? 'Loading the next event' : 'The next event will appear here.'}</p></div>
          )}
        </aside>
      </div>
    </section>
  );
}
