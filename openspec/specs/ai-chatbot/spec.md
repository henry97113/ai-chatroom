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

---
### Requirement: Delayed welcome greeting on idle chat open
The system MUST display an assistant greeting message with exact text `Welcome to Nitra AI!` after a fixed 500ms delay when the chat widget opens and no user message has been sent in the current session.

#### Scenario: Greeting appears after fixed delay
- **WHEN** the user opens the chat widget in a session with zero user messages
- **THEN** the assistant greeting `Welcome to Nitra AI!` appears exactly 500ms after open

##### Example: Open-to-greeting timing
- **GIVEN** user message count is `0`
- **WHEN** chat opens at `t=0ms`
- **THEN** greeting is not visible before `t=500ms` and is visible at `t=500ms`

#### Scenario: Greeting is not duplicated in the same idle session
- **WHEN** a greeting message already exists in the current chat history and the user reopens the widget without sending a user message
- **THEN** the system does not append a second identical greeting message


<!-- @trace
source: update-ai-chatbot-welcome-carousel
updated: 2026-04-23
code:
  - src/components/AiChatWidget.vue
-->

---
### Requirement: Idle suggestion carousel before first user message
The system MUST display one idle suggestion item at the bottom of the messages area when zero user messages have been sent, and MUST rotate the displayed suggestion every 2 seconds.

#### Scenario: Carousel uses fixed approved options
- **WHEN** the idle suggestion carousel is active
- **THEN** the carousel uses only this fixed list:
  - `Upload your supplier list`
  - `Check if Avastin is in stock`
  - `Check if there's a better price for Xeomin`
  - `What are some generic options for Restylane`
  - `What's the best product for Xeomin`

#### Scenario: Carousel rotates in deterministic order every 2 seconds
- **WHEN** the idle suggestion carousel is active
- **THEN** exactly one suggestion is visible at a time
- **AND** the visible suggestion advances every 2000ms in list order and loops back to the first item after the last

##### Example: Rotation timeline
| Time | Visible suggestion |
| ---- | ------------------ |
| 0s | Upload your supplier list |
| 2s | Check if Avastin is in stock |
| 4s | Check if there's a better price for Xeomin |
| 6s | What are some generic options for Restylane |
| 8s | What's the best product for Xeomin |
| 10s | Upload your supplier list |

#### Scenario: Carousel stops after first user message
- **WHEN** the user sends the first user message
- **THEN** idle suggestion carousel content is hidden and no further 2-second rotation occurs

<!-- @trace
source: update-ai-chatbot-welcome-carousel
updated: 2026-04-23
code:
  - src/components/AiChatWidget.vue
-->

---
### Requirement: Modular chat widget composition
The system MUST structure AI chat widget implementation into focused UI components and dedicated composables for interaction orchestration, while preserving all existing user-facing behavior in this specification.

#### Scenario: UI sections are componentized
- **WHEN** maintainers inspect the chat widget source implementation
- **THEN** header, launcher button, message list/row rendering, and composer input sections are implemented as dedicated component files instead of a single monolithic template

#### Scenario: Orchestration concerns are extracted
- **WHEN** maintainers inspect chat logic implementation
- **THEN** message lifecycle orchestration (thinking/streaming flow, markdown rendering, and message mutation) and idle timer orchestration (welcome delay and suggestion rotation) are implemented in composable modules with explicit lifecycle control

#### Scenario: Runtime behavior parity is preserved
- **WHEN** users interact with the refactored widget
- **THEN** open/close behavior, in-memory message persistence, greeting delay, idle carousel rotation/stop conditions, simulated assistant delay, streaming markdown rendering, and conditional auto-scroll continue to satisfy the existing `ai-chatbot` requirements

<!-- @trace
source: refactor-ai-chat-widget-components
updated: 2026-04-23
code:
  - src/components/ai-chat/composables/useAiChatSession.js
  - src/components/ai-chat/AiChatLauncherButton.vue
  - src/components/ai-chat/AiChatHeader.vue
  - src/components/AiChatWidget.vue
  - src/components/ai-chat/AiChatComposer.vue
  - src/components/ai-chat/AiChatMessages.vue
  - src/components/ai-chat/chatUtils.js
  - src/components/ai-chat/AiChatMessageItem.vue
  - src/components/ai-chat/chatConstants.js
  - src/components/ai-chat/composables/useIdleSuggestionCarousel.js
-->

---
### Requirement: Consecutive assistant messages show avatar only on the first message
The system MUST display the assistant avatar only on the first message of a consecutive group of assistant messages. Subsequent assistant messages in the same group MUST render a same-sized spacer element instead of the avatar to maintain horizontal alignment with the first message's bubble.

#### Scenario: Single assistant message shows avatar
- **WHEN** the message list contains a single assistant message (not preceded by another assistant message)
- **THEN** that message displays the assistant avatar

#### Scenario: First of consecutive assistant messages shows avatar
- **WHEN** the message list contains two or more consecutive assistant messages
- **THEN** the first assistant message in the group displays the assistant avatar

#### Scenario: Subsequent consecutive assistant messages show spacer
- **WHEN** the message list contains two or more consecutive assistant messages
- **THEN** every assistant message after the first in the group displays a spacer element instead of the avatar
- **AND** the spacer element occupies the same width as the avatar (24px) to keep bubble alignment consistent

#### Scenario: User message resets the avatar group
- **WHEN** a user message appears between two assistant messages
- **THEN** both assistant messages display the assistant avatar because they belong to separate groups

##### Example: Mixed message sequence

| Index | Role      | Previous Role | Shows Avatar |
| ----- | --------- | ------------- | ------------ |
| 0     | assistant | (none)        | yes          |
| 1     | assistant | assistant     | no           |
| 2     | user      | assistant     | N/A          |
| 3     | assistant | user          | yes          |
| 4     | assistant | assistant     | no           |
| 5     | assistant | assistant     | no           |

<!-- @trace
source: hide-consecutive-bot-avatars
updated: 2026-04-23
code:
  - src/components/ai-chat/AiChatMessages.vue
  - src/components/ai-chat/AiChatMessageItem.vue
-->