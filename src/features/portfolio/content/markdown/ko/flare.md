---
title: Flare
stackLabel: 개발 스택
problemSolvingLabel: 주요 작업
summary: 캐나다 산불 위치, 위험 지표와 뉴스를 한곳에서 확인하는 팀 프로젝트입니다. 주요 풀스택 기능으로 산불 전용 AI 챗봇, 웹 푸시 알림과 모바일 및 데스크톱 PWA 설치 경험을 구현했습니다.
projectIntro:
  title: 프로젝트 개요
  description: |-
    팀 프로젝트에서 여러 출처의 산불 정보를 지도와 위험 지표, 관련 뉴스로 모았습니다. 이 탐색 흐름을 질문과 알림으로 이어가기 위해 OpenAI API 기반 산불 전용 챗봇과 Firebase 웹 푸시를 구현했습니다.

    Bing News API와 웹 크롤러로 수집한 뉴스를 연결하고, 모바일과 데스크톱에서 설치해 다시 접근할 수 있는 PWA 경험을 구성했습니다. 담당 범위는 챗봇, 알림과 설치 경험을 포함한 주요 풀스택 기능입니다.
projectContext:
  product:
    label: 제품
    description: 산불 정보 탐색과 관련 질문을 지원하는 설치 가능한 웹 애플리케이션
  users:
    label: 사용자
    description: 산불 위치, 위험 지표와 관련 뉴스를 한곳에서 확인하려는 지역 사용자
  role:
    label: 담당 범위
    description: PWA 설치 경험, 산불 전용 AI 챗봇, 웹 푸시 알림을 포함한 주요 풀스택 기능 설계 및 구현
walkthrough:
  title: 기능 시연
  description: 웹과 설치 환경의 주요 화면, 사용자 흐름을 확인합니다.
  unsupported: 브라우저가 비디오 재생을 지원하지 않습니다.
stack:
  - Next.js 15
  - TypeScript
  - Tailwind CSS
  - PostgreSQL
  - Drizzle ORM
  - OpenAI API
  - Google Maps
  - Firebase Cloud Messaging
  - PWA
---

<!-- case: informationFlow -->

## 산불 정보 탐색과 질문, 알림 연결

### 개요

팀의 지도와 뉴스 탐색 흐름에 산불 전용 챗봇, 웹 푸시와 PWA 설치를 연결하는 주요 풀스택 기능을 구현했습니다.

**정보 탐색 이후의 질문과 재접근** 산불 위치와 위험 지표, 관련 뉴스가 여러 경로에 흩어져 있어 사용자가 정보를 직접 조합해야 했습니다. 팀이 구성한 지도 중심 탐색을 질문과 알림, 반복 방문으로 이어가는 것이 제 담당 과제였습니다.

### 세부 내용

**산불 전용 AI 챗봇 연결** OpenAI API 기반 산불 전용 챗봇을 구현해 지도와 위험 지표, 관련 뉴스를 살펴본 뒤 질문할 수 있도록 탐색 흐름에 연결했습니다.

**웹 푸시와 PWA 설치** Firebase 웹 푸시 알림과 PWA 설치 경험을 구현했습니다. 모바일과 데스크톱에 웹 앱을 설치하고 알림을 통해 다시 접근할 수 있도록 구성했습니다.

### 성과

**탐색에서 질문과 알림까지 연결** 팀이 구축한 지도, 위험 지표와 뉴스에 제가 구현한 산불 질문, 알림과 설치 기능이 연결됐습니다. 사용자는 한 웹 애플리케이션에서 산불 정보를 확인하고 질문하거나 다시 접근할 수 있습니다.

<!-- walkthrough -->

[기능 시연 1](/videos/flare-walkthrough-web.mp4)

[기능 시연 2](/videos/flare-walkthrough-app.mp4)

<!-- /walkthrough -->
