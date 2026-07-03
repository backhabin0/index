import type { ReactNode } from "react";
import type { Entry, EntryCategory } from "../../models/entry";
import { labelClass } from "./fieldStyles";

const TITLE_LABELS: Record<EntryCategory, string> = {
  mood: "제목",
  movie: "영화/콘텐츠 제목",
  book: "책 제목",
  travel: "여행 제목",
  purchase: "구매 물품명",
  food: "메뉴명",
};

export function getTitleLabel(category: EntryCategory): string {
  return TITLE_LABELS[category];
}

const READING_STATUS_LABELS: Record<string, string> = {
  reading: "읽는 중",
  completed: "완독",
};

function Stars({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="text-base text-[var(--color-accent-strong)]" aria-label={`${safeValue}점`}>
      {"★".repeat(safeValue)}
      {"☆".repeat(5 - safeValue)}
    </span>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={labelClass}>{label}</span>
      <div className="text-sm text-[var(--color-ink)]">{children}</div>
    </div>
  );
}

function TextRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return <DetailRow label={label}>{value}</DetailRow>;
}

interface EntryDetailFieldsProps {
  entry: Entry;
}

export default function EntryDetailFields({ entry }: EntryDetailFieldsProps) {
  const rows: ReactNode[] = [];

  switch (entry.category) {
    case "mood":
      if (entry.moodScore != null) {
        rows.push(
          <DetailRow key="mood" label="기분 점수">
            {entry.moodScore} / 10
          </DetailRow>,
        );
      }
      break;
    case "movie":
      rows.push(<TextRow key="director" label="감독/출연진" value={entry.directorOrCast} />);
      if (entry.rating != null) {
        rows.push(
          <DetailRow key="rating" label="별점">
            <Stars value={entry.rating} />
          </DetailRow>,
        );
      }
      rows.push(<TextRow key="review" label="한줄평" value={entry.oneLineReview} />);
      rows.push(<TextRow key="quote" label="명대사" value={entry.quote} />);
      break;
    case "book":
      rows.push(<TextRow key="author" label="저자/출판사" value={entry.authorOrPublisher} />);
      if (entry.readingStatus) {
        rows.push(
          <DetailRow key="status" label="읽는 상태">
            {READING_STATUS_LABELS[entry.readingStatus] ?? entry.readingStatus}
          </DetailRow>,
        );
      }
      if (entry.rating != null) {
        rows.push(
          <DetailRow key="rating" label="별점">
            <Stars value={entry.rating} />
          </DetailRow>,
        );
      }
      rows.push(<TextRow key="quote" label="인상 깊은 구절" value={entry.quote} />);
      break;
    case "travel":
      rows.push(<TextRow key="location" label="장소명" value={entry.locationName} />);
      if (entry.companions && entry.companions.length > 0) {
        rows.push(
          <DetailRow key="companions" label="동행인">
            <div className="flex flex-wrap gap-1.5">
              {entry.companions.map((companion) => (
                <span
                  key={companion}
                  className="rounded-full bg-[var(--color-lavender-soft)] px-2.5 py-1 text-xs text-[var(--color-ink)]"
                >
                  {companion}
                </span>
              ))}
            </div>
          </DetailRow>,
        );
      }
      break;
    case "purchase":
      if (entry.price != null) {
        rows.push(
          <DetailRow key="price" label="가격">
            {entry.price.toLocaleString()}원
          </DetailRow>,
        );
      }
      rows.push(<TextRow key="place" label="구매처" value={entry.purchasePlace} />);
      rows.push(<TextRow key="satisfaction" label="만족도" value={entry.satisfaction} />);
      rows.push(<TextRow key="category" label="소비 카테고리" value={entry.purchaseCategory} />);
      break;
    case "food":
      rows.push(<TextRow key="mealType" label="식사 종류" value={entry.mealType} />);
      rows.push(<TextRow key="foodType" label="구분" value={entry.foodType} />);
      rows.push(<TextRow key="restaurant" label="식당명" value={entry.restaurantName} />);
      if (entry.rating != null) {
        rows.push(
          <DetailRow key="rating" label="맛 별점">
            <Stars value={entry.rating} />
          </DetailRow>,
        );
      }
      break;
  }

  return <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-4">{rows}</div>;
}
