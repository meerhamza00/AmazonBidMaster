import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
}

export function getPerformanceColor(metric: string, value: number): string {
  switch (metric) {
    case 'acos':
      return value < 15 ? 'text-green-500' : 
             value < 25 ? 'text-emerald-500' : 
             value < 35 ? 'text-yellow-500' : 
             'text-red-500';
    case 'roas':
      return value > 5 ? 'text-green-500' : 
             value > 3 ? 'text-emerald-500' : 
             value > 2 ? 'text-yellow-500' : 
             'text-red-500';
    case 'ctr':
      return value > 0.5 ? 'text-green-500' : 
             value > 0.3 ? 'text-emerald-500' : 
             value > 0.2 ? 'text-yellow-500' : 
             'text-red-500';
    default:
      return 'text-foreground';
  }
}

export function getPerformanceLabel(metric: string, value: number): string {
  switch (metric) {
    case 'acos':
      return value < 15 ? 'Excellent' : 
             value < 25 ? 'Good' : 
             value < 35 ? 'Average' : 
             'Poor';
    case 'roas':
      return value > 5 ? 'Excellent' : 
             value > 3 ? 'Good' : 
             value > 2 ? 'Average' : 
             'Poor';
    case 'ctr':
      return value > 0.5 ? 'Excellent' : 
             value > 0.3 ? 'Good' : 
             value > 0.2 ? 'Average' : 
             'Poor';
    default:
      return '';
  }
}

export function getDateRangeFromString(range: string): [Date, Date] {
  const end = new Date();
  let start = new Date();
  
  switch (range) {
    case '7d':
      start.setDate(end.getDate() - 7);
      break;
    case '30d':
      start.setDate(end.getDate() - 30);
      break;
    case '90d':
      start.setDate(end.getDate() - 90);
      break;
    case 'ytd':
      start = new Date(end.getFullYear(), 0, 1); // January 1st of current year
      break;
    default:
      start.setDate(end.getDate() - 30); // Default to 30 days
  }
  
  return [start, end];
}

export function formatDateRange(range: string): string {
  const [start, end] = getDateRangeFromString(range);
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function shortenString(
  str: string | undefined | null,
  maxLength: number,
  suffix: string = "..."
): string {
  if (!str) {
    return "";
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - suffix.length) + suffix;
}
