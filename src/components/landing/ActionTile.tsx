import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';

interface ActionTileProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accentClassName: string;
  badgeCount?: number;
}

function BaseActionTile({
  to,
  icon: Icon,
  title,
  description,
  accentClassName,
  badgeCount,
}: ActionTileProps) {
  return (
    <Link
      to={to}
      className={`relative flex h-full flex-col gap-3 rounded-[32px] border-4 border-black p-6 text-left shadow-[6px_6px_0_#000] transition-transform duration-150 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#000] ${accentClassName}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0_#000]">
          <Icon className="h-7 w-7 text-black" strokeWidth={3} />
        </span>
        <div className="flex-1">
          <h3 className="text-2xl font-black leading-snug text-black">{title}</h3>
          {badgeCount !== undefined && badgeCount > 0 && (
            <span className="mt-1 inline-flex items-center rounded-full border-4 border-black bg-white px-3 py-0.5 text-xs font-bold uppercase">
              {badgeCount} due
            </span>
          )}
        </div>
      </div>
      <p className="text-sm font-semibold text-black/80 sm:text-base">{description}</p>
    </Link>
  );
}

export const ActionTile = memo(BaseActionTile);
