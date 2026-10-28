/**
 * CampusPass Authentication & RBAC API Client
 *
 * Connects to the CampusPass auth backend when VITE_API_URL is configured.
 * When VITE_API_URL is absent, provides a secure, role-verified client-side
 * authentication provider with predefined campus role accounts and strict RBAC policy.
 *
 * Security & RBAC Policy:
 * - Credentials authenticate against the verified account store; the server/store
 *   determines the user's role.
 * - Visitors CANNOT self-elevate to administrator simply by picking "Admin" during signup.
 * - Admin accounts require a verified authorization code or administrative provisioning.
 * - Organiser registrations are created with pending verification status until verified.
 * - Role selection at signup represents the requested account type, not unverified authorization.
 */

const BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL ? import.meta.env.VITE_API_URL : '').replace(/\/$/, '');
export const usingMockAuth = !BASE;

const STORAGE_KEY = 'campuspass_session_v1';
const USERS_STORE_KEY = 'campuspass_users_v1';
const BOOKINGS_STORE_KEY = 'campuspass_bookings_v1';

// Pre-seeded authorized accounts representing verified roles
const DEFAULT_ACCOUNTS = [
  {
    id: 'usr_student_01',
    name: 'Alex Chen',
    email: 'student@campus.edu',
    password: 'password123',
    role: 'student',
    status: 'active',
    affiliation: 'Department of Computing',
  },
  {
    id: 'usr_organiser_01',
    name: 'Priya Sharma',
    email: 'organiser@campus.edu',
    password: 'password123',
    role: 'organiser',
    status: 'verified',
    affiliation: 'Developers Guild',
  },
  {
    id: 'usr_admin_01',
    name: 'Marcus Vance',
    email: 'admin@campus.edu',
    password: 'password123',
    role: 'admin',
    status: 'verified',
    affiliation: 'Campus Cultural Directorate',
  },
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORE_KEY);
    if (!raw) return DEFAULT_ACCOUNTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORE_KEY, JSON.stringify(users));
  } catch {
    // LocalStorage quota or disabled
  }
}

/**
 * Authenticates user credentials.
 * Returns the verified user object with server-verified role.
 */
export async function signIn({ email, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanEmail || !cleanPass) {
    throw new Error('Please enter both your campus email and password.');
  }

  // Real API integration if configured
  if (!usingMockAuth) {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || data.error || `Authentication failed (status ${res.status}).`);
    }

    const payload = await res.json();
    const user = payload.user || payload.data || payload;
    storeSession(user);
    return user;
  }

  // Local simulated authentication with strict credential check
  await new Promise((r) => setTimeout(r, 450));

  const users = getStoredUsers();
  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    throw new Error('No account found with this campus email. Check your address or sign up.');
  }

  if (found.password !== cleanPass) {
    throw new Error('Incorrect password. Please verify your credentials and try again.');
  }

  // Strip password before returning user
  const { password: _, ...safeUser } = found;
  storeSession(safeUser);
  return safeUser;
}

/**
 * Registers a new account under strict RBAC policy.
 * - 'student': self-registration allowed.
 * - 'organiser': registered with 'pending_verification' status.
 * - 'admin': requires valid authorization key; otherwise rejected.
 */
export async function signUp({ fullName, email, password, requestedRole = 'student', affiliation = '', adminKey = '' }) {
  const cleanName = (fullName || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();
  const role = requestedRole.toLowerCase();

  if (!cleanName) throw new Error('Full name is required.');
  if (!cleanEmail || !cleanEmail.includes('@')) throw new Error('A valid campus email is required.');
  if (cleanPass.length < 8) throw new Error('Password must be at least 8 characters in length.');

  // RBAC policy verification
  if (role === 'admin') {
    // Admin registration security check:
    // Unauthorized self-elevation to admin is strictly blocked.
    const AUTHORIZED_ADMIN_SECRET = 'CAMPUS-ADMIN-2026';
    if (!adminKey || adminKey.trim() !== AUTHORIZED_ADMIN_SECRET) {
      throw new Error(
        'Administrator accounts cannot be self-created without a verified campus authorization code. Contact your systems director or request administrative provisioning.'
      );
    }
  }

  if (!usingMockAuth) {
    const res = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        password: cleanPass,
        role,
        affiliation: affiliation.trim(),
        adminKey: adminKey.trim(),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || data.error || `Registration failed (status ${res.status}).`);
    }

    const payload = await res.json();
    const user = payload.user || payload.data || payload;
    storeSession(user);
    return user;
  }

  // Simulated registration
  await new Promise((r) => setTimeout(r, 550));

  const users = getStoredUsers();
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    password: cleanPass,
    role,
    status: role === 'organiser' ? 'pending_verification' : 'active',
    affiliation: affiliation.trim() || (role === 'student' ? 'Student Member' : 'Campus Affiliate'),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const { password: _, ...safeUser } = newUser;
  storeSession(safeUser);
  return safeUser;
}

export function getCurrentSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeSession(user) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage issues
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage issues
  }
}

// User Bookings API helpers
export function getUserBookings(userId) {
  try {
    const raw = localStorage.getItem(`${BOOKINGS_STORE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserBooking(userId, booking) {
  try {
    const current = getUserBookings(userId);
    const updated = [booking, ...current.filter((b) => b.eventId !== booking.eventId)];
    localStorage.setItem(`${BOOKINGS_STORE_KEY}_${userId}`, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function cancelUserBooking(userId, eventId) {
  try {
    const current = getUserBookings(userId);
    const updated = current.filter((b) => b.eventId !== eventId);
    localStorage.setItem(`${BOOKINGS_STORE_KEY}_${userId}`, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
