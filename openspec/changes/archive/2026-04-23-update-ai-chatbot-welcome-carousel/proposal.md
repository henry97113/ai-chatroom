## Why

The current chat widget opens with an empty conversation and no proactive guidance, which can feel inactive and leave users unsure what to ask first. We need lightweight onboarding behavior that immediately signals assistant presence and guides first interactions.

## What Changes

- Add a delayed greeting behavior when the chat opens and no prior user message exists.
- Add an idle suggestion carousel at the bottom of the messages area that rotates every 2 seconds before the user sends the first message.
- Define fixed copy for greeting and idle suggestions to match approved UI content.
- Define stop conditions so idle suggestions do not interfere with active conversations.

## Non-Goals (optional)

- No backend or API changes.
- No changes to the existing mock response map matching behavior.
- No persistent storage changes beyond current in-memory session behavior.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `ai-chatbot`: Extend chat opening and pre-message behavior with delayed welcome greeting and rotating idle suggestions.

## Impact

- Affected specs: ai-chatbot
- Affected code:
  - Modified: src/components/AiChatWidget.vue
  - Modified: src/services/aiChatService.js
  - Modified: src/mock/messages.js
  - Modified: src/layouts/MainLayout.vue
