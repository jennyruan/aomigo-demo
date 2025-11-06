import type { ReactNode } from 'react';

interface LandingSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  backgroundClassName?: string;
  children?: ReactNode;
}

const alignClassMap = {
  left: 'items-start text-left',
  center: 'items-center text-center',
} as const;

export function LandingSection({
  eyebrow,
  title,
  description,
  align = 'left',
  backgroundClassName = 'bg-cream-100',
  children,
}: LandingSectionProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-[42px] cartoon-border px-8 py-10 sm:px-12 sm:py-14 ${backgroundClassName}`}
    >
      <div
        className="pointer-events-none absolute -left-10 top-6 hidden h-32 w-32 rotate-6 rounded-3xl border-4 border-black bg-orange-300 opacity-80 md:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-12 -bottom-10 hidden h-40 w-40 -rotate-12 rounded-3xl border-4 border-black bg-purple-300 opacity-60 md:block"
        aria-hidden
      />

      <div className={`relative flex flex-col gap-6 ${alignClassMap[align]}`}>
        {eyebrow && (
          <span className="rounded-full bg-black px-4 py-1 text-xs font-bold uppercase tracking-widest text-cream-50">
            {eyebrow}
          </span>
        )}
        <div className="max-w-3xl space-y-2">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="text-base font-semibold text-purple-900/90 sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {children && <div className="relative z-[1] w-full">{children}</div>}
      </div>
    </section>
  );
}
