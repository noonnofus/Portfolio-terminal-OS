---
title: Korea Electric Power Contact Center Advisor
stackLabel: Technology stack
problemSolvingLabel: Selected work
summary: An internal contact-center service connecting live transcripts, post-call AI analysis, and call history. I owned frontend design and implementation for agents and administrators, incorporating feedback from the pilot operation.
projectIntro:
  title: Project overview
  description: |-
    An internal web service for Korea Electric Power’s contact center, where agents follow live transcripts, review post-call AI analysis and consultation history, and administrators monitor ongoing consultations.

    I owned frontend design and implementation for agents and administrators. I connected call detection, live transcription, analysis review, and recording playback to match the consultation workflow.

    To help agents accustomed to their existing workflows feel comfortable using a new system, I visited the contact center during development to collect feedback on their daily difficulties and the service. I used that feedback to improve agent search and favorites and explained how to use the service during the pilot.

    Approximately 60% of agents went on to use the service, and a comparison of the contact center’s live wait-time readings before and after deployment showed a decrease of approximately 30% in customer wait time.
projectContext:
  service:
    label: Service
    description: An internal web service supporting Korea Electric Power contact-center work
  users:
    label: Users
    description: Agents handling live calls and managers reviewing consultation status and history
  role:
    label: My scope
    description: Full frontend design and implementation for agents and administrators, live transcripts, AI analysis and recording integration, multi-tab authentication and session management, and on-site pilot support and feedback-driven improvements
stack:
  - React 19
  - TypeScript
  - Vite
  - TanStack Query
  - Zustand
  - Tailwind CSS
  - Axios
  - Playwright
architecture:
  title: "KEPCO Contact Center Advisor System Architecture"
  description: "The diagram distinguishes my frontend scope, the modules of one backend application, data stores, and external integrations. It follows live transcript delivery, post-call analysis, revised consultation results, and batch reanalysis."
  alt: "KEPCO Contact Center Advisor system architecture showing my frontend scope, API modules, Redis, database, external integrations, and live transcript, analysis, and batch flows"
  caption: "I designed and implemented the role-based screens, call detection, transcript state handling, and API client in the frontend area. Arrows indicate request and event-delivery directions."
  loading: "Loading the system architecture."
  error: "Unable to display the system architecture."
  processDescription: "My scope is frontend design and implementation for agents and administrators. The frontend contains role-based screens, call detection, transcript state handling, and the API client. It polls once per second while waiting, then subscribes to call-specific SSE when a call starts. Snapshot, partial, and final transcript events update the display, while the API client coordinates token refresh across tabs. Apache serves static files and relays API requests and SSE events. Web API, STT and call handling, AI analysis, Sales and Distribution inbound handling, and batch jobs are modules of one Spring Boot application. Calls and final utterances are persisted, and final utterances undergo asynchronous ITN and masking. Redis events reach the frontend through Web API and Apache. After a call, classification and summary results are saved and sent to the Sales and Distribution ESB when transfer conditions allow it. Revised external consultation results are stored through the inbound module. Batch jobs request missing-call retransmission from the recording system, clean up expired records, and retry calls missing analysis. Recording playback also passes through Web API. The legend distinguishes frontend, backend modules, the web server, data stores, and external integrations."
  width: 1434
  height: 772
---

<!-- architecture -->

![KEPCO Contact Center Advisor system architecture showing my frontend scope, API modules, Redis, database, external integrations, and live transcript, analysis, and batch flows](/diagrams/kepco-system-architecture-en.svg)

<!-- /architecture -->

<!-- case: liveTranscript -->

## Live consultation and administrator monitoring

### Overview

Agents needed to follow transcripts during their calls, while administrators needed to review several ongoing consultations together. I reflected call start, call end, and connection changes in the interface while preserving the conversation during recovery.

### Implementation

- **Call detection and live transcript delivery**
  While waiting, the interface polls for the current call every second. When a call starts, it stops polling and subscribes to call-specific SSE. Polling resumes after the call ends or connection recovery is stopped so the next call can be detected.

- **Updating partial transcripts and applying final utterances**
  I updated in-progress text in real time as PARTIAL results arrived and replaced it with confirmed text when the server returned FINAL results after ITN and other post-processing. I ordered confirmed utterances by their start times to preserve the conversation flow even when post-processing results arrived out of order. During reconnection, confirmed text stays visible until a server snapshot reconciles the accumulated utterances and current in-progress text.

- **Shared components designed for maintainability**
  To improve maintainability across agent and administrator screens, I split the transcript interface into shared components for the card structure, search, conversation list and scrolling, analysis results, and connection notices. Shared hooks centralize transcript delivery and search logic so changes can be made in one place, while each screen composes its role-specific call information and additional features.

- **Connection recovery and guidance based on the cause**
  I implemented bounded automatic reconnection for temporary communication failures and token refresh followed by reconnection when authentication expires. The interface stops retrying and displays a notice when access is denied or the call cannot be found. I also configured the connection to remain open when switching tabs to avoid unnecessary reconnections.

### Outcomes

I implemented screens for agents to follow transcripts from call start to end and for administrators to monitor several consultations together. Confirmed text remains visible during reconnection so users can continue reviewing the conversation while waiting for recovery.

<!-- case: consultationReview -->

## AI analysis review and consultation history navigation

### Overview

After a call, agents needed to review the classification and summary produced by AI and revisit past conversations alongside their recordings. I connected post-call analysis review, consultation history search, and sentence-level recording playback in the interface.

### Implementation

- **Separating original AI output from saved final results**
  Classification and summary results can be revised after AI generation, so I kept the original output separate from the saved final results. I displayed AI results received over SSE immediately, then fetched saved results from the detail API when analysis ended.

- **Handling missed analysis-completion events**
  If the connection ended after the call without delivering an analysis-completion event, the interface retrieved results through the detail API. Failed requests preserve the existing display and use bounded retries.

- **Linking transcript sentences to recording timestamps**
  Selecting a sentence in consultation history seeks the recording to that utterance’s start time. The interface highlights the current utterance during playback and stops automatic following when users explore earlier speech themselves.

### Outcomes

I enabled users to distinguish original AI output from saved final results after a call and to review past conversations alongside their recordings in consultation history.

<!-- case: multiTabAuth -->

## Multi-tab authentication and session management

### Overview

Consultation work across several tabs required handling overlapping token-refresh requests and idle logout caused by another tab during an active call. I coordinated authentication state across tabs and incorporated actual call state into session management.

![Flow showing Web Locks serializing server refresh requests across tabs and BroadcastChannel distributing refreshed Access Tokens](/diagrams/kepco-token-refresh-en.svg "Multi-tab token refresh flow")

### Implementation

- **Coordinating refresh requests and sharing results**
  I serialized refresh requests across tabs with Web Lock and distributed refreshed Access Tokens through BroadcastChannel. Receiving tabs apply the token without making a separate refresh request.

- **Blocking token application after logout begins**
  Tabs that have started logging out reject late refresh responses and tokens from other tabs. Comparing expiration times also prevents older tokens from replacing the current authentication state.

- **Respecting call state in idle handling**
  I synchronized activity timing and logout across tabs and paused the inactivity timer during active calls. Network and server errors are separated from invalid authentication, correcting paths where temporary communication failures could propagate into logout across tabs.

### Outcomes

I synchronized authentication refresh and logout across tabs and paused idle logout during active calls. I also blocked late responses from restoring authentication state after logout had begun.
