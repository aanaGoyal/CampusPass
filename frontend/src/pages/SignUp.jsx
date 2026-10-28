import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import AuthVisual from '../components/AuthVisual.jsx';
import RoleSelector from '../components/RoleSelector.jsx';

export default function SignUp() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Resolve safe destination redirect
  const nextParam = params.get('next') || (location.state?.from?.pathname || '');
  const safeNext = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [affiliation, setAffiliation] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [successStatus, setSuccessStatus] = useState(null);

  // Validate all fields including password match and role-specific requirements
  function validate() {
    const errs = {};
    if (!fullName.trim()) {
      errs.fullName = 'Full legal or campus name is required.';
    }

    if (!email.trim()) {
      errs.email = 'Campus email address is required.';
    } else if (!email.includes('@')) {
      errs.email = 'Please provide a valid email format (e.g. name@campus.edu).';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match. Please re-enter.';
    }

    if (selectedRole === 'organiser' && !affiliation.trim()) {
      errs.affiliation = 'Organisation or department name is required for verification.';
    }

    if (selectedRole === 'admin' && !adminKey.trim()) {
      errs.adminKey = 'System Administrator Key is required to create an admin account.';
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
      const createdUser = await signup({
        fullName,
        email,
        password,
        requestedRole: selectedRole,
        affiliation,
        adminKey,
      });

      setSuccessStatus({
        role: createdUser.role,
        status: createdUser.status,
      });

      // Brief delay so user sees confirmed status before redirecting
      setTimeout(() => {
        navigate(safeNext, { replace: true });
      }, 700);
    } catch (err) {
      setError(err.message || 'Registration could not be completed.');
      setBusy(false);
    }
  }

  const signInUrl = safeNext !== '/' ? `/login?next=${encodeURIComponent(safeNext)}` : '/login';

  return (
    <div className="wrap min-h-[calc(100vh-4rem)] py-8 sm:py-12 lg:py-16">
      {/* Return link */}
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
          <AuthVisual variant="signup" />
        </div>

        {/* Right Column: Premium Form Card */}
        <div className="lg:col-span-7 flex flex-col justify-between border border-ink bg-paper p-6 sm:p-10 lg:p-12">
          <div>
            {/* Context Notice if redirected from booking */}
            {safeNext !== '/' && (
              <div className="mb-6 border-l-4 border-cobalt bg-ivory p-4 text-xs">
                <span className="font-semibold uppercase tracking-wider text-cobalt block mb-0.5">
                  Reserving Ticket
                </span>
                <p className="text-ink">
                  Create your student pass below. Once created, you will return straight to your event page to confirm your seat.
                </p>
              </div>
            )}

            {/* Header */}
            <div className="border-b border-rule pb-6">
              <span className="label uppercase tracking-widest text-cobalt font-semibold">
                Member Registration
              </span>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
                Create your CampusPass
              </h1>
              <p className="mt-2 text-sm text-mute">
                Register once for verified access to university events, workshops, cultural nights, and society sessions.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="label text-ink">
                  Full Name <span className="text-vermilion-ink">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(fieldErrors.fullName)}
                  aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="e.g. Jordan Miller"
                  className={`mt-2 w-full border bg-paper px-4 py-3 text-base text-ink placeholder:text-mute transition-colors focus:outline-none focus:ring-1 ${
                    fieldErrors.fullName
                      ? 'border-vermilion-ink focus:border-vermilion-ink focus:ring-vermilion-ink'
                      : 'border-ink focus:border-cobalt focus:ring-cobalt'
                  }`}
                />
                {fieldErrors.fullName && (
                  <p id="fullName-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-vermilion-ink">
                    <AlertCircle size={14} aria-hidden="true" />
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

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

              {/* Passwords Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="label text-ink">
                    Create Password <span className="text-vermilion-ink">*</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      placeholder="At least 8 chars"
                      className={`w-full border bg-paper py-3 pl-4 pr-11 text-base text-ink placeholder:text-mute transition-colors focus:outline-none focus:ring-1 ${
                        fieldErrors.password
                          ? 'border-vermilion-ink focus:border-vermilion-ink focus:ring-vermilion-ink'
                          : 'border-ink focus:border-cobalt focus:ring-cobalt'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-mute hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                    >
                      {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p id="password-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-vermilion-ink">
                      <AlertCircle size={14} aria-hidden="true" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="label text-ink">
                    Confirm Password <span className="text-vermilion-ink">*</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      aria-invalid={Boolean(fieldErrors.confirmPassword)}
                      aria-describedby={fieldErrors.confirmPassword ? 'confirm-error' : undefined}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      placeholder="Re-enter password"
                      className={`w-full border bg-paper py-3 pl-4 pr-11 text-base text-ink placeholder:text-mute transition-colors focus:outline-none focus:ring-1 ${
                        fieldErrors.confirmPassword
                          ? 'border-vermilion-ink focus:border-vermilion-ink focus:ring-vermilion-ink'
                          : 'border-ink focus:border-cobalt focus:ring-cobalt'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-mute hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                    >
                      {showConfirmPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p id="confirm-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-vermilion-ink">
                      <AlertCircle size={14} aria-hidden="true" />
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* ROLE SELECTION TILES - Placed directly beneath relevant fields and before submit */}
              <div className="border-t border-rule pt-5">
                <RoleSelector
                  selectedRole={selectedRole}
                  onChange={(role) => {
                    setSelectedRole(role);
                    setFieldErrors((prev) => ({ ...prev, affiliation: '', adminKey: '' }));
                  }}
                  affiliation={affiliation}
                  onAffiliationChange={setAffiliation}
                  adminKey={adminKey}
                  onAdminKeyChange={setAdminKey}
                  errors={fieldErrors}
                />
              </div>

              {/* Global Error Banner */}
              {error && (
                <div role="alert" className="border-l-4 border-vermilion-ink bg-paper p-4 text-sm text-vermilion-ink flex items-start gap-3 shadow-sm border border-rule">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold block">Registration Blocked</span>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Notification */}
              {successStatus && (
                <div role="status" className="border-l-4 border-emerald-600 bg-emerald-50/50 p-4 text-sm text-emerald-950 flex items-start gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold block">Pass Registered Successfully!</span>
                    <p className="text-xs text-emerald-900 mt-0.5">
                      {successStatus.role === 'admin'
                        ? 'System Administrator account verified. Logging into administrative portal...'
                        : successStatus.role === 'organiser'
                        ? 'Organiser account registered (status: pending society verification). Launching session...'
                        : 'Student pass issued. Redirecting to your destination...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={busy || Boolean(successStatus)}
                className="btn-solid w-full !py-3.5 text-base font-semibold transition-all duration-150 flex items-center justify-center gap-2"
              >
                {busy ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-paper border-t-transparent" />
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {selectedRole === 'student'
                        ? 'Claim Student Pass'
                        : selectedRole === 'organiser'
                        ? 'Submit Organiser Enrolment'
                        : 'Verify Admin Authority'}
                    </span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Switch Link */}
          <div className="mt-8 border-t border-rule pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <span className="text-mute">Already registered in the campus ledger?</span>
            <Link
              to={signInUrl}
              className="font-semibold text-ink underline decoration-cobalt decoration-2 underline-offset-4 hover:text-cobalt transition-colors"
            >
              Sign in with existing credentials →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

