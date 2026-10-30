---
title: Flare
stackLabel: Technology stack
problemSolvingLabel: Selected work
summary: A team project bringing Canadian wildfire locations, risk indicators, and news together. I implemented key full-stack features including a wildfire AI chatbot, web push notifications, and PWA installation on mobile and desktop.
projectIntro:
  title: Project overview
  description: |-
    Our team brought wildfire information from multiple sources into maps, risk indicators, and related news. I implemented a wildfire-focused chatbot using the OpenAI API and Firebase web push so users could continue from browsing to questions and notifications.

    I connected news collected through the Bing News API and a web crawler, and implemented a PWA experience for installation and return visits on mobile and desktop. My scope covered key full-stack features, including the chatbot, notifications, and installation.
projectContext:
  product:
    label: Product
    description: An installable web application for exploring wildfire information and related questions
  users:
    label: Users
    description: Local users who want to review wildfire locations, risk indicators, and related news in one place
  role:
    label: My scope
    description: Designed and implemented major full-stack features including PWA installation, a wildfire-focused AI chatbot, and web push notifications
walkthrough:
  title: Product walkthrough
  description: The videos demonstrate the implemented screens and user flows in the web and installed experiences.
  unsupported: Your browser does not support video playback.
stack:
  - Next.js 15
  - TypeScript
  - Tailwind CSS
  - PostgreSQL
  - Drizzle ORM
  - OpenAI API
  - Google Maps
  - Firebase Cloud Messaging
  - PWA
---

<!-- case: informationFlow -->

## Connecting wildfire exploration, questions, and notifications

### Overview

I implemented key full-stack features linking the team’s map and news exploration flow to a wildfire chatbot, web push, and PWA installation.

**Questions and return visits after exploration** Wildfire locations, risk indicators, and related news were spread across sources, leaving users to combine the information themselves. My scope was to extend the team’s map-based exploration into questions, notifications, and repeat access.

### Implementation

**Connecting a wildfire-focused AI chatbot** I implemented a wildfire-focused chatbot with the OpenAI API so users could ask questions after exploring the map, risk indicators, and related news.

**Web push and PWA installation** I implemented Firebase web push and PWA installation so users could install the web app on mobile and desktop and return through notifications.

### Outcomes

**From exploration to questions and notifications** My chatbot, notification, and installation features connect to the map, risk indicators, and news built by the team. Users can review wildfire information, ask questions, and return through one web application.

<!-- walkthrough -->

[Product walkthrough 1](/videos/flare-walkthrough-web.mp4)

[Product walkthrough 2](/videos/flare-walkthrough-app.mp4)

<!-- /walkthrough -->
