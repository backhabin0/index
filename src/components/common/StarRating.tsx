interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export default function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n}점`}
          onClick={() => onChange(n)}
          className={`text-xl leading-none ${
            n <= value ? "text-[var(--color-accent-strong)]" : "text-[var(--color-border)]"
          }`}
        >
          {n <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
