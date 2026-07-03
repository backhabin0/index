import { useEffect, useState } from "react";
import { photoRepository } from "../repositories/photoRepository";
import { blobToObjectUrl } from "../utils/imageUtils";

/** photoLocalIds 목록을 저장소에서 불러와 미리보기 objectURL 배열로 변환하고, 정리 시 해제한다. */
export function usePhotoUrls(photoIds: string[] | undefined): string[] {
  const key = (photoIds ?? []).join(",");
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const ids = key ? key.split(",") : [];
    if (ids.length === 0) {
      setUrls([]);
      return;
    }

    let cancelled = false;
    const createdUrls: string[] = [];

    Promise.all(ids.map((id) => photoRepository.getPhoto(id))).then((photos) => {
      if (cancelled) return;
      const next: string[] = [];
      for (const photo of photos) {
        if (photo) {
          const url = blobToObjectUrl(photo.blob);
          createdUrls.push(url);
          next.push(url);
        }
      }
      setUrls(next);
    });

    return () => {
      cancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
    // key는 photoIds 배열 내용을 문자열로 요약한 값이라 안전한 비교 기준으로 쓸 수 있다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return urls;
}
