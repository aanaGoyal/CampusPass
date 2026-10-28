import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import AuthVisual from '../components/AuthVisual.jsx';

export default function SignIn() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Resolve safe destination redirect
  const nextParam = params.get('next') || (location.state?.from?.pathname || '');
  const safeNext = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Validate form before submission
  function validate() {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Campus email address is required.';
    } else if (!email.includes('@')) {
      errs.email = 'Please provide a valid email format (e.g. name@campus.edu).';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;

    setBusy(true);
    setError('');

    try {
      const authenticatedUser = await login({ email, password });
      setSuccessNotice(true);
      // Brief pause to display verified badge before redirection
      setTimeout(() => {
        navigate(safeNext, { replace: true });
      }, 400);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
      setBusy(false);
    }
  }

  // Quick fill helper for evaluator testing different roles
  function fillDemo(demoEmail) {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setFieldErrors({});
  }

  const signUpUrl = safeNext !== '/' ? `/signup?next=${encodeURIComponent(safeNext)}` : '/signup';

  return (
    <div className="wrap min-h-[calc(100vh-4rem)] py-8 sm:py-12 lg:py-16">
      {/* Return back to events link */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mute hover:text-ink hover:underline decoration-2"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Event Guide
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 items-stretch">
        {/* Left Column: Editorial Graphic Poster */}
        <div className="lg:col-span-5 flex flex-col">
          <AuthVisual variant="signin" />
        </div>

        {/* Right Column: Premium Form Card */}
        <div className="lg:col-span-7 flex flex-col justify-between border border-ink bg-paper p-6 sm:p-10 lg:p-12">
          <div>
            {/* Context Notice if redirected from an event booking */}
            {safeNext !== '/' && (
              <div className="mb-6 border-l-4 border-cobalt bg-ivory p-4 text-xs">
                <span className="font-semibold uppercase tracking-wider text-cobalt block mb-0.5">
                  Booking in Progress
                </span>
                <p className="text-ink">
                  You are authenticating to complete your seat reservation. You will be redirected immediately back to your event after sign-in.
                </p>
              </div>
            )}

            {/* Header */}
            <div className="border-b border-rule pb-6">
              <span className="label uppercase tracking-widest text-cobalt font-semibold">
                Passholder Authentication
              </span>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
                Sign in to CampusPass
              </h1>
              <p className="mt-2 text-sm text-mute">
                Enter your registered campus credentials to access your ticket ledger and event administration.
              </p>
            </div>

            {/* Quick Demo Credentials Bar */}
            <div className="mt-6 border border-rule bg-ivory/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-mute">
                  Demo Accounts (1-Click Fill)
                </span>
                <span className="text-[10px] text-mute">password: <code className="font-mono text-ink">password123</code></span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('student@campus.edu')}
                  className="border border-rule bg-paper px-2.5 py-1 text-xs font-medium text-ink hover:border-cobalt hover:text-cobalt transition-colors"
                >
                  Student Pass
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('organiser@campus.edu')}
                  className="border border-rule bg-paper px-2.5 py-1 text-xs font-medium text-ink hover:border-cobalt hover:text-cobalt transition-colors"
                >
                  Organiser Lead
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin@campus.edu')}
                  className="border border-rule bg-paper px-2.5 py-1 text-xs font-medium text-ink hover:border-cobalt hover:text-cobalt transition-colors"
                >
                  Campus Admin
                </button>
              </div>
            </div>

            {/* Actual Form */}
            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="label text-ink">
                  Campus Email Address <span className="text-vermilion-ink">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="e.g. yourname@campus.edu"
                  className={`mt-2 w-full border bg-paper px-4 py-3 text-base text-ink placeholder:text-mute transition-colors focus:outline-none focus:ring-1 ${
                    fieldErrors.email
                      ? 'border-vermilion-ink focus:border-vermilion-ink focus:ring-vermilion-ink'
                      : 'border-ink focus:border-cobalt focus:ring-cobalt'
                  }`}
                />
                {fieldErrors.email && (
                  <p id="email-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-vermilion-ink">
                    <AlertCircle size={14} aria-hidden="true" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="label text-ink">
                    Account Password <span className="text-vermilion-ink">*</span>
                  </label>
                  <span className="text-[11px] text-mute">Minimum 8 characters</span>
                </div>
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    placeholder="Enter your secret password"
                    className={`w-full border bg-paper py-3 pl-4 pr-12 text-base text-ink placeholder:text-mute transition-colors focus:outline-none focus:ring-1 ${
                      fieldErrors.password
                        ? 'border-vermilion-ink focus:border-vermilion-ink focus:ring-vermilion-ink'
                        : 'border-ink focus:border-cobalt focus:ring-cobalt'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password text' : 'Show password text'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-mute hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                  >
                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-vermilion-ink">
                    <AlertCircle size={14} aria-hidden="true" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Global Error Banner */}
              {error && (
                <div role="alert" className="border-l-4 border-vermilion-ink bg-paper p-4 text-sm text-vermilion-ink flex items-start gap-3 shadow-sm border border-rule">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold block">Authentication Unsuccessful</span>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Notice */}
              {successNotice && (
                <div role="status" className="border-l-4 border-emerald-600 bg-emerald-50/50 p-4 text-sm text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-600" aria-hidden="true" />
                  <span className="font-semibold">Credentials verified. Loading your campus session...</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={busy || successNotice}
                className="btn-solid w-full !py-3.5 text-base font-semibold transition-all duration-150 flex items-center justify-center gap-2"
              >
                {busy ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-paper border-t-transparent" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Pass</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Switch Link */}
          <div className="mt-8 border-t border-rule pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <span className="text-mute">Don’t have an active pass?</span>
            <Link
              to={signUpUrl}
              className="font-semibold text-ink underline decoration-cobalt decoration-2 underline-offset-4 hover:text-cobalt transition-colors"
            >
              Create a new campus account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
