## Why

When the bot sends two or more consecutive messages (e.g., a welcome greeting followed by a guidance response), each message currently renders its own avatar. This creates visual clutter and does not match the grouped-message pattern common in modern chat UIs.

## What Changes

- `AiChatMessages.vue` will compute whether each message is the first in a consecutive bot-message group and pass a `showAvatar` boolean prop to `AiChatMessageItem`.
- `AiChatMessageItem.vue` will accept a `showAvatar` prop. When `true`, the existing avatar renders normally. When `false`, a same-sized spacer `div` replaces the avatar to keep bubble alignment consistent.

## Non-Goals

- **Message grouping restructuring**: We will NOT restructure the flat message array into grouped sub-arrays. The existing `v-for` loop stays as-is.
- **CSS-only `visibility: hidden` approach**: Rejected because it leaves unnecessary DOM nodes (images) in the tree.
- **User-message avatar grouping**: This change only applies to bot (assistant) messages. User messages do not display avatars.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `ai-chatbot`: Adding a display rule that consecutive assistant messages show the avatar only on the first message of the group.

## Impact

- Affected specs: `ai-chatbot` (modified capability)
- Affected code:
  - Modified: `src/components/ai-chat/AiChatMessages.vue`
  - Modified: `src/components/ai-chat/AiChatMessageItem.vue`
