import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ArrowUpRight, X, Shield, FileText, Calendar } from 'lucide-react';
import Logo, { Mark } from './Logo.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user, isAuthenticated, bookings, cancelBooking } = useAuth();
  const [activeModal, setActiveModal] = useState(null); // 'guidelines' | 'cancellation' | 'bookings' | null

  return (
    <>
      <footer className="mt-28 border-t border-ink bg-ivory text-ink">
        {/* Subtle decorative perforation strip */}
        <div className="flex h-3 items-center justify-between border-b border-rule px-4 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 48 }).map((_, i) => (
            <span key={i} className="inline-block h-1.5 w-1.5 rounded-full bg-rule/70" />
          ))}
        </div>

        {/* Main Footer Container */}
        <div className="wrap py-14 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Column 1: Brand & Identity (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <Logo />
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute">
                  CampusPass is the central cultural ledger for campus events, societies, lectures, and festivals.
                  Find upcoming assemblies, reserve seats, and discover what’s happening in real time.
                </p>

                {/* Editorial Ledger Badge */}
                <div className="mt-6 inline-flex items-center gap-3 border border-rule bg-paper px-3.5 py-2 text-xs">
                  <span className="flex h-2 w-2 rounded-full bg-vermilion" aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-mute">
                    Ledger Issue 2026 · Verified Pass System
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-8 border-t border-rule pt-4 text-xs text-mute font-mono">
                <span>SYSTEM STATUS: </span>
                <span className="text-emerald-700 font-semibold">ALL HALLS OPERATIONAL</span>
              </div>
            </div>

            {/* Column 2: Discover (2 cols) */}
            <div className="lg:col-span-2">
              <h3 className="label uppercase tracking-widest text-ink font-semibold">
                Discover
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link to="/#events" className="hover:text-cobalt hover:underline underline-offset-4 transition-colors">
                    All upcoming events
                  </Link>
                </li>
                <li>
                  <Link to="/#categories" className="hover:text-cobalt hover:underline underline-offset-4 transition-colors">
                    Browse categories
                  </Link>
                </li>
                <li>
                  <Link to="/#how" className="hover:text-cobalt hover:underline underline-offset-4 transition-colors">
                    How booking works
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Your Account & Tickets (3 cols) */}
            <div className="lg:col-span-3">
              <h3 className="label uppercase tracking-widest text-ink font-semibold">
                Your Account
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {isAuthenticated ? (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden="true" />
                      <span className="font-semibold text-ink">{user.name}</span>
                      <span className="border border-rule bg-paper px-1.5 py-0.5 text-[10px] font-mono uppercase text-mute">
                        {user.role}
                      </span>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setActiveModal('bookings')}
                        className="inline-flex items-center gap-1.5 font-semibold text-cobalt hover:underline underline-offset-4"
                      >
                        <Ticket size={15} aria-hidden="true" />
                        My active bookings ({bookings.length})
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="hover:text-cobalt hover:underline underline-offset-4 transition-colors">
                        Sign in to account
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup" className="hover:text-cobalt hover:underline underline-offset-4 transition-colors font-medium">
                        Create student pass
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('cancellation')}
                    className="text-left text-mute hover:text-ink hover:underline underline-offset-4 transition-colors"
                  >
                    Ticket cancellation policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Information & Rules (2 cols) */}
            <div className="lg:col-span-2">
              <h3 className="label uppercase tracking-widest text-ink font-semibold">
                Information
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('guidelines')}
                    className="text-left hover:text-cobalt hover:underline underline-offset-4 transition-colors"
                  >
                    Event attendance rules
                  </button>
                </li>
                <li>
                  <Link
                    to="/#how"
                    className="inline-flex items-center gap-1 hover:text-cobalt hover:underline underline-offset-4 transition-colors"
                  >
                    <span>Booking guide</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="hover:text-cobalt hover:underline underline-offset-4 transition-colors"
                  >
                    Organiser onboarding
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Large Typographic Brand Signature */}
          <div className="mt-16 border-t border-rule pt-8 overflow-hidden select-none" aria-hidden="true">
            <p className="font-display text-5xl font-bold tracking-tight text-ink/[0.07] sm:text-7xl md:text-8xl lg:text-9xl text-center uppercase">
              CampusPass
            </p>
          </div>

          {/* Bottom Legal & Copyright Strip */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-ink pt-6 text-xs text-mute">
            <p>© {currentYear} CampusPass. The open ledger for campus events.</p>
            <div className="flex flex-wrap items-center gap-6">
              <span>Verified Role-Based Access</span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span>Autonomous Registration</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Accessible In-Place Information Modals */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg border border-ink bg-paper p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              aria-label="Close dialogue"
              className="absolute right-4 top-4 p-2 text-mute hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
            >
              <X size={20} />
            </button>

            {/* Modal Content: Event Guidelines */}
            {activeModal === 'guidelines' && (
              <div>
                <div className="flex items-center gap-2 text-cobalt mb-2">
                  <FileText size={20} aria-hidden="true" />
                  <span className="label uppercase tracking-widest text-cobalt">Campus Protocol</span>
                </div>
                <h3 id="modal-title" className="font-display text-2xl font-semibold text-ink">
                  Event Attendance & Hall Guidelines
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-mute">
                  <p>
                    <strong className="text-ink font-semibold">1. Valid Student Pass:</strong> All attendees must present their digital CampusPass at the entrance desk before admittance.
                  </p>
                  <p>
                    <strong className="text-ink font-semibold">2. Punctuality:</strong> Doors close 10 minutes following scheduled start times to prevent disruption to speakers and performers.
                  </p>
                  <p>
                    <strong className="text-ink font-semibold">3. Seat Release:</strong> If a ticket holder has not checked in 5 minutes prior to the start, their seat may be released to standby guests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn-solid mt-6 w-full !py-2.5 text-sm"
                >
                  Understood
                </button>
              </div>
            )}

            {/* Modal Content: Cancellation Policy */}
            {activeModal === 'cancellation' && (
              <div>
                <div className="flex items-center gap-2 text-cobalt mb-2">
                  <Shield size={20} aria-hidden="true" />
                  <span className="label uppercase tracking-widest text-cobalt">Fair Access Policy</span>
                </div>
                <h3 id="modal-title" className="font-display text-2xl font-semibold text-ink">
                  Ticket Cancellation & Standby Policy
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-mute">
                  <p>
                    CampusPass operates on a shared-capacity principle. Every seat booked is a seat held for you:
                  </p>
                  <p>
                    • <strong className="text-ink font-semibold">Advance Notice:</strong> You may cancel any reservation up to <span className="text-ink font-semibold">2 hours before</span> the event start without penalty.
                  </p>
                  <p>
                    • <strong className="text-ink font-semibold">Automatic Seat Recirculation:</strong> Cancelled tickets immediately become visible in the live guide for fellow students.
                  </p>
                  <p>
                    • <strong className="text-ink font-semibold">Fair Attendance:</strong> Multiple uncancelled absences may temporarily freeze priority booking privileges.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn-solid mt-6 w-full !py-2.5 text-sm"
                >
                  Close Policy
                </button>
              </div>
            )}

            {/* Modal Content: User Bookings */}
            {activeModal === 'bookings' && (
              <div>
                <div className="flex items-center gap-2 text-cobalt mb-2">
                  <Ticket size={20} aria-hidden="true" />
                  <span className="label uppercase tracking-widest text-cobalt">Passholder Ledger</span>
                </div>
                <h3 id="modal-title" className="font-display text-2xl font-semibold text-ink">
                  My Active Bookings
                </h3>
                <div className="mt-4 max-h-72 overflow-y-auto divide-y divide-rule">
                  {bookings.length === 0 ? (
                    <div className="py-8 text-center text-sm text-mute">
                      <p>You have no active event bookings at this moment.</p>
                      <Link
                        to="/#events"
                        onClick={() => setActiveModal(null)}
                        className="btn-solid mt-4 !py-2 text-xs"
                      >
                        Explore Events
                      </Link>
                    </div>
                  ) : (
                    bookings.map((b) => (
                      <div key={b.id} className="py-3 flex items-start justify-between gap-3 text-sm">
                        <div>
                          <p className="font-semibold text-ink">{b.eventTitle}</p>
                          <p className="text-xs text-mute mt-0.5">
                            Pass #{b.passNumber} · {b.venue || 'Campus Venue'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => cancelBooking(b.eventId)}
                          className="text-xs font-semibold text-vermilion-ink hover:underline shrink-0"
                        >
                          Cancel Pass
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn-line mt-6 w-full !py-2 text-sm"
                >
                  Close Ledger
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
