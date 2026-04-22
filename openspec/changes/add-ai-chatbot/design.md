# Design: AI Chatroom Widget

## Architecture
The chatroom is mounted at layout level so it remains available across routes and preserves in-memory conversation state during navigation.

### Primary pieces
- `MainLayout` integration:
  - floating "Ask Nitra AI" trigger
  - chatroom container overlay/panel
- Chat state module/composable (JavaScript):
  - `isOpen`
  - `messages` (ordered conversation entries)
  - input and response lifecycle state (`isThinking`, `isStreaming`)
- Mock AI service function:
  - receives user message text
  - checks exact match against `MESSAGE_MOCK_MAP`
  - returns mapped assistant content or fallback suggestion content

## Data Model
Each message record should include:
- `id`: unique identifier
- `role`: `user` or `assistant`
- `content`: source text (assistant content in markdown form)
- `renderedHtml` (assistant only): html converted from markdown
- `status` (assistant only): `thinking`, `streaming`, `done`
- `createdAt`: timestamp for ordering

## Response Lifecycle
1. User sends prompt.
2. User message is appended.
3. Assistant placeholder is appended with content `thinking...`.
4. Wait random delay in the interval `[500, 1500]` ms.
5. Resolve assistant full markdown content from mock service.
6. Stream content into assistant message with typewriter effect.
7. Convert streamed markdown to HTML continuously (or in small buffered steps) for display.
8. Mark message as `done`.

## Matching and Fallback Strategy
- Exact key lookup against `MESSAGE_MOCK_MAP`.
- If not found:
  - return a friendly assistant response that says the question is not in mock data.
  - include several suggested prompts sourced from map keys.

## Markdown Rendering
- Use a markdown parser (for example `markdown-it`) to convert assistant markdown content to HTML.
- Render assistant bubble from trusted generated HTML in a controlled output area.

## Scroll Management
Track whether the user is currently at bottom:
- `isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold`
- recommended threshold: small value (for example 16-24px)

Behavior:
- If `isAtBottom` is true when thinking/stream updates occur, auto-scroll to bottom.
- If user scrolls up so `isAtBottom` becomes false, suspend auto-scroll immediately.
- Auto-scroll may resume once user returns to bottom.

## UX Notes From Figma
- Bottom-right floating trigger button text: "Ask Nitra AI".
- Chatroom includes top-right close control.
- Close action hides panel only; it must not clear `messages`.

## Risks and Mitigations
- Risk: jittery markdown render while streaming.
  - Mitigation: update in short intervals and debounce DOM-heavy work if needed.
- Risk: auto-scroll fighting user intent.
  - Mitigation: strict gating on `isAtBottom`.
- Risk: exact-match lookup feels brittle.
  - Mitigation: clear fallback guidance with suggested supported questions.
