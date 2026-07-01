export default function FloatingWriteButton() {
  const handleClick = () => {
    // TODO: 추후 EntryEditorModal로 연결하여 실제 글쓰기 화면을 띄울 예정.
    alert("글쓰기 화면은 다음 단계에서 연결될 예정이에요.");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="새 기록 작성"
      className="fixed right-5 bottom-[calc(env(safe-area-inset-bottom)+84px)] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-2xl text-white shadow-[var(--shadow-soft)] transition active:scale-95"
    >
      <span aria-hidden>+</span>
    </button>
  );
}
