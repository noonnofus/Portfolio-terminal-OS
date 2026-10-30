---
title: OptiGen MCP Server
stackLabel: Technology stack
problemSolvingLabel: Selected work
summary: I built MCP tools for meeting documents and spoken-address validation. I optimized the audio-processing pipeline and corrected misrecognized building numbers using building records and pronunciation similarity.
projectIntro:
  title: Project overview
  description: |-
    This MCP server provides tools for meeting documents and spoken-address validation. I owned the design and implementation of the MCP server.

    I built tools that transcribe meeting recordings, summarize speech by speaker, and generate Markdown and DOCX meeting minutes. I addressed processing bottlenecks and enabled users to follow progress and access download links for completed documents in the conversation UI.

    I also developed MCP tools for validating spoken addresses. I used actual building lists and Korean pronunciation similarity to correct misrecognized building numbers, with another question when the match was uncertain.
projectContext:
  service:
    label: System
    description: An MCP server for meeting documents and spoken-address validation
  flow:
    label: User flow
    description: Meeting audio to documents / spoken-address input to building-number validation and correction
  role:
    label: My scope
    description: MCP server design and implementation, meeting-document generation and optimization, pronunciation-based address correction
architecture:
  title: OptiGen MCP Server Architecture
  description: "The OptiGen AI agent calls MCP tools through an Express router. End-to-end processes for meeting-document generation and voice address validation appear below, alongside a relationship legend."
  caption: "In Full mode, meeting documents combine parallel transcription and diarization before export; Lite mode skips diarization and speaker alignment. Address validation checks exact matches before applying pronunciation similarity. Solid green identifies MCP requests, solid gray service calls and storage, and dashed purple Full-mode diarization. Select the image to zoom and drag to pan within this window."
  loading: Loading the architecture diagram.
  error: The architecture diagram could not be displayed.
  processDescription: "End-to-end process: Meeting documents (Full mode; Lite skips diarization and speaker alignment): The AI agent calls the meeting tool through the Express router and receives progress through session-specific SSE. Start Pyannote diarization early. FFmpeg splits the audio into 20-minute chunks with a 3-minute overlap. Run up to six Whisper transcriptions in parallel through LiteLLM and remove duplicate utterances from overlapping regions. Wait for transcription and diarization, then assign each utterance to the speaker with the greatest time overlap. Run up to six section-level LLM extractions in parallel, then combine the results into the final meeting document. Save DOCX minutes and TXT transcripts in upload storage and return download links as the final MCP tool result. End-to-end process: Voice address validation: The router connects to a per-request callbot MCP server. The inbound validate-address tool receives the address. Look up the actual building list through the Juso API, normalize building labels, and remove duplicate candidates. Check digits and exact number readings against the list. Lettered buildings (Ga, B) are kept unchanged even when absent from the list and are read back for confirmation. Compare remaining inputs as written and pronounced jamo. Propose only a unique nearest candidate at edit distance <= 2. Ask again if candidates tie or exceed the distance limit. Only when one address candidate remains and the entered numeric building number is not found, search up to five sibling buildings on the same lot. Return the validation result. Legend: Relationships: Solid green: MCP requests and session connections Solid gray: Tool execution, API calls, and file storage Dashed purple: Full-mode diarization and result merging Arrows show who starts a call. Responses return in the opposite direction; meeting progress uses session-specific SSE. General / chart tools call the internal API through a separate tool path from meeting generation and address validation."
  width: 1700
  height: 1396
stack:
  - Node.js
  - TypeScript
  - MCP SDK
  - Express.js
  - Zod
  - FFmpeg
  - Pino
---

<!-- architecture -->

![MCP server architecture showing the OptiGen AI agent, Express router, meeting-document pipeline, order callbot, and pronunciation-based address validation, with end-to-end processes and a relationship legend below](/diagrams/mcp-system-architecture-en.svg)

<!-- /architecture -->

<!-- case: performance -->

## Building and optimizing the audio-to-meeting-document pipeline

### Overview

