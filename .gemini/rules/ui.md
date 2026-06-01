## 5. UI & Styling (Shadcn UI)
- **Shadcn UI & Tailwind 4**: 이 프로젝트는 Chakra UI를 폐기하고 **Shadcn UI + Tailwind 4**를 표준으로 사용합니다.
- **No Runtime CSS-in-JS**: Emotion, Styled-components 등 런타임 오버헤드가 발생하는 라이브러리 사용을 지양합니다.
- **Customization**: OS 특유의 디자인을 위해 Shadcn 컴포넌트의 내부 코드를 직접 수정하거나 Tailwind 클래스로 확장하여 사용합니다.
- **Accessibility**: Radix UI의 접근성 표준을 준수하며, 모든 대화 상자(Dialog)와 팝업은 키보드 네비게이션을 지원해야 합니다.
