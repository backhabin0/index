export const inputClass =
  "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-app-bg)] px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

export const labelClass = "text-xs font-medium text-[var(--color-ink-muted)]";

export function pillClass(active: boolean): string {
  return `rounded-full border px-3.5 py-1.5 text-sm transition ${
    active
      ? "border-transparent bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]"
      : "border-[var(--color-border)] text-[var(--color-ink-muted)]"
  }`;
}
