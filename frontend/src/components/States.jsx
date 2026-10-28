import { AlertTriangle, SearchX } from 'lucide-react';

export const ListSkeleton = () => (
  <div aria-busy="true" aria-label="Loading events" role="status">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="grid grid-cols-[4.5rem_1fr] gap-5 border-t border-rule py-6 sm:grid-cols-[6rem_1fr_9rem]">
        <div className="skeleton h-16" /><div className="space-y-3"><div className="skeleton h-6 w-3/4" /><div className="skeleton h-4 w-full" /></div>
        <div className="skeleton hidden h-20 sm:block" />
      </div>
    ))}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div role="alert" className="border border-vermilion-ink p-6 sm:p-8">
    <AlertTriangle className="text-vermilion-ink" aria-hidden="true" />
    <h3 className="mt-3 font-display text-2xl">Events could not be loaded</h3>
    <p className="mt-2 max-w-prose text-mute">{message} Check your connection and try again.</p>
    <button type="button" onClick={onRetry} className="btn-solid mt-5">Try again</button>
  </div>
);

export const EmptyState = ({ hasEvents, onReset }) => (
  <div className="border-t border-rule py-16 text-center">
    <SearchX className="mx-auto text-mute" aria-hidden="true" />
    <h3 className="mt-3 font-display text-2xl">{hasEvents ? 'No events match your search' : 'No upcoming events yet'}</h3>
    <p className="mx-auto mt-2 max-w-sm text-mute">{hasEvents ? 'Try a different word, or clear the filters to see everything.' : 'Approved events will appear here as soon as they are published.'}</p>
    {hasEvents && <button type="button" onClick={onReset} className="btn-line mt-5">Clear search and filters</button>}
  </div>
);
