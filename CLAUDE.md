# fntimes/corporate - 한국금융신문 기업 페이지

## 프로젝트 개요
한국금융신문(fntimes.com)의 회사소개, 약관, 고객센터 등 기업 정보 페이지를 정적 사이트로 운영하는 프로젝트.

## 기술 스택
- **순수 정적 사이트**: HTML + CSS + JS (프레임워크 없음)
- **호스팅**: GitHub Pages (GitHub Actions 자동 배포)
- **커스텀 도메인**: `corporate.fntimes.com` (CNAME 설정 완료, DNS 미연결)
- **폰트**: Pretendard (CDN 사용) — GitHub Pages는 CSP 제약 없으므로 CDN이 유리 (레포 경량화, 캐싱 성능)

## 디렉토리 구조
```
corporate/
├── src/
│   ├── partials/           → 공통 HTML 파셜
│   │   ├── head.html       → doctype, meta, CSS 링크
│   │   ├── header.html     → GNB + 사이트맵 (active 클래스 자동 주입)
│   │   ├── mobile-nav.html → 모바일 내비게이션
│   │   ├── hero.html       → 히어로 배너 ({{heroTitle}})
│   │   ├── breadcrumb.html → breadcrumb ({{breadcrumbCategory}}, {{breadcrumbPage}})
│   │   ├── footer.html     → 푸터
│   │   └── scripts.html    → JS 로드 ({{extraScripts}})
│   └── pages/              → 페이지 템플릿 (front-matter + 본문)
│       ├── index.html      → / (이용약관)
│       └── subscribe.html  → /subscribe (구독신청)
├── css/
│   └── style.css           → 공통 CSS (모든 페이지 공유)
├── js/
│   └── main.js             → 공통 JS (메가메뉴, 모바일 nav, 폼)
├── images/                 → header_logo, footer_logo, 1992, bg
├── build.js                → 빌드 스크립트 (Node.js, 의존성 없음)
├── package.json            → npm run build
├── CNAME                   → 커스텀 도메인
├── dist/                   → 빌드 출력 (gitignore, GitHub Actions에서 생성)
└── .github/workflows/
    └── deploy.yml          → Node.js 빌드 → GitHub Pages 배포
```

## 빌드
- `npm run build` → `src/pages/`의 템플릿을 `src/partials/`와 조합하여 `dist/`에 출력
- 페이지 추가: `src/pages/`에 front-matter + 본문 HTML 파일 추가
- 헤더/푸터 수정: `src/partials/`의 해당 파일만 수정하면 전체 반영

## URL 규칙
- 폴더 기반 URL: `/about` → `about/index.html`
- 새 페이지 추가 시 폴더 생성 후 `index.html` 배치
- 내부 링크는 절대경로 사용: `href="/subscribe"`, `href="/"`
- 하위 폴더 페이지의 정적 리소스는 상대경로: `../css/style.css`, `../images/...`

## GNB 메뉴 구조 (전체 페이지 목록)
현재 이용약관, 구독신청만 구현됨. `#` 링크는 미구현 페이지.

1. **회사소개**: 회사개요, 인사말, 경영진, 회사연혁, 조직도, 비전, 기업이념, 오시는 길
2. **편집 및 윤리강령**: 편집규약, 언론윤리헌장, 취재보도준칙 윤리강령, 인터넷신문 윤리강령, 심의규정, 윤리 실천 노력
3. **고충처리**: 고충처리 제도, 고충처리 운영 규정
4. **독자위원회**: 독자위원회 규칙, 활동 내용(기사)
5. **고객센터**: 기사제보, 구독신청, 광고문의, 불편신고, 독자투고, 제휴문의, 저작권문의
6. **약관 및 정책**: 이용약관, 개인정보처리방침, 청소년보호정책, 저작권보호정책, 이메일무단수집거부

## 외부 연동 (예정)
- **구독 폼 → Google Sheets**: Google Apps Script 웹앱으로 fetch 전송
- **우편번호 API**: 다음 우편번호 API (클라이언트 JS)
- **지도 API**: 카카오맵 또는 네이버맵 JS SDK (회사소개 - 오시는 길)

## Git 설정
- **레포**: `fntimes/corporate` (public)
- **계정**: user.name=`fntimes`, user.email=`swc@fntimes.com` (로컬 설정)
- **인증**: 글로벌 credential store (`~/.git-credentials`)에 fntimes PAT 저장됨

## 관련 프로젝트
- `fntimes/docs`: summit 페이지 호스팅용 public 레포 (별개)

## 주의사항
- 외부 CDN 사용 가능 (GitHub Pages는 CSP 제약 없음). summit 프로젝트와 다름 — summit은 발주사 서버의 CSP 정책(`default-src 'self'`) 때문에 로컬 폰트/CSS 분리가 필요했음.
- header/footer/nav가 모든 페이지에 중복됨 → 페이지 추가 시 공통 부분 동기화 필요
