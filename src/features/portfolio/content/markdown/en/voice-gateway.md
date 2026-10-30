---
title: OptiGen Voice Gateway
stackLabel: Technology stack
problemSolvingLabel: Selected work
summary: A real-time voice gateway connecting phone calls to multiple Voice AI backends. I implemented PBX and SIP integration, per-call sessions, and audio processing, separating provider-specific communication from the shared call flow.
projectIntro:
  title: Project overview
  description: |-
    I was responsible for Voice Gateway design and implementation between the telephone network and AI services. My scope covered PBX/SIP call events, per-call Workers and sessions, STT/TTS, voice activity detection, DTMF input, and reconnection. I applied bot settings from the called number and delivered streamed AI responses as sentence-level speech.

    For the NICE PoC, I built the STT evaluation pipeline and improved address handling with ITN and phonetic MCP correction. I separated provider-specific protocols and audio formats, fixed a timer causing audio packets to be sent in bursts, and migrated deployment-time server commands from SSH to SSM Run Command.
projectContext:
  service:
    label: System
    description: A voice relay system connecting real-time phone audio with OptiGen AI conversation requests and responses
  flow:
    label: User flow
    description: Convert phone audio through STT, generate an OptiGen AI response, then return it to the call as TTS audio
  role:
    label: My scope
    description: Design and implementation of the entire Voice Gateway
architecture:
  title: Call and audio architecture for the OptiGen path
  description: The Main Thread handles ARI call control and session creation. A Worker for each call handles RTP audio, STT, turn management, LLM responses, and TTS. This diagram shows the OptiGen path within the Voice Gateway.
  caption: OpenAI, Uplus, and Mock Voice Client paths, conversation logging, filler audio, and DTMF are omitted. Select the image to zoom and drag to pan within this window.
  loading: Loading the architecture diagram.
  error: The architecture diagram could not be displayed.
  processDescription: "End-to-end process: 1. Receive the call and play ringback. 2. Load bot settings and create a per-call Worker. 3. Answer after RTP and voice services are ready. 4. Send RTP audio to STT and receive the final transcript. 5. Send the transcript to the LLM and receive SSE responses. 6. Split responses into sentences and synthesize speech. 7. Return speech to the call as paced 20ms RTP packets. Legend: solid gray lines show control flow, long-dashed green lines show audio flow, and short-dashed blue lines show text flow. RTP and LLM request/response connections use arrows at both ends."
  width: 1286
  height: 930
stack:
  - Node.js
  - TypeScript
  - WebSocket
  - Zod
  - Axios
  - Vitest
  - Pino
---

<!-- architecture -->

![Voice Gateway architecture showing ARI Client, MainOrchestrator, and WorkerRegistry on the Main Thread, and RTP, STT, TurnManager, OptiGenTransport, and TTS in each call Worker](/diagrams/voice-gateway-architecture-en.svg)

<!-- /architecture -->

<!-- case: callFlow -->

## Per-call bot settings and spoken responses

### Overview

Phone numbers needed different AI bots and voices, with a call flow connecting telephone audio to STT, AI responses, and TTS.

**Bot settings before Worker creation** Bot configuration needed to be validated before creating a per-call Worker, with the selected model and voice applied consistently throughout the call.

### Implementation

**Applying bot settings to each session** The gateway requests bot settings from the Admission API before creating a Worker and applies them to the session’s STT/TTS configuration. Bots can select models and voices while using the same call flow.

**From STT transcripts to sentence-level TTS** Final transcripts go to OptiGen and responses return over SSE. Completed sentences are synthesized and played in the call without waiting for the entire answer to finish.

**Handling chunk boundaries and JSON variations** I fixed text extraction to handle changed JSON key order, whitespace, and objects split across chunks. Tracking the processed position prevents duplicate speech. If streaming produces no sentences, the final response provides a recovery path.

### Outcomes

**Calls and speech driven by bot configuration** I implemented bot-specific call handling and sentence-level playback of AI answers, with regression tests for JSON key order, chunk boundaries, and older response formats.

<!-- case: sttAccuracy -->

## Building an STT evaluation pipeline and improving address recognition

### Overview

