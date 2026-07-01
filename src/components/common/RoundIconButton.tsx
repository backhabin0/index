import type { ButtonHTMLAttributes, ReactNode } from "react";

interface RoundIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function RoundIconButton({
  children,
  className = "",
  ...rest
}: RoundIconButtonProps) {
  return (
    <button
      type="button"
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-soft)] transition active:scale-95 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
