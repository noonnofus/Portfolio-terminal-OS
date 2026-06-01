## Git & Workflow (Solo Developer)
- **Branch Naming Convention**: 1인 개발 프로젝트의 특성에 맞춰 Jira 티켓 번호 없이 `[분류]/[짧은-설명(kebab-case)]` 패턴을 엄격히 준수합니다.
  - `feat/`: 새로운 기능 추가 (예: `feat/dark-mode`)
  - `fix/`: 버그 수정 (예: `fix/terminal-crash`)
  - `refactor/`: 기능 변화 없는 코드 구조 개선 (예: `refactor/fsd-architecture`)
  - `chore/`: 패키지 업데이트, 설정 파일 수정 등 (예: `chore/update-nextjs`)
  - `docs/`: 문서 수정
- **Human-like & One-line**: 브랜치 이름과 커밋 메시지는 AI가 생성한 기계적인 느낌을 배제하고, **실제 개발자(사람)가 평소에 쓰는 것처럼 자연스럽고 직관적인 단어**로 작성합니다. 또한, 장황한 본문 설명 없이 **커밋 메시지는 항상 한 줄(One-line)로 간결하게** 작성합니다.
- **No Commits to Main**: 대규모 리팩토링이나 새로운 기능 작업 시, 항상 `main` 브랜치에서 새로운 브랜치를 따서 작업하고 검증이 끝난 후 병합(Merge)합니다.