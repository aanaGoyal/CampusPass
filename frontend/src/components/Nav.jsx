import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Ticket } from 'lucide-react';
import Logo from './Logo.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  const link =
    'text-sm font-semibold underline-offset-8 hover:underline decoration-2 decoration-cobalt transition-colors';

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-ivory/95 backdrop-blur-sm">
      <div className="wrap flex h-16 items-center justify-between">
        <Link to="/" aria-label="CampusPass home">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          <Link to="/#events" className={link}>
            Events
          </Link>
          <Link to="/#how" className={link}>
            How it works
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4 pl-2 border-l border-rule">
              {/* User Identity Chip */}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-ink">{user.name}</span>
                <span className="border border-rule bg-paper px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-cobalt">
                  {user.role}
                </span>
              </div>

              {/* Sign out */}
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-mute hover:text-ink transition-colors"
                title="Sign out of CampusPass"
              >
                <LogOut size={14} aria-hidden="true" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className={link}>
                Sign in
              </NavLink>
              <Link to="/signup" className="btn-solid !py-2.5">
                Get pass
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="-mr-2 p-2 md:hidden text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="wrap border-t border-rule pb-6 md:hidden bg-ivory">
          <Link to="/#events" className="block border-b border-rule py-4 font-display text-2xl">
            Events
          </Link>
          <Link to="/#how" className="block border-b border-rule py-4 font-display text-2xl">
            How it works
          </Link>

          {isAuthenticated ? (
            <div className="py-4 border-b border-rule space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink">{user.name}</p>
                  <p className="text-xs text-mute font-mono uppercase">{user.role} · {user.email}</p>
                </div>
                <span className="border border-cobalt bg-paper px-2 py-0.5 text-xs font-mono uppercase text-cobalt">
                  {user.role}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="btn-line w-full !py-2 text-sm flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="block border-b border-rule py-4 font-display text-2xl">
                Sign in
              </Link>
              <Link to="/signup" className="block border-b border-rule py-4 font-display text-2xl text-cobalt">
                Create an account
              </Link>
              <Link to="/#events" className="btn-solid mt-6 w-full">
                Discover events
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
