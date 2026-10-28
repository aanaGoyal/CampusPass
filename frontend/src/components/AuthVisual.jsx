import { Mark } from './Logo.jsx';

export default function AuthVisual({ variant = 'signin' }) {
  const isSignIn = variant === 'signin';

  return (
    <aside
      aria-label="CampusPass Identity and Event Ledger"
      className="relative flex flex-col justify-between overflow-hidden border border-ink bg-ivory p-6 sm:p-8 lg:p-10"
    >
      {/* Background Architectural Grid Lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #20211F 1px, transparent 1px), linear-gradient(to bottom, #20211F 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Decorative corner registration marks */}
      <div className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 border-ink/40" />
      <div className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2 border-ink/40" />
      <div className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-ink/40" />
      <div className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-ink/40" />

      {/* Top Header Strip */}
      <div className="relative z-10 flex items-center justify-between border-b border-rule pb-4">
        <div className="flex items-center gap-2">
          <Mark size={22} />
          <span className="font-display text-sm font-semibold tracking-tight text-ink">
            CampusPass
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-mute">
          <span className="inline-block h-2 w-2 rounded-full bg-vermilion" aria-hidden="true" />
          <span>{isSignIn ? 'AUTH // LEDGER' : 'ENROL // ISSUE 26'}</span>
        </div>
      </div>

      {/* Middle Visual Composition */}
      <div className="relative z-10 my-8 space-y-6 sm:my-10">
        <div>
          <span className="inline-block border border-ink bg-paper px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
            {isSignIn ? 'Passport Entry' : 'New Member Index'}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {isSignIn ? (
              <>
                The hall is <span className="italic font-normal text-cobalt">open</span>.
              </>
            ) : (
              <>
                Take your <span className="italic font-normal text-cobalt">seat</span>.
              </>
            )}
          </h2>
          <p className="mt-3 font-display text-lg italic text-mute sm:text-xl">
            {isSignIn
              ? 'Every auditorium, lab, and courtyard in one ledger.'
              : 'Join students and organisers across all faculties.'}
          </p>
        </div>

        {/* Lightweight SVG Poster Graphic */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-ink bg-paper p-4 shadow-sm">
          {isSignIn ? (
            /* Sign-in abstract ticket stub & acoustic wave visual */
            <svg
              viewBox="0 0 320 180"
              className="h-full w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Perforation line */}
              <line x1="220" y1="0" x2="220" y2="180" stroke="#DFDDD5" strokeWidth="2" strokeDasharray="4 4" />
              {/* Ticket Notches */}
              <circle cx="220" cy="0" r="10" fill="#F7F5EF" stroke="#20211F" strokeWidth="1.5" />
              <circle cx="220" cy="180" r="10" fill="#F7F5EF" stroke="#20211F" strokeWidth="1.5" />
              
              {/* Graphic elements */}
              <rect x="24" y="24" width="72" height="72" fill="#315BE8" />
              <circle cx="96" cy="96" r="38" fill="#E65A43" style={{ mixBlendMode: 'multiply' }} />
              <circle cx="60" cy="60" r="6" fill="#FFFEFA" />
              
              {/* Typographic ticket numerals */}
              <text x="140" y="58" fontFamily="Fraunces, serif" fontSize="36" fontWeight="600" fill="#20211F">’26</text>
              <text x="140" y="78" fontFamily="Hanken Grotesk, sans-serif" fontSize="10" letterSpacing="0.1em" fill="#65645E">CAMPUSPASS SYSTEM</text>
              <line x1="140" y1="88" x2="200" y2="88" stroke="#20211F" strokeWidth="1.5" />
              
              {/* Barcode-style lines */}
              <g opacity="0.8">
                {[12, 16, 22, 28, 32, 38, 42, 46, 54, 60, 68, 72, 78].map((x, i) => (
                  <line key={i} x1={236 + x} y1="30" x2={236 + x} y2="90" stroke="#20211F" strokeWidth={i % 3 === 0 ? 3 : 1.5} />
                ))}
              </g>
              <text x="240" y="112" fontFamily="Hanken Grotesk, monospace" fontSize="8" letterSpacing="0.15em" fill="#65645E">PASS #CP-2026</text>
              
              {/* Event index ticker snippet */}
              <rect x="24" y="128" width="180" height="28" fill="#F7F5EF" stroke="#DFDDD5" />
              <text x="34" y="146" fontFamily="Hanken Grotesk, sans-serif" fontSize="10" fontWeight="600" fill="#20211F">
                LIVE GUIDE: 10 EVENTS REGISTERED
              </text>
              <circle cx="188" cy="142" r="3" fill="#315BE8" />
            </svg>
          ) : (
            /* Sign-up architectural quadrant & registration ledger visual */
            <svg
              viewBox="0 0 320 180"
              className="h-full w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Stepped isometric geometry */}
              <polygon points="20,150 90,30 160,150" fill="#315BE8" opacity="0.9" />
              <polygon points="120,150 190,40 260,150" fill="#DFDDD5" opacity="0.6" />
              <circle cx="210" cy="50" r="28" fill="#E65A43" style={{ mixBlendMode: 'multiply' }} />
              
              {/* Grid axes */}
              <line x1="20" y1="150" x2="300" y2="150" stroke="#20211F" strokeWidth="2" />
              <line x1="20" y1="20" x2="20" y2="150" stroke="#20211F" strokeWidth="2" />
              
              {/* Typographic Role Matrix */}
              <g fontFamily="Hanken Grotesk, sans-serif" fontSize="9" fontWeight="600" fill="#20211F">
                <rect x="180" y="90" width="120" height="18" fill="#FFFEFA" stroke="#20211F" />
                <text x="188" y="103">STUDENT · BOOK SEATS</text>
                
                <rect x="180" y="114" width="120" height="18" fill="#FFFEFA" stroke="#20211F" />
                <text x="188" y="127">ORGANISER · HOST</text>
              </g>

              {/* Red vermilion dot */}
              <circle cx="20" cy="20" r="4" fill="#E65A43" />
              <text x="32" y="24" fontFamily="Fraunces, serif" fontSize="12" fontStyle="italic" fill="#20211F">
                RBAC Access Tier
              </text>
            </svg>
          )}
        </div>

        {/* Short memorable editorial copy */}
        <p className="text-sm leading-relaxed text-mute">
          {isSignIn
            ? 'CampusPass centralizes hall bookings, ticket reservations, and society showcases into a single verified system. Sign in to reserve your seat in seconds.'
            : 'Register your verified student or organiser account to secure passes, access attendee rosters, and stay in touch with campus life without social feed clutter.'}
        </p>
      </div>

      {/* Bottom Editorial Stamp */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-4 font-mono text-[11px] text-mute">
        <span>CAMPUSPASS // AUTONOMOUS VERIFICATION</span>
        <span className="font-semibold text-ink">EST. 2026</span>
      </div>
    </aside>
  );
}

