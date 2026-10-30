---
title: WCHMS
stackLabel: Technology stack
problemSolvingLabel: Selected work
summary: A multilingual web service connecting older adults’ math and reading self-study with course operations. I implemented AI activities, teaching-material generation, and admin features, and designed material difficulty levels and storage.
projectIntro:
  title: Project overview
  description: |-
    Learners needed self-study suited to their level and interests, while staff needed to manage teaching materials and participants. I implemented AI-based math and reading activities, a material-generation flow sharing two difficulty levels, and the teaching-material database schema.

    I connected participant and staff management, course and session-room administration, and in-app notifications. The interface supports Japanese and English, and generated content is saved for reuse as classroom PDFs.
projectContext:
  product:
    label: Product
    description: A multilingual web application supporting cognitive activities and program operations for older adults
  users:
    label: Users
    description: Learners completing math and reading activities, plus staff and administrators managing course materials and operations
  role:
    label: My scope
    description: Designed and implemented AI-assisted self-study, course-material generation, administration features, and the course-material database schema
walkthrough:
  title: Product walkthrough
  description: The video demonstrates the implemented AI-assisted math and reading activity flow.
  unsupported: Your browser does not support video playback.
stack:
  - Next.js
  - TypeScript
  - MySQL
  - OpenAI
---

<!-- case: learningMaterialAlignment -->

## Aligning difficulty across practice and teaching materials

### Overview

I designed difficulty criteria and storage together so learner practice and staff material generation share one standard and generated content can be reused as classroom PDFs.

**Shared criteria for practice and material generation** Learners needed math and reading activities suited to their level, while staff needed to generate and manage teaching materials. Both paths needed shared difficulty criteria and persistent generated content.

### Implementation

**Applying two difficulty levels** I applied the same two difficulty levels to math and reading self-study and staff course-material generation, aligning the criteria learners use with those staff use to prepare materials.

**Saving course materials for PDF reuse** I designed the course-material database schema to store generated content, difficulty, and operational information. Saved materials can be reused as classroom PDFs.

### Outcomes

**Learning and operations using one standard** Learners practice at two difficulty levels, and staff generate and manage materials using the same criteria. The flow also saves generated materials for PDF reuse.

<!-- walkthrough -->

[Product walkthrough](/videos/wchms-walkthrough.mp4)

<!-- /walkthrough -->