I defined evaluation criteria reflecting telephone conditions and corrected recurring numeric-formatting and pronunciation errors in delivery addresses.

**Numeric-formatting and pronunciation errors** Building and unit numbers were transcribed incorrectly when users dictated delivery addresses. Errors such as “102동” appearing as “대기동” could not be resolved through number-format normalization alone.

### Implementation

**STT evaluation pipeline** I connected audio preprocessing, repeated model runs reflecting telephone conditions, transcript storage, and automated scoring. Saved execution settings, character error rates, and exact address match rates enabled comparisons across models and correction settings.

**Rule-based numeric normalization with ITN** I implemented ITN in the Voice Gateway before transcripts reach the LLM, converting forms such as “백 이동” to “102동.” Rules handle mixed Arabic digits and Korean numerals as well as split spacing. Unit and text-boundary conditions limit incorrect changes to place names and ordinary words.

**Pronunciation-based building-number correction** In MCP, I converted actual building-number candidates into Korean readings and pronunciation forms reflecting liaison. Comparing consonant-and-vowel edit distance allows “대기동” to produce “102동” as a candidate. The system proposes a correction only for a unique closest candidate and asks again when candidates tie or differ too much.

**Rechecking saved transcripts** I reapplied correction rules to stored transcripts and compared the results with reference answers. This measured error reduction and checked whether previously correct results became wrong without repeating model calls.

### Outcomes

**18.9% fewer building/unit transcription errors** The comparison covered 1,426 transcripts collected across 90 gpt-transcribe runs with ITN enabled. Improved ITN rules reduced building/unit errors from 270 to 219, with no newly introduced errors in this evaluation.

**Correct candidates for 73.4% of missed building numbers** In a separate MCP evaluation, I compared 353 transcripts with missed building numbers against each address’s actual building list. The correct candidate was proposed in 259 cases, with no incorrect proposals in that evaluation.

<!-- case: providerArchitecture -->

## Separating provider protocols and audio handling

### Overview

Providers differed: OpenAI used Base64 PCM, Uplus used binary PCM, and OptiGen used REST/SSE. I designed boundaries so adding a provider or replacing STT/TTS would not require rewriting common call handling.

**Call processing coupled in one file** Connection handling, reconnection, event interpretation, STT/TTS, and audio conversion lived together in the Voice Client. The task was to separate provider differences while keeping consistent connection behavior for call sessions.

### Implementation

**Common Transport contract** I defined IVoiceTransport as the shared connection contract and placed connection state, exponential backoff with jitter, keep-alive, and common error classification in BaseVoiceTransport.

**Configuration-based factories** VoiceTransportFactory selects the Transport from configuration. Separate STT and TTS factories allow implementations to change without modifying the shared call flow.

**Strategy and Codec boundaries** Provider-specific event formats live in event strategies, while audio-format differences live in codecs. A new provider is therefore centered on its Transport, Strategy, and Codec.

### Outcomes

**Configuration-based implementation selection** OpenAI, Uplus, and OptiGen connection paths can use the same contract. The shared call flow delegates provider-specific events and audio formats to their implementations, while separate factories select STT and TTS.

<!-- case: audioPacing -->

## Improving audio timer startup and recovery

### Overview

I traced why packets intended for 20 ms intervals could arrive in bursts of eight within roughly 40 ms, then separated initialization delays from runtime delays when recovering the transmission schedule.

**Transmission falling behind during connection setup** The timer started before STT and TTS connections finished initializing. Event-loop delays left transmission behind schedule, while the old recovery condition reset during catch-up and allowed delayed packets to be sent consecutively.

### Implementation

**Start with the first audio** SessionBuilder now creates the timer without starting it. The first audio enqueue starts pacing, keeping connection setup time out of the audio transmission schedule.

**Reset the schedule after a large delay** When execution is more than 50 ms behind schedule, the timer resets its reference to the current time. It schedules the next packet 20 ms later instead of rapidly catching up on missed ticks.

### Outcomes

**Starting with audio and restoring 20 ms spacing** Connection setup time no longer accumulates as overdue audio transmissions. If execution falls behind during a call, the next packet resumes a 20ms schedule instead of sending a burst to catch up with the old timeline.
