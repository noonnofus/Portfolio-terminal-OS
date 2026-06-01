## 6. State Management (Zustand)
- **Zustand Preferred**: 이 프로젝트는 Redux Toolkit을 폐기하고 **Zustand**를 전역 상태 관리 표준으로 사용합니다.
- **Store Colocation**: 상태(State)와 이를 변경하는 액션(Actions)은 하나의 스토어 파일 내에 공존시킵니다.
- **Selective Subscription**: 불필요한 리렌더링을 방지하기 위해 `useStore(state => state.value)` 와 같이 필요한 상태만 선택적으로 구독해야 합니다.
- **No Global Provider**: Zustand는 별도의 Context Provider가 필요 없으므로, `app/layout.tsx` 등에서 불필요한 Wrapper를 제거합니다.
- **Naming**: 스토어 훅은 `use[Domain]Store` 형식을 사용합니다 (예: `useDesktopStore`).
