export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
        <rect x="3" y="7" width="26" height="18" rx="2" fill="none" stroke="#B8975A" strokeWidth="1.3" />
        <path d="M3.8 8 16 17.5 28.2 8" fill="none" stroke="#B8975A" strokeWidth="1.3" />
        <circle cx="16" cy="17.5" r="3.2" fill="#E8C9C1" stroke="#B8975A" strokeWidth="1" />
      </svg>
      <span className="font-display text-2xl font-medium tracking-tight text-ink">
        Invite<span className="text-gold-deep italic">Me</span>
      </span>
    </span>
  );
}
