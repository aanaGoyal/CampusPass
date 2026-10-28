const loc = 'en-GB';
export const day = (d) => new Date(d).getDate();
export const month = (d) => new Date(d).toLocaleDateString(loc, { month: 'short' });
export const weekday = (d) => new Date(d).toLocaleDateString(loc, { weekday: 'long' });
export const time = (d) => new Date(d).toLocaleTimeString(loc, { hour: 'numeric', minute: '2-digit', hour12: true });
export const longDate = (d) => new Date(d).toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const pad = (n) => String(n).padStart(2, '0');
// Seats: null means the API did not publish availability. Never guess.
export const seatState = (e) =>
  e.seatsLeft == null ? { kind: 'unknown', text: 'Availability not published' }
  : e.seatsLeft <= 0 ? { kind: 'full', text: 'Full' }
  : { kind: 'open', text: `${e.seatsLeft} seat${e.seatsLeft === 1 ? '' : 's'} left` };
