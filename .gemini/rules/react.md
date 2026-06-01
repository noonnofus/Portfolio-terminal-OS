## 1. React & Performance (React Compiler)
- **React Compiler Enabled**: 이 프로젝트는 React Compiler를 사용합니다.
- **Hook 사용 금지**: 성능 최적화를 위한 **`useCallback`과 `useMemo`의 사용을 금지**합니다. 
  - 컴파일러가 자동으로 메모이제이션을 수행하므로, 수동적인 최적화 코드는 코드 복잡성만 높입니다.
  - 단, 외부 라이브러리와의 참조 동일성(Identity Stability) 유지가 반드시 필요한 특수 케이스에 한해서만 주석과 함께 허용합니다.
