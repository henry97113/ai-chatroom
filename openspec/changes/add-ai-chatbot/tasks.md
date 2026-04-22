# Tasks: add-ai-chatbot

## 1. UI Shell
- [ ] Add floating bottom-right "Ask Nitra AI" trigger in layout.
- [ ] Add chatroom panel with header/title and top-right close button.
- [ ] Ensure open/close toggles visibility only and preserves in-memory history.

## 2. Chat State and Message Flow
- [ ] Add JavaScript state/composable for chat visibility, messages, and response lifecycle.
- [ ] Append user messages on send.
- [ ] Add assistant placeholder with `thinking...` before response content appears.

## 3. Mock AI Service
- [ ] Wrap `MESSAGE_MOCK_MAP` access in a service function.
- [ ] Implement exact-match response retrieval.
- [ ] Implement fallback response that suggests known questions from mock keys.

## 4. Streaming and Markdown
- [ ] Add randomized response delay between 500ms and 1500ms.
- [ ] Implement typewriter/streaming assistant output.
- [ ] Render assistant markdown as HTML (library allowed, e.g. `markdown-it`).

## 5. Scroll Behavior
- [ ] Auto-scroll while AI updates only when user is at bottom.
- [ ] Stop auto-scroll when user scrolls up.
- [ ] Resume follow behavior when user returns to bottom.

## 6. Validation
- [ ] Verify behavior against Figma-aligned interaction flow.
- [ ] Verify close/reopen restores history in same session.
- [ ] Verify unmatched user inputs show suggestion fallback.
