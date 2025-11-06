import type { ReactNode } from 'react';

interface SupportCardProps {
  title: string;
  children: ReactNode;
  accentClassName: string;
}

export function SupportCard({ title, children, accentClassName }: SupportCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-[28px] border-4 border-black p-6 shadow-[5px_5px_0_#000] ${accentClassName}`}
    >
      <h3 className="text-xl font-black text-black">{title}</h3>
      <div className="flex flex-col gap-2 text-sm font-semibold text-black/75">{children}</div>
    </div>
  );
}
