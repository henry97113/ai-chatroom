# Proposal: Add AI Chatroom Widget

## Summary
Add an "AI chatroom" experience that users can open from a floating "Ask Nitra AI" button at the bottom-right of the app. The chatroom supports mock AI responses, simulated response delay, streaming/typewriter output, markdown rendering, and controlled auto-scroll behavior.

## Why
- Provide an in-app assistant entry point consistent with the provided Figma design.
- Enable feature development without backend dependency by using local mock data.
- Improve perceived responsiveness and realism through thinking state, delay simulation, and streaming output.

## Scope
- Add a floating trigger button visible from the main app layout.
- Add a chatroom panel that can be opened/closed without losing session history.
- Implement a mock AI response layer backed by `src/mock/messages.js`.
- Handle unmatched user prompts by suggesting supported questions.
- Render assistant markdown as HTML.
- Simulate AI response lifecycle:
  - `thinking...` state
  - randomized delay between 500ms and 1500ms
  - streamed/typewriter output
- Implement conditional auto-scroll:
  - keep auto-scroll only when user is at bottom
  - stop auto-scroll when user scrolls upward

## Out of Scope
- Real API/network integration.
- Persistent storage across page refresh/browser restart.
- Authentication, rate limiting, or analytics.

## Success Criteria
- Behavior matches accepted scenarios in `specs/ai-chatbot/spec.md`.
- Chat history is preserved across open/close cycles in the same app session.
- UX interaction follows the approved Figma direction.
