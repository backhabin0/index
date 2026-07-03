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

  // 카테고리별 추가 필드 (Entry 하나에서 optional field로 관리, category별 모델 분리는 하지 않음)
  subtitle?: string;
  directorOrCast?: string; // movie: 감독/출연진
  oneLineReview?: string; // movie: 한줄평
  quote?: string; // movie: 명대사 / book: 인상 깊은 구절
  authorOrPublisher?: string; // book: 저자/출판사
  readingStatus?: "reading" | "completed"; // book: 읽는 중 / 완독
  companions?: string[]; // travel: 동행인
  purchasePlace?: string; // purchase: 구매처
  satisfaction?: string; // purchase: 만족도
  purchaseCategory?: string; // purchase: 소비 카테고리
  mealType?: string; // food: 식사 종류
  foodType?: string; // food: 외식/집밥/배달 구분
  restaurantName?: string; // food: 식당명

  // photoLocalIds: localForage(IndexedDB) "photos" store에 리사이즈된 Blob으로 저장된
  //   사진의 참조 id 목록. 실제 Blob은 photoRepository.getPhoto(id)로 불러온다.
  photoLocalIds?: string[];
  // photoUrls: Firebase Storage 업로드 후 반환되는 다운로드 URL 또는 Storage path 목록.
  //   Firebase 연결 이후 photoLocalIds 대신/함께 사용 예정.
  photoUrls?: string[];

  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
