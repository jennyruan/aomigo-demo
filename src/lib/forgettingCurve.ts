export const REVIEW_INTERVALS = [
  { label: '10 minutes', minutes: 10 / (24 * 60), days: 0 },
  { label: '1 day', minutes: 1440, days: 1 },
  { label: '3 days', minutes: 4320, days: 3 },
  { label: '7 days', minutes: 10080, days: 7 },
  { label: '14 days', minutes: 20160, days: 14 },
  { label: '30 days', minutes: 43200, days: 30 },
  { label: '60 days', minutes: 86400, days: 60 },
];

export function getNextReviewDate(
  currentInterval: number,
  result: 'good' | 'poor'
): { date: Date; intervalDays: number } {
  let nextIntervalIndex: number;

  if (result === 'good') {
    nextIntervalIndex = Math.min(currentInterval + 1, REVIEW_INTERVALS.length - 1);
  } else {
    nextIntervalIndex = Math.max(0, currentInterval - 1);
  }

  const interval = REVIEW_INTERVALS[nextIntervalIndex];
  const date = new Date();
  date.setDate(date.getDate() + interval.days);

  return {
    date,
    intervalDays: interval.days,
  };
}

export function scheduleFirstReview(): Date {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10);
  return date;
}

export function isReviewOverdue(scheduledDate: string): boolean {
  return new Date(scheduledDate) < new Date();
}

export function getOverdueDays(scheduledDate: string): number {
  const now = new Date();
  const scheduled = new Date(scheduledDate);
  const diffTime = now.getTime() - scheduled.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
