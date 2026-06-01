## 3. Hydration & Theme
- **Next-themes**: `next-themes` 사용으로 인한 하이드레이션 불일치를 방지하기 위해 `layout.tsx`의 `<html>` 태그에는 `suppressHydrationWarning`을 필수로 적용합니다.
- **Client-only Components**: 테마에 의존적인 UI 요소는 마운트 여부(`mounted` state)를 확인한 후 렌더링합니다.
