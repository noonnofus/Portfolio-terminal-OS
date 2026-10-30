---
title: 포트폴리오
stackLabel: 개발 스택
problemSolvingLabel: 주요 작업
summary: 경력과 프로젝트를 터미널과 OS형 Desktop으로 탐색하는 개인 포트폴리오입니다. 기획부터 구현과 검증까지 맡아, 창과 폴더의 상호작용을 URL 탐색, 키보드 조작과 일관되게 연결했습니다.
projectContext:
  product:
    label: 제품
    description: 터미널과 OS형 Desktop으로 탐색하는 이중 언어 포트폴리오
  users:
    label: 사용자
    description: 경력과 기술적 판단을 빠르게 확인하려는 채용 담당자와 개발 면접관
  role:
    label: 담당 범위
    description: 기획, 디자인, 프론트엔드 구조, 접근성, 테스트와 콘텐츠 모델 전반
projectIntro:
  title: 프로젝트 개요
  description: |-
    채용 담당자는 경력과 성과를 빠르게 읽고, 개발 면접관은 프로젝트의 구현과 기술적 판단을 살펴볼 수 있도록 한국어/영어 포트폴리오를 만들었습니다. 터미널과 Desktop을 함께 제공하고, About과 Resume가 같은 경력과 프로젝트 데이터를 사용하도록 콘텐츠 모델을 구성했습니다. 언어, 배경화면과 Dock 설정은 새로고침 후에도 유지됩니다.

    창 관리와 브라우저 탐색은 Desktop이, 각 앱의 화면과 흐름은 feature가 담당합니다. 앱 ID, 로더, URL과 폴더 노드의 정합성은 타입과 구조 검사로 확인하고, 앱 열기, 창 경계, 종료 뒤 DOM 제거와 키보드 앱 전환은 Playwright로 검증합니다.
architecture:
  title: OS형 포트폴리오의 폴더와 실행 구조
  description: 라우트 진입점은 Desktop 실행 환경을 조립하고, Desktop shell은 창과 탐색을 관리하며, 각 feature는 독립된 앱 화면과 사용자 흐름을 담당합니다.
  alt: 라우트 진입점, Desktop shell, navigation, store, app catalog, dynamic loader, directory tree와 Portfolio, Terminal, Guestbook, Settings feature의 관계를 보여주는 포트폴리오 구조도
  caption: 정적 앱 정보, client 전용 로더, 폴더 트리, 브라우저 탐색을 역할별 파일로 나눠 앱을 추가해도 같은 실행 규칙을 유지합니다.
  loading: 구조도를 불러오는 중입니다.
  error: 구조도를 표시하지 못했습니다.
  scrollLabel: 포트폴리오 폴더와 실행 구조도, 가로로 스크롤할 수 있습니다.
  wide: true
stack:
  - Next.js 16
  - TypeScript
  - Zustand
  - i18next
  - Tailwind CSS
  - Supabase
  - TanStack Query
  - Playwright
  - Vitest
  - Vercel
---

<!-- architecture -->

```mermaid
flowchart TB
    route["app/desktop/page.tsx, route entry"] --> client["DesktopClient, composition"]
    client --> shell["DesktopShell, window, Dock, directory"]
    client --> store["DesktopStoreProvider, factory and Context"]
    client --> navigation["DesktopNavigationProvider, browser adapter"]
    navigation --> planner["planNavigation.ts, pure navigation plan"]
    navigation --> history["URL and History API"]
    shell --> catalog["appCatalog.ts, serializable app metadata"]
    catalog --> directory["directoryTree.ts, Desktop and Projects nodes"]
    shell --> renderer["DesktopAppRenderer, typed app props"]
    renderer --> loader["appLoaderRegistry.tsx, client dynamic loader"]
    loader --> portfolio["features/portfolio"]
    loader --> terminal["features/terminal"]
    loader --> guestbook["features/guestbook"]
    loader --> settings["features/settings"]
    store --> shell

    classDef route fill:#ffffff,stroke:#94a3b8,stroke-width:1.5px,color:#334155
    classDef shell fill:#e8f1ff,stroke:#2563eb,stroke-width:3px,color:#111827,font-weight:bold
    classDef contract fill:#f3f4f6,stroke:#6b7280,stroke-width:1.5px,color:#374151
    classDef feature fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d
    class route,client,history route
    class shell,store,navigation shell
    class planner,catalog,directory,renderer,loader contract
    class portfolio,terminal,guestbook,settings feature
```

