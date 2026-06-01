## 4. Terminal Implementation
- **Memory Safety**: `xterm.js` 인스턴스는 반드시 `useTerminal` 훅을 통해 생명주기를 관리하며, 언마운트 시 `dispose()` 처리를 누락하지 않습니다.
- **Defensive Sizing**: 터미널의 `fit()` 메서드 호출 시 DOM 존재 여부 및 `offsetParent`를 확인하여 런타임 에러를 방지합니다.
