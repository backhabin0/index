import { useEffect, useState } from "react";
import { CATEGORY_ICONS } from "../../models/category";
import type { Entry } from "../../models/entry";
import { photoRepository } from "../../repositories/photoRepository";
import { blobToObjectUrl } from "../../utils/imageUtils";

function getMetaText(entry: Entry): string | undefined {
  switch (entry.category) {
    case "mood":
      return entry.moodScore != null ? `기분 ${entry.moodScore}/10` : undefined;
    case "movie":
    case "book":
    case "food":
      return entry.rating != null ? `★ ${entry.rating}/5` : undefined;
    case "purchase":
      return entry.price != null ? `${entry.price.toLocaleString()}원` : undefined;
    case "travel":
      return entry.locationName;
    default:
      return undefined;
  }
}

/** photoLocalIds의 첫 번째 사진을 저장소에서 불러와 미리보기 URL로 변환한다. */
function useThumbnailUrl(photoId: string | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!photoId) {
      setUrl(null);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    photoRepository.getPhoto(photoId).then((photo) => {
      if (cancelled || !photo) return;
      objectUrl = blobToObjectUrl(photo.blob);
      setUrl(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photoId]);

  return url;
}

interface EntryCardProps {
  entry: Entry;
  onClick?: () => void;
}

const cardClassName =
  "flex w-full gap-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left shadow-[var(--shadow-soft)] transition active:scale-[0.98]";

export default function EntryCard({ entry, onClick }: EntryCardProps) {
  const meta = getMetaText(entry);
  const thumbnailUrl = useThumbnailUrl(entry.photoLocalIds?.[0]);

  const content = (
    <>
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span aria-hidden>{CATEGORY_ICONS[entry.category]}</span>
            <p className="truncate text-sm font-semibold text-[var(--color-ink)]">{entry.title}</p>
          </div>
          <span className="shrink-0 text-[11px] text-[var(--color-ink-muted)]">{entry.date}</span>
        </div>
        {entry.body && (
          <p className="line-clamp-2 text-sm text-[var(--color-ink-muted)]">{entry.body}</p>
        )}
        {meta && <p className="text-xs text-[var(--color-accent-strong)]">{meta}</p>}
      </div>
    </>
  );

  if (!onClick) {
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    <button type="button" onClick={onClick} className={cardClassName}>
      {content}
    </button>
  );
}
