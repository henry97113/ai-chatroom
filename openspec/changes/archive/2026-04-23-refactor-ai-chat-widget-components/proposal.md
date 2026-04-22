## Why

`src/components/AiChatWidget.vue` now combines panel layout, message rendering, input controls, markdown formatting, timers, scroll state, and assistant response orchestration in one 630-line file. This makes changes risky and slows review because unrelated concerns are tightly coupled.

## What Changes

- Split `AiChatWidget.vue` into focused child components for header, messages list, message bubble, composer row, and launcher button.
- Extract chat session state and message/stream lifecycle logic into composables so UI components stay mostly declarative.
- Extract idle greeting/carousel timer logic into a dedicated composable with explicit start/stop/cleanup boundaries.
- Move chat constants and small pure helpers (for example suggested-question splitting) to dedicated modules.
- Preserve existing UI behavior and copy: open/close behavior, in-memory history retention, welcome delay, idle carousel rotation, thinking state, simulated delay, streaming markdown rendering, and conditional auto-scroll.

## Non-Goals (optional)

- No user-facing behavior or wording changes.
- No API/backend integration changes.
- No persistence changes beyond current in-memory session behavior.
- No redesign of Quasar-based visual styling.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `ai-chatbot`: Add an implementation-architecture requirement to keep the AI chat widget modularized into focused components/composables while preserving existing runtime behavior.

## Impact

- Affected specs: ai-chatbot
- Affected code:
  - Modified: src/components/AiChatWidget.vue
  - New: src/components/ai-chat/AiChatHeader.vue
  - New: src/components/ai-chat/AiChatLauncherButton.vue
  - New: src/components/ai-chat/AiChatMessages.vue
  - New: src/components/ai-chat/AiChatMessageItem.vue
  - New: src/components/ai-chat/AiChatComposer.vue
  - New: src/components/ai-chat/composables/useAiChatSession.js
  - New: src/components/ai-chat/composables/useIdleSuggestionCarousel.js
  - New: src/components/ai-chat/chatConstants.js
  - New: src/components/ai-chat/chatUtils.js
  - Removed: (none)