<!-- /architecture -->

<!-- case: ownership -->

## Desktop과 앱 기능의 책임 분리

### 개요

창과 브라우저 탐색을 담당하는 Desktop과 각 앱의 제품 기능을 분리하고, 필요한 상태만 Adapter를 통해 전달하도록 설계했습니다.

**실행 환경과 앱 기능의 의존성** 창과 Dock을 관리하는 Desktop 안에 Terminal, Guestbook, Settings 등의 앱이 함께 동작합니다. 각 feature가 Desktop store를 직접 참조하면 앱 내부 변경과 실행 환경의 변경이 서로 얽히므로 의존성 경계가 필요했습니다.

### 세부 내용

**Adapter를 통한 상태와 동작 주입** src/app/desktop에는 DesktopShell, 창, Dock, directory, navigation, store를 두고 src/features에는 앱별 화면과 사용자 흐름을 뒀습니다. Terminal, Guestbook, Settings처럼 Desktop 상태가 필요한 앱은 Adapter가 값을 props로 주입해 feature가 Desktop store를 직접 import하지 않게 했습니다.

### 성과

**Desktop store 직접 참조 분리** Terminal, Guestbook, Settings는 Adapter에서 필요한 상태와 동작을 props로 전달받습니다. feature가 Desktop store를 직접 import하지 않는 구성으로 실행 환경과 앱 기능의 의존성 경계를 유지했습니다.

<!-- case: appContract -->

## 앱 등록과 URL 탐색 계약 정립

### 개요

새 앱을 추가할 때 Dock, 로더, 폴더와 공유 URL이 같은 앱을 가리키도록 앱 ID를 기준으로 연결하고, 누락을 타입과 구조 검사로 확인했습니다.

**여러 파일에 걸친 앱 등록 정보** 앱 실행에는 메타데이터, 동적 로더, 폴더 노드와 URL 처리가 함께 필요합니다. 한 곳의 등록이 누락되면 실행과 공유 URL이 어긋날 수 있어 이 관계를 코드와 테스트로 확인해야 했습니다.

### 세부 내용

**메타데이터, 로더와 탐색의 역할 분리** appCatalog.ts에는 서버에서도 읽을 수 있는 앱 메타데이터만, appLoaderRegistry.tsx에는 client 전용 dynamic import만 뒀습니다. directoryTree.ts는 catalog의 앱 ID를 참조하고, planNavigation.ts는 상태 변경과 URL 효과를 순수 함수로 계산한 뒤 DesktopNavigationProvider만 History API를 호출하게 했습니다.

### 성과

**앱 등록 정합성과 탐색 동작 검증** 앱의 정적 정보, 클라이언트 전용 로더, 폴더 노드와 브라우저 탐색 처리를 역할별 파일로 분리했습니다. 앱 ID와 props의 관계는 타입으로 확인하고, 앱 목록과 로더, URL, 폴더 노드와 다국어 제목 키의 정합성은 구조 검사와 단위 테스트로 확인합니다.

공유 URL 정규화, 사용자 탐색과 뒤로 가기가 같은 탐색 계획을 따르는지도 테스트합니다. 브라우저 이력이 바뀔 때 발생하는 popstate 이벤트가 Desktop 상태에 반영되는 과정도 검증 대상에 포함합니다.
