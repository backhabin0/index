interface FloatingWriteButtonProps {
  onClick: () => void;
}

export default function FloatingWriteButton({ onClick }: FloatingWriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="새 기록 작성"
      className="absolute right-5 bottom-[calc(env(safe-area-inset-bottom)+84px)] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-2xl text-white shadow-[var(--shadow-soft)] transition active:scale-95"
    >
      <span aria-hidden>+</span>
    </button>
  );
}
