// Brand mark: a ticket stub (square with a perforation notch) holding one vermilion dot.
export function Mark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M0 0H32V12.5a3.5 3.5 0 0 0 0 7V32H0Z" fill="#315BE8" />
      <circle cx="11" cy="16" r="4.5" fill="#E65A43" />
    </svg>
  );
}
export default function Logo() {
  return <span className="flex items-center gap-2.5"><Mark /><span className="font-display text-xl font-semibold tracking-tight">CampusPass</span></span>;
}
