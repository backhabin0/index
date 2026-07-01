interface PlaceholderPageProps {
  icon: string;
  title: string;
  description: string;
}

export default function PlaceholderPage({ icon, title, description }: PlaceholderPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
      <span className="text-4xl">{icon}</span>
      <h2 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
      <p className="text-sm text-[var(--color-ink-muted)]">{description}</p>
    </div>
  );
}
