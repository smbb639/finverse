import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const getMonthName = (monthNumber: number): string => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return format(date, 'MMMM');
};

export const generateDateRanges = () => {
  const today = new Date();
  
  return {
    today: {
      start: new Date(today.setHours(0, 0, 0, 0)),
      end: new Date(today.setHours(23, 59, 59, 999))
    },
    thisWeek: {
      start: new Date(today.setDate(today.getDate() - today.getDay())),
      end: new Date(today.setDate(today.getDate() - today.getDay() + 6))
    },
    thisMonth: {
      start: startOfMonth(today),
      end: endOfMonth(today)
    },
    lastMonth: {
      start: startOfMonth(subMonths(today, 1)),
      end: endOfMonth(subMonths(today, 1))
    },
    last6Months: {
      start: subMonths(today, 6),
      end: today
    },
    thisYear: {
      start: new Date(today.getFullYear(), 0, 1),
      end: today
    }
  };
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const getTrendDirection = (percentage: number): 'up' | 'down' | 'stable' => {
  if (percentage > 5) return 'up';
  if (percentage < -5) return 'down';
  return 'stable';
};