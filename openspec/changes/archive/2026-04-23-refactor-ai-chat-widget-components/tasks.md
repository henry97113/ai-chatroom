## 1. Component Decomposition

- [x] 1.1 Implement Decision: Split panel UI into small presentational components by creating `AiChatHeader`, `AiChatLauncherButton`, `AiChatMessages`, `AiChatMessageItem`, and `AiChatComposer` skeleton files (Est: 25m)
- [x] 1.2 Implement Requirement: Modular chat widget composition by migrating template sections from `AiChatWidget.vue` to those dedicated components with prop/event boundaries (Est: 30m)

## 2. Session Logic Extraction

- [x] 2.1 Implement Decision: Move chat orchestration into a session composable by extracting message state, message helpers, markdown rendering, and `sendMessage` lifecycle into `useAiChatSession.js` (Est: 30m)
- [x] 2.2 Move shared constants and pure helper utilities (timing constants, random helpers, split-suggested-question parser) into `chatConstants.js` and `chatUtils.js` (Est: 20m)

## 3. Idle Timer Extraction

- [x] 3.1 Implement Decision: Isolate idle greeting/carousel timers in a dedicated composable with explicit start/stop/reset/cleanup APIs in `useIdleSuggestionCarousel.js` (Est: 25m)
- [x] 3.2 Connect timer composable to widget open/close/send/unmount lifecycle while preserving existing welcome and carousel stop conditions (Est: 20m)

## 4. Integration and Parity Verification

- [x] 4.1 Implement Decision: Keep behavior parity via compatibility-oriented integration by preserving existing class names and parent wiring contracts after extraction (Est: 20m)
- [x] 4.2 Verify runtime behavior parity is preserved for close/reopen history, welcome delay, idle rotation, thinking state, simulated response delay, streaming markdown, and conditional auto-scroll (Est: 30m)
