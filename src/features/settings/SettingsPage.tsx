import { useState } from "react";
import Card from "../../components/common/Card";
import { entryRepository } from "../../repositories/entryRepository";
import { photoRepository } from "../../repositories/photoRepository";

export default function SettingsPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleDeleteAll = async () => {
    const confirmed = window.confirm("모든 기록과 사진을 삭제할까요? 이 작업은 되돌릴 수 없어요.");
    if (!confirmed) return;

    setIsDeleting(true);
    setMessage(null);
    try {
      await entryRepository.deleteAllEntries();
      await photoRepository.deleteAllPhotos();
      setMessage("모든 기록과 사진을 삭제했어요.");
    } catch {
      setMessage("삭제 중 문제가 발생했어요. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 px-5 pt-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-4xl">⚙️</span>
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">설정</h2>
        <p className="text-sm text-[var(--color-ink-muted)]">
          계정, 백업 등의 설정 기능은 다음 단계에서 준비할게요.
        </p>
      </div>

      <Card className="flex flex-col gap-3 p-4">
        <div>
          <p className="text-sm font-semibold text-[var(--color-ink)]">모든 데이터 삭제</p>
          <p className="text-xs text-[var(--color-ink-muted)]">
            기기에 저장된 모든 기록과 사진을 삭제해요.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={isDeleting}
          className="rounded-2xl border border-[var(--color-border)] py-2.5 text-sm font-semibold text-[var(--color-accent-strong)] disabled:opacity-60"
        >
          {isDeleting ? "삭제하는 중..." : "전체 삭제"}
        </button>
        {message && <p className="text-xs text-[var(--color-ink-muted)]">{message}</p>}
      </Card>
    </div>
  );
}
