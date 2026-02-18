import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  const currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let relative: string;
  if (yearsAgo > 0) {
    relative = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    relative = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    relative = `${daysAgo}d ago`;
  } else {
    relative = 'Today';
  }

  const fullDate = targetDate.toLocaleString('en-gb', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `${fullDate} (${relative})`;
}

// Short date for listings: "17 Feb 2026"
export function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
