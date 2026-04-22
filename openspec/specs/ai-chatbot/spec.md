# ai-chatbot Specification

## Purpose

TBD - created by archiving change 'add-ai-chatbot'. Update Purpose after archive.

## Requirements

### Requirement: Floating entry point opens AI chatroom
The system MUST provide a bottom-right floating button labeled "Ask Nitra AI" that opens the AI chatroom panel when clicked.

#### Example: Open chatroom from floating button
- **GIVEN** the user is on any app page
- **WHEN** the user clicks the "Ask Nitra AI" button
- **THEN** the AI chatroom panel is shown


<!-- @trace
source: add-ai-chatbot
updated: 2026-04-22
code:
  - src/layouts/MainLayout.vue
  - src/components/AiChatWidget.vue
  - package.json
  - src/services/aiChatService.js
-->

---
### Requirement: Closing chatroom preserves session history
The system MUST allow users to close the chatroom from a top-right close control and MUST preserve in-memory chat history for the current app session.

#### Example: Close and reopen without losing messages
- **GIVEN** the user has exchanged messages with the assistant
- **WHEN** the user clicks the close button and later reopens the chatroom
- **THEN** previously exchanged messages are restored in order


<!-- @trace
source: add-ai-chatbot
updated: 2026-04-22
code:
  - src/layouts/MainLayout.vue
  - src/components/AiChatWidget.vue
  - package.json
  - src/services/aiChatService.js
-->

---
### Requirement: Mock response resolution without network calls
The system MUST resolve assistant responses from `src/mock/messages.js` and MUST NOT require real API/network requests for this feature.

#### Example: Exact prompt returns mapped response
- **GIVEN** the user sends `Can you help me compare gloves products from different vendors?`
- **WHEN** the prompt exactly matches a key in `MESSAGE_MOCK_MAP`
- **THEN** the assistant returns the mapped mock response content


<!-- @trace
source: add-ai-chatbot
updated: 2026-04-22
code:
  - src/layouts/MainLayout.vue
  - src/components/AiChatWidget.vue
  - package.json
  - src/services/aiChatService.js
-->

---
### Requirement: Unmatched prompts provide guided suggestions
When a user prompt does not match any key in `MESSAGE_MOCK_MAP`, the system MUST return a guidance response that suggests asking one of the supported questions.

#### Example: Unknown prompt fallback
- **GIVEN** the user sends a prompt that does not exist in `MESSAGE_MOCK_MAP`
- **WHEN** the assistant resolves the response
- **THEN** the assistant explains the prompt is not in mock coverage and suggests supported questions


<!-- @trace
source: add-ai-chatbot
updated: 2026-04-22
code:
  - src/layouts/MainLayout.vue
  - src/components/AiChatWidget.vue
  - package.json
  - src/services/aiChatService.js
-->

---
### Requirement: Thinking state and simulated latency
The system MUST show a `thinking...` state before the assistant response and MUST simulate a response delay randomly between 500ms and 1500ms.

#### Example: Delayed response lifecycle
- **GIVEN** the user sends any prompt
- **WHEN** assistant processing starts
- **THEN** `thinking...` is displayed immediately
- **AND** the final assistant content starts after a randomized 500-1500ms delay


<!-- @trace
source: add-ai-chatbot
updated: 2026-04-22
code:
  - src/layouts/MainLayout.vue
  - src/components/AiChatWidget.vue
  - package.json
  - src/services/aiChatService.js
-->

---
### Requirement: Streamed assistant output with markdown rendering
The system MUST present assistant output as a streamed/typewriter response and MUST render assistant markdown into HTML for display.

#### Example: Stream and render markdown
- **GIVEN** assistant response content includes markdown formatting
- **WHEN** the response is emitted
- **THEN** the user sees content appear progressively
- **AND** markdown constructs (for example lists/links/bold text) render as HTML output


<!-- @trace
source: add-ai-chatbot
updated: 2026-04-22
code:
  - src/layouts/MainLayout.vue
  - src/components/AiChatWidget.vue
  - package.json
  - src/services/aiChatService.js
-->

---
### Requirement: Conditional auto-scroll during assistant updates
The system MUST auto-scroll only while the viewport is at the bottom and MUST stop auto-scrolling when the user scrolls upward to review prior messages.

#### Example: Stop following when user scrolls up
- **GIVEN** assistant content is streaming
- **AND** the user scrolls up away from the bottom
- **WHEN** additional assistant content arrives
- **THEN** the viewport does not auto-jump to the bottom

#### Example: Continue following when user stays at bottom
- **GIVEN** assistant content is streaming
- **AND** the user remains at the bottom
- **WHEN** additional assistant content arrives
- **THEN** the viewport automatically follows new content at the bottom

<!-- @trace
source: add-ai-chatbot
updated: 2026-04-22
code:
  - src/layouts/MainLayout.vue
  - src/components/AiChatWidget.vue
  - package.json
  - src/services/aiChatService.js
-->