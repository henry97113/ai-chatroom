# Tasks: add-ai-chatbot

## 1. UI Shell
- [x] Add floating bottom-right "Ask Nitra AI" trigger in layout.
- [x] Add chatroom panel with header/title and top-right close button.
- [x] Ensure open/close toggles visibility only and preserves in-memory history.

## 2. Chat State and Message Flow
- [x] Add JavaScript state/composable for chat visibility, messages, and response lifecycle.
- [x] Append user messages on send.
- [x] Add assistant placeholder with `thinking...` before response content appears.

## 3. Mock AI Service
- [x] Wrap `MESSAGE_MOCK_MAP` access in a service function.
- [x] Implement exact-match response retrieval.
- [x] Implement fallback response that suggests known questions from mock keys.

## 4. Streaming and Markdown
- [x] Add randomized response delay between 500ms and 1500ms.
- [x] Implement typewriter/streaming assistant output.
- [x] Render assistant markdown as HTML (library allowed, e.g. `markdown-it`).

## 5. Scroll Behavior
- [x] Auto-scroll while AI updates only when user is at bottom.
- [x] Stop auto-scroll when user scrolls up.
- [x] Resume follow behavior when user returns to bottom.

## 6. Validation
- [x] Verify behavior against Figma-aligned interaction flow.
- [x] Verify close/reopen restores history in same session.
- [x] Verify unmatched user inputs show suggestion fallback.
