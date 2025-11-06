interface StatMeterProps {
  label: string;
  value: number;
  max: number;
  tone: 'orange' | 'mint' | 'violet';
  emoji: string;
  caption?: string;
}

const toneClassMap = {
  orange: {
    track: 'bg-orange-100',
    fill: 'from-orange-400 to-orange-500',
  },
  mint: {
    track: 'bg-emerald-100',
    fill: 'from-emerald-400 to-emerald-500',
  },
  violet: {
    track: 'bg-purple-100',
    fill: 'from-purple-400 to-purple-500',
  },
} satisfies Record<StatMeterProps['tone'], { track: string; fill: string }>;

export function StatMeter({ label, value, max, tone, emoji, caption }: StatMeterProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  const toneClasses = toneClassMap[tone];

  return (
    <div className="flex flex-col gap-3 rounded-[28px] border-4 border-black bg-white p-5 shadow-[5px_5px_0_#000]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-lg font-black text-black">
          <span className="text-2xl" aria-hidden>
            {emoji}
          </span>
          {label}
        </div>
        <span className="text-sm font-extrabold text-black/70">
          {value}/{max}
        </span>
      </div>
      <div className={`h-5 w-full rounded-full border-4 border-black ${toneClasses.track}`}>
        <div
          className={`h-full rounded-full border-r-4 border-black bg-gradient-to-r ${toneClasses.fill} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {caption && <p className="text-xs font-semibold uppercase tracking-wide text-black/60">{caption}</p>}
    </div>
  );
}
