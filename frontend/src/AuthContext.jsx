import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearSession,
  getCurrentSession,
  getUserBookings,
  saveUserBooking,
  cancelUserBooking,
  signIn as apiSignIn,
  signUp as apiSignUp,
} from './api/auth.js';

const AuthCtx = createContext(null);

export function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentSession());
  const [bookings, setBookings] = useState([]);

  // Sync bookings whenever user changes
  useEffect(() => {
    if (user?.id) {
      setBookings(getUserBookings(user.id));
    } else {
      setBookings([]);
    }
  }, [user?.id]);

  const login = useCallback(async ({ email, password }) => {
    const authenticated = await apiSignIn({ email, password });
    setUser(authenticated);
    return authenticated;
  }, []);

  const signup = useCallback(async (data) => {
    const newUser = await apiSignUp(data);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setBookings([]);
  }, []);

  const bookTicket = useCallback(
    (event) => {
      if (!user) throw new Error('You must be signed in to book a seat.');
      const booking = {
        id: `ticket_${Date.now()}`,
        eventId: event.id,
        eventTitle: event.title,
        category: event.category,
        venue: event.venue,
        startsAt: event.startsAt,
        bookedAt: new Date().toISOString(),
        passNumber: `CP-26-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      const updated = saveUserBooking(user.id, booking);
      setBookings(updated);
      return booking;
    },
    [user]
  );

  const cancelBooking = useCallback(
    (eventId) => {
      if (!user) return;
      const updated = cancelUserBooking(user.id, eventId);
      setBookings(updated);
    },
    [user]
  );

  const isBooked = useCallback(
    (eventId) => bookings.some((b) => b.eventId === eventId),
    [bookings]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role || 'guest',
      login,
      signup,
      logout,
      bookings,
      bookTicket,
      cancelBooking,
      isBooked,
    }),
    [user, bookings, login, signup, logout, bookTicket, cancelBooking, isBooked]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

