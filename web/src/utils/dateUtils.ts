export function parseDateSafely(val: any): Date | null {
  if (!val) return null;
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'string') {
    const num = Number(val);
    if (!isNaN(num) && val.length >= 12 && !val.includes('-')) {
      const d = new Date(num);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (val && typeof val.toDate === 'function') {
    const d = val.toDate();
    return isNaN(d.getTime()) ? null : d;
  }
  if (val && typeof val.seconds === 'number') {
    const d = new Date(val.seconds * 1000);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function formatDate(dateVal: any): string {
  if (!dateVal) return 'N/A';
  try {
    const d = parseDateSafely(dateVal);
    if (!d) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return 'N/A';
  }
}

export function formatTimeAgo(dateVal: any): string {
  if (!dateVal) return 'Just now';
  try {
    const d = parseDateSafely(dateVal);
    if (!d) return 'Just now';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 30) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateVal);
  } catch {
    return 'Just now';
  }
}

export function formatTimeOnly(dateVal: any): string {
  if (!dateVal) return '';
  try {
    const d = parseDateSafely(dateVal);
    if (!d) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(d);
  } catch {
    return '';
  }
}
