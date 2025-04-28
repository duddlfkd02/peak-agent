# PEAK Agent

## 1. 프로젝트 개요

- 프로젝트명 : Peak A2A
- 주요 기능 : AI 에이전트를 이용하여 기업 정보를 자동으로 수집, 요약, 질문 생성, 추천까지 제공하는 B2B 서비스입니다.

<br>

## 2. 사용 기술 스택

- Next.js 14 (app router)
- TypeScript
- CSS : Tailwind CSS 3.4 / Shadcn UI
- 다이어그램 라이브러리 : Plotly (Sankey Diagram 제작 시 사용)
- 상태관리 : Zustand
- API 통신 : `fetch` 사용
- 기타 도구 : Docker , Pretteir, Eslint, react-markdown, splinetool

<br>

## 3. 설치 라이브러리 목록 (package.json)

| **라이브러리**                                                                     | **설명**                                       |
| ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| **next**                                                                           | Next.js 14 버전, App Router 기반 프레임워크    |
| **react / react-dom**                                                              | 리액트 기본 라이브러리                         |
| **tailwindcss**                                                                    | 유틸리티 퍼스트 CSS 프레임워크                 |
| **shadcn-ui** (구성 요소: @radix-ui/react-slot, class-variance-authority, clsx 등) | UI 컴포넌트 세트                               |
| **@tailwindcss/typography**                                                        | Tailwind용 텍스트 스타일링 플러그인            |
| **tailwind-merge**                                                                 | Tailwind 클래스 병합 처리해주는 유틸리티       |
| **zustand**                                                                        | 전역 상태 관리 라이브러리                      |
| **lucide-react**                                                                   | React용 아이콘 라이브러리                      |
| **plotly.js / react-plotly.js**                                                    | Sankey 다이어그램 생성용 라이브러리            |
| **react-markdown**                                                                 | 마크다운 형식의 텍스트를 React 컴포넌트로 변환 |
| **@splinetool/react-spline / @splinetool/runtime**                                 | 3D 인터랙티브 디자인 (Spline) 컴포넌트 추가용  |

⭐️ `splinetool`은 설치하였으나 이미지 적용에 문제가 있어 컴포넌트(`AgentSymbol.tsx`)만 생성하였고 실제 적용은 하지 않았습니다.

## 4. 폴더/파일 구조

<details>
  <summary><b>🗂️ src 폴더 구조</b></summary>

    src
     ┣ app
     ┃ ┣ admin
     ┃ ┃ ┗ page.tsx
     ┃ ┣ agent
     ┃ ┃ ┗ page.tsx
     ┃ ┣ favicon.ico
     ┃ ┣ globals.css
     ┃ ┣ layout.tsx
     ┃ ┗ page.tsx
     ┣ components
     ┃ ┣ admin
     ┃ ┃ ┣ AdminPage.tsx
     ┃ ┃ ┣ AdminResultSection.tsx
     ┃ ┃ ┣ AiChatSection.tsx
     ┃ ┃ ┣ LeadsList.tsx
     ┃ ┃ ┗ SankeyChart.tsx
     ┃ ┣ agent
     ┃ ┃ ┣ AgentChatSection.tsx
     ┃ ┃ ┣ AgentDataSection.tsx
     ┃ ┃ ┣ AgentPage.tsx
     ┃ ┃ ┗ AgentToolSection.tsx
     ┃ ┣ common
     ┃ ┃ ┣ AgentSymbol.tsx
     ┃ ┃ ┣ LoadingSpinner.tsx
     ┃ ┃ ┗ SkeletonLoader.tsx
     ┃ ┣ ui
     ┃ ┃ ┣ button.tsx
     ┃ ┃ ┣ input.tsx
     ┃ ┃ ┗ textarea.tsx
     ┃ ┗ Header.tsx
     ┣ lib
     ┃ ┣ api
     ┃ ┃ ┣ adminAPI.ts
     ┃ ┃ ┗ visitorsAPI.ts
     ┃ ┣ companyIntro.ts
     ┃ ┣ makePopupHtml.ts
     ┃ ┗ utils.ts
     ┣ store
     ┃ ┣ useAdminStore.ts
     ┃ ┗ useVisitorStore.ts
     ┣ types
     ┃ ┣ admin.ts
     ┃ ┣ react-plotlu.d.ts
     ┃ ┗ visitor.ts

</details>

<br>

- `components`: 페이지별 컴포넌트, 공통 컴포넌트, UI 요소 구성
- `lib`: API 통신 모듈 및 공통 유틸리티 함수
- `store`: Zustand 기반 글로벌 상태 관리
- `types`: 프로젝트 전용 TypeScript 타입 선언

 <br>

## 5. 주요 컴포넌트 및 API

### 5-1. 주요 컴포넌트

| **컴포넌트명**     | **설명**                                            |
| ------------------ | --------------------------------------------------- |
| Header             | 전체 페이지에 공통으로 사용되는 헤더 컴포넌트       |
| AgentPage          | 에이전트 페이지 메인 컴포넌트                       |
| AdminPage          | 어드민 페이지 메인 컴포넌트                         |
| AiChatSection      | 어드민 페이지에서 AI 채팅 섹션 구성                 |
| LeadsList          | 추천 기업 리스트 표 형태로 구성                     |
| AdminResultSection | 에이전트 대화 pdf요약 팝업, 마크다운 기반 요약 생성 |
| AgentChatSection   | 에이전트 페이지에서 채팅 인터페이스 제공            |

### 5-2. 주요 API

| **API 파일명** | **설명**                                                 |
| -------------- | -------------------------------------------------------- |
| adminAPI.ts    | 어드민 관련 데이터 (리드, AI 답변 등) API 통신 함수 모음 |
| visitorsAPI.ts | 방문자 관련 데이터 (사이트 분석 등) API 통신 함수 모음   |
