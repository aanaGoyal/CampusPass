import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { EventsProvider } from './EventsContext.jsx';
import { AuthProvider } from './AuthContext.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import EventDetail from './pages/EventDetail.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return window.scrollTo(0, 0);
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 50);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <EventsProvider>
        <ScrollTop />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events/:id" element={<EventDetail />} />
            {/* Primary & alias authentication routes */}
            <Route path="/login" element={<SignIn />} />
            <Route path="/signin" element={<Navigate to="/login" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<Navigate to="/signup" replace />} />
            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="wrap py-32 text-center">
                  <span className="label uppercase tracking-widest text-vermilion-ink">404 Error</span>
                  <h1 className="mt-2 font-display text-5xl font-semibold">Page not found</h1>
                  <p className="mt-4 text-mute">The ledger does not contain the page you requested.</p>
                  <a href="/" className="btn-solid mt-6 inline-flex">
                    Return to Event Guide
                  </a>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </EventsProvider>
    </AuthProvider>
  );
}
