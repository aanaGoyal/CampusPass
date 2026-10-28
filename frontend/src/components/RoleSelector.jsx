import { useRef } from 'react';
import { Ticket, CalendarPlus, ShieldCheck, Check, AlertCircle, Info } from 'lucide-react';

const ROLES = [
  {
    id: 'student',
    title: 'Student',
    tagline: 'Standard attendee pass',
    description: 'discover events and manage bookings.',
    icon: Ticket,
    badge: 'Open Access',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    id: 'organiser',
    title: 'Organiser',
    tagline: 'Club or department lead',
    description: 'create events and manage eligible event registrations.',
    icon: CalendarPlus,
    badge: 'Verification Req.',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
  },
  {
    id: 'admin',
    title: 'Admin',
    tagline: 'Platform supervisor',
    description: 'approve events and administer authorised platform functions.',
    icon: ShieldCheck,
    badge: 'Auth Key Req.',
    badgeClass: 'bg-rose-50 text-rose-900 border-rose-200',
  },
];

export default function RoleSelector({
  selectedRole,
  onChange,
  adminKey,
  onAdminKeyChange,
  affiliation,
  onAffiliationChange,
  errors = {},
}) {
  const containerRef = useRef(null);

  const handleKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % ROLES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + ROLES.length) % ROLES.length;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(ROLES[index].id);
      return;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const targetRole = ROLES[nextIndex].id;
      onChange(targetRole);
      const buttons = containerRef.current?.querySelectorAll('[role="radio"]');
      if (buttons && buttons[nextIndex]) {
        buttons[nextIndex].focus();
      }
    }
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-baseline justify-between border-b border-rule pb-2">
        <label id="role-select-label" className="label uppercase tracking-wider text-ink font-semibold">
          Select Your Campus Role
        </label>
        <span className="text-xs text-mute font-medium">Role determines access permissions</span>
      </div>

      {/* Role Selection Tiles */}
      <div
        ref={containerRef}
        role="radiogroup"
        aria-labelledby="role-select-label"
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {ROLES.map((role, idx) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(role.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`group relative flex flex-col justify-between border p-4 text-left cursor-pointer transition-all duration-150 outline-none ${
                isSelected
                  ? 'border-ink bg-paper ring-2 ring-cobalt shadow-sm'
                  : 'border-rule bg-paper/60 hover:border-ink hover:bg-paper'
              } focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2`}
            >
              {/* Header with Icon, Badge, and Indicator */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-none border transition-colors ${
                      isSelected
                        ? 'border-cobalt bg-cobalt text-paper'
                        : 'border-rule bg-ivory text-ink group-hover:border-ink'
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-block border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${role.badgeClass}`}>
                      {role.badge}
                    </span>
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                        isSelected ? 'border-cobalt bg-cobalt text-paper' : 'border-rule bg-paper'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                  </div>
                </div>

                {/* Role Details */}
                <h4 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
                  {role.title}
                </h4>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-mute">
                  {role.tagline}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink/80">
                  {role.description}
                </p>
              </div>

              {/* Bottom decorative tick or line */}
              <div
                className={`mt-3 h-0.5 w-full transition-colors ${
                  isSelected ? 'bg-cobalt' : 'bg-transparent group-hover:bg-rule'
                }`}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>

      {/* Dynamic RBAC Context & Security Requirements */}
      {selectedRole === 'student' && (
        <div className="flex items-start gap-2.5 border-l-2 border-cobalt bg-paper px-3.5 py-2.5 text-xs text-mute">
          <Info size={16} className="mt-0.5 shrink-0 text-cobalt" aria-hidden="true" />
          <p>
            <strong className="text-ink font-semibold">Immediate access:</strong> Student accounts self-register and can immediately discover events and reserve tickets using a verified university email.
          </p>
        </div>
      )}

      {selectedRole === 'organiser' && (
        <div className="space-y-3 rounded-none border border-amber-200 bg-amber-50/40 p-4">
          <div className="flex items-start gap-2 text-xs text-amber-950">
            <Info size={16} className="mt-0.5 shrink-0 text-amber-700" aria-hidden="true" />
            <p>
              <strong className="font-semibold">Verification Required:</strong> Organisers can manage rosters and draft events. Public publishing requires student union or faculty affiliation confirmation.
            </p>
          </div>
          <div>
            <label htmlFor="affiliation" className="label text-ink">
              Campus Organisation / Society Name <span className="text-vermilion-ink">*</span>
            </label>
            <input
              id="affiliation"
              name="affiliation"
              type="text"
              required
              value={affiliation}
              onChange={(e) => onAffiliationChange(e.target.value)}
              placeholder="e.g. Developers Guild, Music Society, AI Club"
              className="mt-1.5 w-full border border-ink bg-paper px-3 py-2 text-sm text-ink placeholder:text-mute focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt"
            />
            {errors.affiliation && (
              <p className="mt-1 text-xs text-vermilion-ink font-semibold">{errors.affiliation}</p>
            )}
          </div>
        </div>
      )}

      {selectedRole === 'admin' && (
        <div className="space-y-3 rounded-none border border-rose-200 bg-rose-50/40 p-4">
          <div className="flex items-start gap-2 text-xs text-rose-950">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-700" aria-hidden="true" />
            <div>
              <p className="font-semibold">Strict Role-Based Access Control</p>
              <p className="mt-0.5 leading-relaxed text-rose-900">
                Administrator privileges approve events and administer platform operations. Public self-elevation is strictly prohibited. Enter the official authorization key provided by Campus Systems Administration.
              </p>
            </div>
          </div>
          <div>
            <label htmlFor="adminKey" className="label text-ink">
              System Administrator Authorization Key <span className="text-vermilion-ink">*</span>
            </label>
            <input
              id="adminKey"
              name="adminKey"
              type="password"
              required
              value={adminKey}
              onChange={(e) => onAdminKeyChange(e.target.value)}
              placeholder="Enter campus system admin code (e.g. CAMPUS-ADMIN-2026)"
              className="mt-1.5 w-full border border-ink bg-paper px-3 py-2 text-sm font-mono text-ink placeholder:text-mute focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt"
            />
            {errors.adminKey && (
              <p className="mt-1 text-xs text-vermilion-ink font-semibold">{errors.adminKey}</p>
            )}
            <p className="mt-1.5 text-[11px] text-mute">
              Demo admin key: <code className="bg-paper px-1 py-0.5 border border-rule font-mono text-ink">CAMPUS-ADMIN-2026</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

