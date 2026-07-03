# Index (index-pwa)

일상, 문화생활, 소비, 미식, 여행, 독서, 영화 감상을 달력 중심으로 기록하는 개인 라이프로그 PWA입니다.

React + Vite + TypeScript + Tailwind CSS 기반입니다.

- **Phase 1**: 메인 화면(달력)의 틀과 디자인 시스템
- **Phase 2**: 글쓰기 화면(EntryEditorModal), 카테고리별 입력, 사진 첨부 UI, localStorage 기반 임시 저장
- **Phase 3**: localForage(IndexedDB) 기반 정식 로컬 저장 — 기록과 사진이 새로고침/오프라인에서도 유지됨
- **Phase 4**: 검색/카테고리 필터/정렬, 기록 상세보기, 기록 수정, 기록 삭제

## 기술 스택

- React / TypeScript / Vite
- Tailwind CSS v4
- PWA (`vite-plugin-pwa`)
- **localForage(IndexedDB)** — 기록(Entry)과 사진(Blob) 로컬 저장
- (예정) Firebase Auth / Firestore / Storage — 계정 및 백업
- (예정) Capacitor — iOS 앱 패키징 및 App Store 제출

## Windows에서 실행하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

빌드 확인:

```bash
npm run build
```

## iPad Safari에서 로컬 개발 서버 접속하기

Windows PC와 iPad가 **같은 Wi-Fi**에 연결되어 있어야 합니다.

1. 개발 서버를 네트워크에 노출시켜 실행합니다.

   ```bash
   npm run dev -- --host 0.0.0.0
   ```

2. 터미널에 출력되는 `Network` 주소를 확인합니다. (예: `http://192.168.0.165:5173/`)
3. iPad Safari 주소창에 위 Network 주소를 그대로 입력해 접속합니다.
4. 홈 화면에 추가하면(공유 → 홈 화면에 추가) `standalone` 모드로 앱처럼 실행되는지 확인할 수 있습니다.

> Windows 방화벽에서 Node.js의 사설 네트워크 접근을 허용해야 iPad에서 접속이 될 수 있습니다.

## Phase 2 확인 방법 (글쓰기 & 사진 첨부)

1. `npm run dev -- --host 0.0.0.0`로 서버를 켜고 iPad Safari에서 Network 주소로 접속합니다.
2. Home 화면 우측 하단의 핑크색 **+ 글쓰기 버튼**을 누르면 하단에서 EntryEditorModal이 올라오는지 확인합니다.
3. 상단 **카테고리** chip을 가로로 스크롤하며 각 카테고리(마음 일기/영화감상/독서록/여행일지/내돈내산/푸드로그)를 선택했을 때, 카테고리별 추가 입력 영역이 바뀌는지 확인합니다.
4. **사진 추가** 버튼을 눌러 여러 장의 사진을 한 번에 선택하고, 미리보기 썸네일과 "선택한 사진 N장" 문구가 표시되는지 확인합니다.
5. 썸네일의 ✕ 버튼으로 사진을 개별 삭제할 수 있는지 확인합니다.
6. **저장** 버튼을 누르면 모달이 닫히고, 선택했던 날짜의 기록 피드에 방금 작성한 카드(카테고리 이모지/제목/본문 미리보기/사진 썸네일/별점·가격·기분 점수 등)가 바로 나타나는지 확인합니다.
7. 달력으로 스크롤을 올려, 저장한 날짜의 셀에 해당 카테고리 이모지가 표시되는지 확인합니다.

## Phase 3 확인 방법 (localForage/IndexedDB 저장)

1. `npm install` 후 `npm run dev -- --host 0.0.0.0`로 서버를 켜고 iPad Safari에서 Network 주소로 접속합니다.
2. 글쓰기 버튼으로 기록을 하나 작성하고, **사진도 1장 이상** 첨부한 뒤 저장합니다.
3. 선택 날짜 피드에 방금 쓴 카드와 사진 썸네일이 보이는지 확인합니다.
4. **페이지를 새로고침**합니다. 새로고침 후에도 같은 날짜에 기록과 사진 썸네일이 그대로 남아 있는지 확인합니다. (Phase 2와 달리 사진도 깨지지 않아야 합니다.)
5. Safari를 완전히 종료했다가 다시 열어도(홈 화면 앱으로 추가한 경우 앱을 껐다 켜도) 기록이 유지되는지 확인합니다.
6. 기기를 **비행기 모드**로 전환한 뒤에도 기존 기록 조회, 새 기록 작성/사진 첨부/저장이 정상 동작하는지 확인합니다(오프라인 동작 확인).
7. 사진을 11장 이상 선택해 보고 "사진은 최대 10장까지 첨부할 수 있어요." 안내가 뜨는지 확인합니다.
8. 사진 선택 대화상자에서 **취소**를 눌러도 오류 없이 그대로 유지되는지 확인합니다.
9. Settings 탭 → **전체 삭제** 버튼을 눌러 확인 대화상자에서 확인을 누르고, Home 탭으로 돌아왔을 때 모든 날짜의 기록/아이콘이 사라졌는지 확인합니다.

### 알려진 제약 (Phase 3 시점)

- 사진은 저장 시 긴 변 1600px, JPEG 품질 0.8 정도로 리사이즈/압축되어 저장됩니다. 원본 화질이 아닙니다.
- 기록 수정/삭제 UI는 아직 없습니다(저장소 레이어는 준비되어 있으나 화면에서 연결되지 않았습니다).
- 검색, 통계는 아직 placeholder 화면입니다.