Meeting recordings lasting over an hour needed to become meeting minutes organized by speaker and a transcript. The task was to work within the transcription API's file-size limit, preserve speech context at split points, and organize a long transcript in sections before combining it into one meeting document.

### Implementation

**Handling speech boundaries and speaker information** I used FFmpeg to split audio into 20-minute chunks with a three-minute overlap and transcribed them in parallel with Whisper. I removed duplicates by selecting transcript segments whose midpoint fell within each chunk's valid time range. pyannote processed the original audio for speaker diarization alongside transcription, and I combined the two results by timestamp.

**Separating extraction and final-synthesis prompts** I split the speaker-aligned transcript into 20-minute sections with a two-minute overlap, processed sections in parallel, and combined the extracted information into final meeting minutes. The extraction prompt instructs the model to preserve speakers, figures, deadlines, and technical terms, and to mark task requests and statements correcting assigned roles separately. The synthesis prompt organizes those results into discussion points, decisions, and follow-up tasks. I specified that dates and figures must not be inferred when absent from the source, and that uncertain statements must not become confirmed facts.

**Converting the final document into downloadable files** I organized the final meeting minutes as Markdown and an intermediate document structure, then converted them into DOCX meeting minutes. The MCP tool returns download links for the minutes and transcript in the same conversation.

**Measuring bottlenecks and improving execution order** After measuring processing stages, I started diarization on the original audio before FFmpeg so it would no longer wait for conversion to finish. I increased concurrency for transcription and section-level information extraction from three to six each and reduced the diarization polling interval from 10 to five seconds.

**Session-specific connections and progress notifications** The JSON-only response path could not deliver intermediate progress, and requests replaced the transport on a shared MCP server. I switched Streamable HTTP to SSE response mode and created a reusable McpServer and transport for each session. Terminating a session closes its transport and removes it from the connection map.

**Connecting processing stages to the conversation** Services report progress through callbacks, and the tool handler converts those events into MCP notifications. I interpolated progress between actual events using estimated durations and cleared temporary state before displaying document links on completion.

### Outcomes

**21.8% less processing time for the same file** Comparing the same 95-minute, 48MB m4a file before and after the changes on local macOS with caching disabled showed a 21.8% reduction in total processing time.

**Progress and documents in the same conversation** Actual meeting-document generation on the development server verified progress delivery for transcription, diarization, and summarization, along with cleanup of temporary state after completion.

<!-- case: addressCorrection -->

## Correcting building numbers with building records and pronunciation similarity

### Overview

Spoken delivery addresses could transcribe building 102 as Korean sounds such as “baegi-dong” or “daegi-dong,” making the building number difficult to confirm. ITN number normalization alone could not resolve these pronunciation errors, so correction needed to use actual address records.

**Avoiding changes to an otherwise correct address** Selecting a building by similar pronunciation alone could suggest an address the customer never intended. Candidates needed to be limited to buildings at the actual address, with another question when the match was uncertain.

### Implementation

**Building candidates from address lookup results** I normalized the building list returned by the road-name address API and compared it separately with the spoken address detail. Entries such as “제101동” and bare numbers are converted to a consistent format, and duplicate entries are removed so the same candidate cannot create a tie.

**Comparing written readings and pronunciation** I converted building numbers into Korean number readings and pronunciation forms that account for liaison and nasal assimilation. Comparing consonant and vowel edit distances lets the tool suggest building 102 even for a transcript such as “daegi-dong.”

**Separating exact matching from similarity matching** Exact digits and Korean number readings are checked directly against the building list. Named buildings such as “가동” or “B동” are not converted to numeric buildings. Pronunciation matching proposes a candidate only when it is the sole nearest match with an edit distance of two or less; ties and larger distances lead to another question about the building number.

### Outcomes

**Correct candidates for 259 of 353 transcripts with missed building numbers** In a separate offline evaluation, I compared transcripts where STT missed a building number with the actual building list for each address. The tool proposed the correct candidate for 73.4% of those transcripts, with no incorrect candidate suggestions observed in that evaluation.
