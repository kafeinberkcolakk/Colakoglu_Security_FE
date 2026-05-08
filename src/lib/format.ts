const KIBIBYTE = 1024;
const MEBIBYTE = KIBIBYTE * KIBIBYTE;

export function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString();
}

export function formatBytes(bytes: number): string {
  if (bytes < KIBIBYTE) {
    return `${bytes} B`;
  }
  if (bytes < MEBIBYTE) {
    return `${(bytes / KIBIBYTE).toFixed(1)} KiB`;
  }
  return `${(bytes / MEBIBYTE).toFixed(1)} MiB`;
}

export interface RelativeTimeLabels {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function formatRelative(
  value: string,
  labels: RelativeTimeLabels,
): string {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    return value;
  }
  const diff = Date.now() - parsed;
  if (diff < MINUTE_MS) {
    return labels.seconds.replace(
      "{count}",
      String(Math.floor(diff / SECOND_MS)),
    );
  }
  if (diff < HOUR_MS) {
    return labels.minutes.replace(
      "{count}",
      String(Math.floor(diff / MINUTE_MS)),
    );
  }
  if (diff < DAY_MS) {
    return labels.hours.replace("{count}", String(Math.floor(diff / HOUR_MS)));
  }
  return labels.days.replace("{count}", String(Math.floor(diff / DAY_MS)));
}
