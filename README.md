# Index (index-pwa)

일상, 문화생활, 소비, 미식, 여행, 독서, 영화 감상을 달력 중심으로 기록하는 개인 라이프로그 PWA입니다.

React + Vite + TypeScript + Tailwind CSS 기반이며, 이번 단계(Phase 1)는 저장 기능 없이
메인 화면(달력)의 틀과 디자인 시스템만 구현되어 있습니다.

## 기술 스택

- React / TypeScript / Vite
- Tailwind CSS v4
- PWA (`vite-plugin-pwa`)
- (예정) localForage 또는 IndexedDB — 로컬 저장
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

## 폴더 구조

```
src/
  app/                 앱 전체 조립(AppShell, 탭 라우팅)
  components/common/   버튼, 카드 등 공통 UI 컴포넌트
  features/calendar/    HomeCalendarPage 및 달력 관련 컴포넌트
  features/navigation/  하단 탭 네비게이션
  features/search/       검색 placeholder
  features/statistics/   통계 placeholder
  features/settings/     설정 placeholder
  models/               Entry, EntryCategory 등 데이터 모델
  services/             (예정) Firebase 등 외부 서비스 연동 레이어
  repositories/         (예정) IndexedDB/Firestore 저장소 레이어
  styles/               Tailwind 테마 토큰
  utils/                날짜 계산 등 유틸리티
```

## 앞으로의 계획 (아직 미구현)

- **사진 첨부**: `input type="file" accept="image/*" multiple`로 선택한 사진을 IndexedDB/localForage에
  Blob 또는 압축 이미지로 저장. `Entry.photoLocalIds`, `Entry.photoUrls` 필드는 이를 위해 미리 준비되어 있습니다.
- **Firebase 백업**: Firebase Auth로 로그인, Firestore에 기록 동기화, Storage에 사진 업로드.
- **Capacitor 패키징**: 이 PWA를 Capacitor로 감싸 iOS 네이티브 앱 형태로 빌드.
- **App Store 제출 후 Unlisted App 배포**: 심사 통과 후 비공개 링크로만 배포되는 Unlisted App으로 전환 예정.

## 이번 단계(Phase 1)에서 구현하지 않은 것

- 글쓰기 저장, 기록 수정/삭제
- 사진 첨부 UI
- Firebase 연동
- 검색, 통계 실제 로직
