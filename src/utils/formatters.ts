/**
 * Indian Standard Formatting Utilities for Nexora University (Jaipur)
 * Enforces DD/MM/YYYY date formatting, Indian Standard Time (IST) labels, and INR (₹) currency.
 */

export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '—';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '—';
  }
}

export const formatDateIST = formatDate;

export function formatTimeIST(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '—';
    const timeStr = d.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${timeStr} IST`;
  } catch {
    return '—';
  }
}

export function formatDateTimeIST(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '—';
  return `${formatDate(dateInput)} at ${formatTimeIST(dateInput)}`;
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
