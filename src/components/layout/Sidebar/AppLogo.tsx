'use client';

export function AppLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-10 text-primary fill-primary" aria-hidden="true">
      <circle cx="22" cy="10" r="2.2" />
      <path
        d="M6 23 L13 13 L20 23"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 23 L17.5 18 L19 20.5 L21 17 L25 23"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
