## 1. Add showAvatar prop to AiChatMessageItem

- [x] 1.1 Add a `showAvatar` Boolean prop (default `true`) to `AiChatMessageItem.vue`. When `showAvatar` is `false`, replace the `<q-avatar>` element with a `<div>` spacer styled to `width: 24px; min-width: 24px` to maintain horizontal alignment with the bubble. This implements the "consecutive assistant messages show avatar only on the first message" requirement. (~10 min)

## 2. Compute and pass showAvatar in AiChatMessages

- [x] 2.1 In `AiChatMessages.vue`, update the `v-for` loop to pass a `:show-avatar` prop to each `AiChatMessageItem`. The value is `true` when the message is not an assistant message OR when the previous message in the array has a different role (or there is no previous message). Otherwise the value is `false`. This satisfies the "user message resets the avatar group" scenario. (~10 min)

## 3. Verify visual alignment

- [x] 3.1 Manually verify that consecutive bot messages align their bubbles correctly (spacer matches avatar width) and that a user message between two bot messages causes both to show the avatar. (~5 min)
