import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { photoRepository } from "../../repositories/photoRepository";
import { blobToObjectUrl } from "../../utils/imageUtils";

const DEFAULT_MAX_PHOTOS = 10;

/** photoIds에 대응하는 미리보기 objectURL을 불러오고, 사라진 id의 URL은 즉시 해제한다. */
function usePhotoPreviews(photoIds: string[]): Record<string, string> {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const urlsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    const currentIds = new Set(photoIds);

    for (const [id, url] of Object.entries(urlsRef.current)) {
      if (!currentIds.has(id)) {
        URL.revokeObjectURL(url);
        delete urlsRef.current[id];
      }
    }

    const missingIds = photoIds.filter((id) => !urlsRef.current[id]);
    if (missingIds.length === 0) {
      setPreviews({ ...urlsRef.current });
      return;
    }

    Promise.all(
      missingIds.map(async (id) => {
        const photo = await photoRepository.getPhoto(id);
        if (photo) {
          urlsRef.current[id] = blobToObjectUrl(photo.blob);
        }
      }),
    ).then(() => {
      if (!cancelled) {
        setPreviews({ ...urlsRef.current });
      }
    });

    return () => {
      cancelled = true;
    };
    // photoIds 배열은 매 렌더마다 새로 생성될 수 있으므로 내용 기반 키로 비교한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoIds.join(",")]);

  useEffect(() => {
    return () => {
      // 언마운트 시점까지 누적된 최신 목록을 정리해야 하므로 ref를 그대로 참조한다.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(urlsRef.current).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return previews;
}

interface PhotoPickerProps {
  photoIds: string[];
  onAddIds: (ids: string[]) => void;
  onRemoveId: (id: string) => void;
  maxPhotos?: number;
}

export default function PhotoPicker({
  photoIds,
  onAddIds,
  onRemoveId,
  maxPhotos = DEFAULT_MAX_PHOTOS,
}: PhotoPickerProps) {
  const previews = usePhotoPreviews(photoIds);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // event.target.files는 input과 연결된 live FileList이므로, 배열로 복사해두지 않고
    // 아래에서 value를 초기화하면 이 목록까지 함께 비워져 버린다. 반드시 먼저 복사한다.
    const fileList = event.target.files ? Array.from(event.target.files) : [];
    // 같은 파일을 다시 선택할 수 있도록 입력값을 초기화한다.
    event.target.value = "";
    // iPad Safari에서 선택을 취소하면 파일이 없을 수 있으므로 조용히 종료한다.
    if (fileList.length === 0) return;

    setErrorMessage(null);

    const remainingSlots = maxPhotos - photoIds.length;
    if (remainingSlots <= 0) {
      setErrorMessage(`사진은 최대 ${maxPhotos}장까지 첨부할 수 있어요.`);
      return;
    }

    const filesToProcess = fileList.slice(0, remainingSlots);
    const skippedCount = fileList.length - filesToProcess.length;

    setIsSaving(true);
    const savedIds: string[] = [];
    const failedFileNames: string[] = [];

    for (const file of filesToProcess) {
      try {
        const meta = await photoRepository.savePhoto(file);
        savedIds.push(meta.id);
      } catch {
        failedFileNames.push(file.name);
      }
    }

    setIsSaving(false);
    if (savedIds.length > 0) {
      onAddIds(savedIds);
    }

    const messages: string[] = [];
    if (skippedCount > 0) {
      messages.push(`사진은 최대 ${maxPhotos}장까지 첨부할 수 있어요.`);
    }
    if (failedFileNames.length > 0) {
      messages.push(`${failedFileNames.join(", ")} 파일을 저장하지 못했어요.`);
    }
    if (messages.length > 0) {
      setErrorMessage(messages.join(" "));
    }
  };

  const handleRemove = (id: string) => {
    onRemoveId(id);
    photoRepository.deletePhoto(id).catch(() => {
      // 목록에서는 이미 제거했으므로, 저장소 삭제가 실패해도 UI는 그대로 둔다.
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* iPad Safari 호환: input type="file" accept="image/*" multiple 방식만 사용, 네이티브 API 의존 없음 */}
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink-muted)]">
        <span aria-hidden>📷</span>
        <span>{isSaving ? "사진 저장 중..." : "사진 추가"}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          disabled={isSaving}
          className="hidden"
        />
      </label>

      {errorMessage && (
        <p className="text-xs text-[var(--color-accent-strong)]">{errorMessage}</p>
      )}

      {photoIds.length > 0 && (
        <>
          <p className="text-xs text-[var(--color-ink-muted)]">
            선택한 사진 {photoIds.length}장 / 최대 {maxPhotos}장
          </p>
          <div className="flex flex-wrap gap-2">
            {photoIds.map((id) => (
              <div
                key={id}
                className="relative h-20 w-20 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-app-bg)]"
              >
                {previews[id] && (
                  <img src={previews[id]} alt="" className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(id)}
                  aria-label="사진 삭제"
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[10px] text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
