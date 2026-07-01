interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <span className="text-3xl">🌿</span>
      <p className="text-[15px] font-medium text-[var(--color-ink)]">{title}</p>
      {description && (
        <p className="text-sm text-[var(--color-ink-muted)]">{description}</p>
      )}
    </div>
  );
}
