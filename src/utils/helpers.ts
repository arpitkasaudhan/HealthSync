import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';
import type { PatientStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function formatDate(iso: string): string {
  return format(new Date(iso), 'dd MMM yyyy');
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'dd MMM yyyy, HH:mm');
}

export function statusColor(status: PatientStatus): string {
  switch (status) {
    case 'Active':             return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'Critical':           return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'Discharged':         return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    case 'Under Observation':  return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  }
}

export function statusDot(status: PatientStatus): string {
  switch (status) {
    case 'Active':             return 'bg-emerald-400';
    case 'Critical':           return 'bg-red-400';
    case 'Discharged':         return 'bg-slate-400';
    case 'Under Observation':  return 'bg-amber-400';
  }
}

export function notificationColor(type: string): string {
  switch (type) {
    case 'critical': return 'text-red-400    bg-red-400/10    border-red-400/20';
    case 'warning':  return 'text-amber-400  bg-amber-400/10  border-amber-400/20';
    case 'success':  return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    default:         return 'text-blue-400   bg-blue-400/10   border-blue-400/20';
  }
}

export function avatarColor(initials: string): string {
  const colors = [
    'from-violet-600 to-purple-700',
    'from-cyan-600 to-blue-700',
    'from-emerald-600 to-teal-700',
    'from-rose-600 to-pink-700',
    'from-amber-600 to-orange-700',
    'from-indigo-600 to-blue-700',
  ];
  const index = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % colors.length;
  return colors[index];
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const header = keys.join(',');
  const rows = data.map(row =>
    keys.map(k => {
      const val = row[k];
      if (typeof val === 'object' && val !== null) return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val ?? '').replace(/"/g, '""')}"`;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
