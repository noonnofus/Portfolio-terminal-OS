---
title: Korea Electric Power Contact Center Advisor
stackLabel: Technology stack
problemSolvingLabel: Selected work
summary: An internal contact-center service connecting live transcripts, post-call AI analysis, and call history. I owned frontend design and implementation for agents and administrators, incorporating feedback from the pilot operation.
keyOutcome:
  label: Project outcomes
  value: Used by 60% of agents, with average customer wait time reduced by 30%
  description: These are operating outcomes for the advisor service as a whole, including live transcription, AI analysis, and consultation history.
projectIntro:
  title: Project overview
  description: |-
    I designed and implemented the frontend for agents and administrators at Korea Electric Power’s contact center. Agents can follow live transcripts and call state, then review recordings, AI analysis, and consultation history. Administrators can inspect consultations and find individual agents.

    I implemented polling/SSE transitions, transcript recovery, recording synchronization, and multi-tab authentication. I also supported the pilot on site and used feedback to improve agent-search and favorites API integration and failure handling.
projectContext:
  service:
    label: Service
    description: An internal web service supporting Korea Electric Power contact-center work
  users:
    label: Users
    description: Agents handling live calls and managers reviewing consultation status and history
  role:
    label: My scope
    description: Agent and admin frontend design and implementation, real-time state and multi-tab authentication, pilot-site guidance, and feedback-driven improvements
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
  title: I separated multi-tab refresh request serialization from result distribution.
  description: "Activity timing and logout are synchronized across tabs for the project's 15-minute inactivity policy. The diagram below focuses on token refresh: Web Locks coordinate refresh work and BroadcastChannel distributes the refreshed Access Token."
  alt: Flow showing Web Locks serializing server refresh requests across tabs and BroadcastChannel distributing refreshed Access Tokens
  caption: IdleTimer uses its own channel for activity synchronization. A separate authentication channel carries logout and refreshed tokens; tabs that are logging out do not adopt incoming tokens.
  loading: Loading the architecture diagram.
  error: The architecture diagram could not be displayed.
  scrollLabel: Horizontal scroll area for the diagram
  wide: true
  sectionId: multiTabAuth
---

<!-- architecture -->

```mermaid
flowchart TB
    subgraph before["Previous flow"]
      direction LR
      signal["BroadcastChannel, refresh signal"] --> repeatedRefresh["Every tab requests a server token refresh"] --> race["Single-use Refresh Token race, 401"]
    end

    decision["Separate request serialization and result sharing"]

    subgraph after["Improved flow"]
      direction LR
      tabs["Several tabs need a fresh token"] --> ownerRefresh["Serialize server refresh requests with Web Locks"] --> broadcast["BroadcastChannel sends the new Access Token"] --> adopt["Receiving tabs check logout state and compare exp"]
    end

    before --> decision --> after

    classDef problem fill:#fff1f2,stroke:#e11d48,stroke-width:2px,color:#881337
    classDef pivot fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#7c2d12
    classDef owner fill:#e8f1ff,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef shared fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#064e3b
    class signal,repeatedRefresh,race problem
    class decision pivot
    class tabs,ownerRefresh owner
    class broadcast,adopt shared
```

<!-- /architecture -->

<!-- case: liveTranscript -->

## Live transcripts and reconnection across call states

### Overview

Agents needed to read live transcripts and retain the conversation when the screen’s streaming connection was interrupted and restored.

**A lifecycle for call detection and transcript delivery** I connected current-call detection, live transcription, and waiting for the next call. Confirmed text stays visible during reconnection; transcript state resets only when the call changes.

### Implementation

**Switching between waiting polls and live SSE** While waiting, the interface polls for the current call every second and switches to SSE when a call starts. Call end, fatal errors, or exhausted retries resume polling so the next call can be detected.

**Separating partial and confirmed speech** Each speaker’s partial text is replaced with its latest version. Confirmed utterances are deduplicated by ID and ordered by time. Reconnection preserves the current call’s text until a server snapshot reconciles state.

**Reconnection based on error type** I distinguished authentication renewal, invalid permission or call state, and network interruption. A missing heartbeat triggers bounded retries, while switching browser tabs keeps the connection open.

### Outcomes

**Recovery without clearing confirmed speech** Confirmed text remains readable during reconnection and is reconciled with server state afterward. Tests cover snapshots, duplicate utterances, ordering, and error-specific retry behavior.

<!-- case: consultationReview -->

## Connecting transcript search, recordings, and AI analysis

### Overview

Reviewing a consultation required finding the underlying utterances, listening to the recording, and checking both the original AI output and saved analysis.

**Aligning speech, playback, and analysis state** I synchronized transcript and recording navigation without letting automatic live following interrupt search or playback. Analysis also needed to distinguish the initial streamed output from saved final values.

### Implementation

**Linking utterances to recording timestamps** The interface highlights the utterance matching playback time, and selecting a sentence seeks the recording to that point. Exploring earlier speech stops automatic following; ResizeObserver detects changes in transcript height.

**Immediate AI output followed by saved values** I displayed classification and summary events received over SSE immediately, then fetched saved analysis when processing ended. Failed refreshes preserve the existing result and use bounded retries.

### Outcomes

**Reviewing evidence and analysis together** Transcript search, sentence-level recording navigation, and original and confirmed analysis form one consultation-review flow. Tests cover playback synchronization, stopping automatic following, and retrying failed confirmed-value requests.

<!-- case: multiTabAuth -->

## Synchronizing multi-tab authentication and idle logout

### Overview

I kept activity and authentication state consistent across consultation tabs and prevented refresh failures from propagating into logout in other tabs.

**Idle logout that respects call state** Independent activity timers could log out one tab while an agent was working in another or leave a closed session visible. The implementation needed to use the server-provided inactivity limit and pause the timer during active calls.

**Concurrent use of single-use refresh tokens** When several tabs received 401 responses together, each tried to refresh with the same single-use Refresh Token. After one tab consumed it, the others retried with an already-used token, received 401 responses, and could propagate logout to otherwise valid tabs.

### Implementation

**Synchronizing activity and propagating logout** react-idle-timer coordinates activity and timers using crossTab, leaderElection, and syncTimers. The leader handles the server request for inactivity logout. Tabs receiving logged-out on a separate authentication BroadcastChannel clear tokens and query caches, then navigate to the login page.

**Serializing refresh requests and sharing results** Web Lock prevents concurrent server refresh requests, while an authentication BroadcastChannel shares the new Access Token. Receiving tabs apply it without making another refresh request.

**Rejecting older tokens and late refresh results during logout** Receiving tabs check logout state and the token’s exp value and apply only a newer Access Token. Starting logout blocks refreshes and late result application; Refresh Tokens are never sent through the channel.

### Outcomes

**Verifying token application and error separation** Tests verify that receiving tabs adopt a new Access Token without a server request and ignore missing payloads, tokens received during logout, and older expirations. Network and 5xx failures are also separated from invalid authentication so temporary outages do not expand into cross-tab logout.