## Phase 4 확인 방법 (검색/필터/정렬/상세/수정/삭제)

1. `npm run dev -- --host 0.0.0.0`로 서버를 켜고 iPad Safari에서 Network 주소로 접속합니다.
2. Home 화면에서 카테고리가 서로 다른 기록을 3~5개 작성합니다(영화감상/독서록/여행일지/내돈내산/푸드로그 등을 섞어서). 별점, 가격, 기분 점수, 사진도 일부 포함해봅니다.
3. **Search 탭**으로 이동해 검색어를 입력하지 않은 상태에서 방금 작성한 기록이 최신순으로 모두 보이는지 확인합니다.
4. 검색창에 제목/본문/장소명/식당명 등에 포함된 단어를 입력해, 입력할 때마다 즉시 결과가 좁혀지고 "총 N개의 기록" 문구가 갱신되는지 확인합니다. 아무 기록과도 매치되지 않는 단어를 입력해 빈 상태 화면이 뜨는지도 확인합니다.
5. 카테고리 chip(전체/마음 일기/영화감상/독서록/여행일지/내돈내산/푸드로그)을 눌러 필터링되는지, 검색어와 동시에 적용되는지 확인합니다.
6. 정렬 chip(최신순/오래된순/별점 높은순/가격 높은순/기분 점수 높은순)을 하나씩 눌러 순서가 바뀌는지 확인합니다. 해당 값이 없는 기록은 자연스럽게 뒤로 밀리는지 확인합니다.
7. Home 또는 Search의 **기록 카드**를 눌러 상세 화면(EntryDetailModal)이 열리는지 확인합니다. 카테고리 이모지/이름, 날짜, 제목, 본문, 카테고리별 세부 정보(별점/가격/기분 점수 등), 사진이 있다면 가로 스크롤 갤러리가 보이는지 확인합니다.
8. 상세 화면에서 **수정** 버튼을 눌러 EntryEditorModal이 기존 값으로 미리 채워진 채 열리는지 확인합니다. 일부 값을 바꾸고 **수정 완료**를 누른 뒤, 상세 화면과 Home/Search 목록에 변경사항이 바로 반영되는지 확인합니다.
9. 상세 화면에서 **삭제** 버튼을 눌러 확인창이 뜨는지, 확인을 누르면 기록과 사진이 삭제되고 Home 달력 아이콘 및 Search 결과에서도 사라지는지 확인합니다.
10. Settings 탭 → **전체 삭제** 후 Home 달력에 남은 표시가 없는지, Search에 "아직 작성한 기록이 없어요" 빈 상태가 뜨는지 확인합니다.
11. **새로고침**한 뒤에도 마지막으로 저장/수정한 상태 그대로 데이터가 남아있는지 확인합니다.

## 폴더 구조

```
src/
  app/                 앱 전체 조립(AppShell, 탭 라우팅)
  components/common/   버튼, 카드, 별점, EntryCard 등 공통 UI 컴포넌트
  features/calendar/    HomeCalendarPage, DayEntryFeed 등 달력 관련 컴포넌트
  features/editor/      EntryEditorModal(작성/수정 겸용), EntryDetailModal, PhotoPicker, 카테고리별 입력/상세 필드
  features/navigation/  하단 탭 네비게이션
  features/search/       SearchPage, 카테고리 필터 chip, 정렬 chip
  features/statistics/   통계 placeholder
  features/settings/     설정(전체 삭제 포함)
  hooks/                 useEntries, useEntryWorkspace, usePhotoUrls — 목록 조회/갱신, 상세·수정·삭제 흐름 공통화
  models/               Entry, EntryCategory, PhotoMeta 등 데이터 모델
  services/             localDatabase.ts — localForage 인스턴스/스토어 관리, 공통 에러 처리
  repositories/         entryRepository, photoRepository — localForage(IndexedDB) 기반 저장소
  styles/               Tailwind 테마 토큰
  utils/                날짜 계산(date.ts), 검색/필터/정렬(searchUtils.ts), 이미지 리사이즈/압축 유틸리티
```

## 앞으로의 계획

- **월간 통계/대시보드 (Phase 5)**: `entryRepository.getAllEntries()`와 `utils/searchUtils.ts`의 필터·정렬
  로직을 재사용해 월별 카테고리 분포, 소비 합계, 평균 기분 점수 등을 `StatisticsPage`에서 시각화.
- **Firebase 백업**: Firebase Auth로 로그인, Firestore에 기록 동기화(`Entry`는 이미 JSON 직렬화 가능한
  plain object), Storage에 사진 업로드 후 `Entry.photoUrls`에 채우는 방식으로 확장.
- **Capacitor 패키징**: 이 PWA를 Capacitor로 감싸 iOS 네이티브 앱 형태로 빌드.
- **App Store 제출 후 Unlisted App 배포**: 심사 통과 후 비공개 링크로만 배포되는 Unlisted App으로 전환 예정.

## 이번 단계(Phase 4)에서 구현하지 않은 것

- 통계/대시보드 실제 로직(placeholder 화면 그대로)
- 사진 원본 보존(항상 리사이즈/JPEG 압축됨), 다중 해상도 저장
- Firebase 연동, Capacitor 연동
- 여러 기록을 한 번에 선택해 삭제하는 다중 선택 UI
