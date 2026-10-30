---
title: OptiGen Frontend
stackLabel: Technology stack
problemSolvingLabel: Selected work
summary: I designed and built the administration and conversation frontend of a B2B AI platform, connected streamed answers to tool execution state, and established shared components, a design system, UI tests, and PR CI.
projectIntro:
  title: Project overview
  description: |-
    The frontend of a B2B AI platform for company-document conversations and business tool execution. I designed and implemented the administration and user conversation interfaces, extending features for customer-specific requirements after the initial product build.

    I built organization, bot, document, and model management screens and connected streamed answers, tool execution state, and final results in the conversation interface. I established shared components, a design system, Storybook-based UI tests, and automated PR checks.

    I organized customer-specific deployment settings and migrated server commands in the existing deployment pipelines from SSH to AWS SSM.
projectContext:
  service:
    label: Product
    description: Administration and user web interfaces for a B2B platform providing company-document conversations and business tool execution
  users:
    label: Users
    description: Administrators managing organizations, permissions, bots, and documents, and people applying AI to their work
  role:
    label: My scope
    description: Frontend and UI/UX design and implementation, model-registration UI and API integration, design system and automated UI tests, PR CI, and deployment-pipeline improvements
architecture:
  title: OptiGen system architecture
  description: Web chat and phone calls share the API and AI services. The diagram includes document processing, retrieval, LLMs, and MCP tools, with separate chat and call processes and a relationship legend below.
  caption: The call process shows OptiGen mode. Dashed connections identify batch tasks and the external voice AI alternative path. Select the image to zoom and drag to pan within this window.
  loading: Loading the architecture diagram.
  error: The architecture diagram could not be displayed.
  processDescription: "End-to-end process: Chat (web): Enter a bot and receive a roomToken and conversation settings. The browser requests an SSE answer from the API. Non-streaming requests use a server action. The API passes the bot strategy and MCP settings to the AI service. AI runs Qdrant retrieval, LLM calls, and MCP tools when needed. The API relays the answer and saves conversation history in MySQL. End-to-end process: Call (OptiGen mode): A caller connects through Twilio and Asterisk to the Voice Gateway. The gateway loads bot settings and creates a Worker for the call. RTP audio is transcribed by STT and sent through the API to AI. The shared AI path returns retrieval, LLM, and tool results. TTS speech is played over RTP and call logs are submitted. Legend: Relationships: Solid green: Main chat and call requests Solid gray: Service calls and storage access Dashed purple: Batch or conditional paths Arrows show who starts a request. Responses and SSE flow in the reverse direction. In external voice AI mode, the gateway exchanges audio over WebSocket. The external service handles STT/AI/TTS. Normal conversation bypasses OptiGen API and the separate STT/TTS path."
  width: 1262
  height: 1539
stack:
  - Next.js 16
  - TypeScript
  - TanStack Query
  - Zustand
  - Zod
  - shadcn/ui
  - Tailwind CSS
  - Storybook
---

<!-- architecture -->

![OptiGen system architecture connecting web chat, phone calls, shared API and AI services, document processing, and stores, with chat and OptiGen-mode call processes and a relationship legend below](/diagrams/optigen-system-architecture-en.svg)

<!-- /architecture -->

<!-- case: productWorkspace -->

## Building organization, bot, document, and model management

### Overview

Each organization needed to manage its AI bots, documents, and users, and have those settings take effect in conversations.

**Scope from administration to conversations** I needed to align hardcoded frontend model lists with the server’s supported models and connect administration to execution so the user-selected model actually took effect in conversations.

### Implementation

**Organization, bot, and document interfaces** I built organization trees, user assignment, bot settings, and document access controls. React Query owns server reads and mutations, while Zustand holds selections and view state.

**Connecting the model catalog to execution** I consolidated model options around the backend catalog and added a model-registration interface and Spring API. I also fixed model selection so the server validates the requested model against its active catalog and applies it to execution.

### Outcomes

**Administration settings reflected in conversations** Administrators can manage organization-specific bots and documents, register supported models, and run conversations in the same platform. The model selected in the frontend now matches the server execution setting.

<!-- case: streamingConversation -->

## Displaying streamed AI responses and tool execution

### Overview

AI responses included text, charts, tool status, and progress updates. The interface needed to distinguish temporary execution state from answer content while keeping long responses readable.

**Separating answers from execution state** I agreed on SSE event rules with the backend and mapped generation, MCP execution, completion, and errors to interface states. Previous streams also needed to stop when the user cancelled or changed conversations.

### Implementation

**SSE parsing and content-specific rendering** I separated SSE event parsing from accumulated JSON interpretation and routed text, images, links, and charts to their renderers. Long Markdown is split into blocks while preserving code fences, tables, and lists.

**Temporary status and final results** I kept tool status and progress separate from the answer body. Stage descriptions accumulate in order, while each tool’s progress replaces its previous value. A final event clears temporary state and displays the completed content and charts.

**Coordinating updates and reading position** I batched interface updates with requestAnimationFrame. ResizeObserver measures the latest question and answer so a shrinking spacer preserves the question position until the answer fills the viewport. AbortController stops the old stream on a conversation change.

### Outcomes

**Execution and results visible in one conversation** Users can read their question during generation, follow tool execution, and view the final chart and response in the same conversation. I verified state transitions and cleanup for generation, completion, cancellation, and errors.

<!-- case: performance -->

## Reducing initial transfer size and editor layout shifts

### Overview

Fonts, charts, and editors added to initial loading costs. The document editor also grew after server rendering and pushed settings and the save button down the page.

**Separating loading costs from layout shifts** I reviewed pages to distinguish resources required at startup from those that could load later. The document editor needed consistent dimensions before and after client initialization.

### Implementation

**Font subsets and deferred feature loading** I split Pretendard into a common Korean character subset and a fallback loaded for other characters. Dashboard charts and the prompt editor use next/dynamic to leave the initial loading path.

**Matching server and client editor dimensions** I gave the document editor a fixed height and internal scrolling for long content. Matching its server-rendered and initialized heights keeps settings and the save button in place.

### Outcomes

**Approximately 54% less initial data transfer** Recorded page checks showed initial transfer size falling from 2.8MB to approximately 1.3MB, an approximate 54% reduction calculated from those rounded values.

**Document-editor CLS reduced from 0.225 to 0** A local Lighthouse check of the document-editor page recorded Cumulative Layout Shift (CLS) falling from 0.225 to 0.

<!-- case: deliveryFoundation -->

## Design system and UI quality checks

### Overview

Administration and conversation screens needed consistent UI and repeatable checks of shared component appearance and behavior as customer-specific features changed.

**Consistent UI and repeatable change checks** Colors and component usage varied across screens. The project needed common standards and a browser-based environment to repeatedly check modal and input states.

### Implementation

**Shared components and automated tests** I defined color, typography, and theme tokens and documented shared component states and usage in Storybook. I connected interaction tests to Vitest and Playwright and built PR CI to run typechecking, lint, component tests, and a production build.

**Fixing issues found in Storybook accessibility checks** I fixed color-contrast issues identified in Storybook accessibility checks using text-specific color tokens. File-delete buttons received accessible names including the filename so their purpose could be distinguished.

### Outcomes

**Error-badge text contrast improved from 3.76:1 to 6.47:1** Based on the text and background color values, error-badge contrast improved from 3.76:1 to 6.47:1, meeting the WCAG AA minimum of 4.5:1 for normal text. Shared component states, usage guidance, and automated test results are available through Storybook and PRs.
