// 라이프로그 기록의 카테고리 종류
export type EntryCategory =
  | "mood" // 마음 일기
  | "movie" // 영화감상
  | "book" // 독서록
  | "travel" // 여행일지
  | "purchase" // 내돈내산
  | "food"; // 푸드로그

export interface Entry {
  id: string;
  date: string; // YYYY-MM-DD
  category: EntryCategory;
  title: string;
  body: string;
  moodScore?: number;
  rating?: number;
  price?: number;
  locationName?: string;
  tags?: string[];

  // 사진 관련 필드 (이번 단계에서는 UI 미구현, 데이터 모델만 준비)
  // photoLocalIds: IndexedDB/localForage에 Blob 또는 압축 이미지로 저장된 로컬 사진의 참조 id 목록.
  //   추후 input type="file" accept="image/*" multiple 로 선택한 사진을 로컬에 저장할 때 사용 예정.
  photoLocalIds?: string[];
  // photoUrls: Firebase Storage 업로드 후 반환되는 다운로드 URL 또는 Storage path 목록.
  //   Firebase 연결 이후 photoLocalIds 대신/함께 사용 예정.
  photoUrls?: string[];

  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
