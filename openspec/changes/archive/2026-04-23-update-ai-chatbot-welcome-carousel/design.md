## Context

The existing `ai-chatbot` widget opens with an empty conversation area and waits for user input. The new requirement adds pre-conversation assistant behavior: (1) a delayed greeting message and (2) a rotating idle suggestion strip shown only before the first user message. The widget currently preserves in-memory chat history across close/reopen within the same session, so new behaviors must respect that state and avoid duplicate noise.

## Goals / Non-Goals

**Goals:**

- Display `Welcome to Nitra AI!` as an assistant message 500ms after opening when no user message has been sent in the current session.
- Display one idle suggestion at the bottom of the messages area and rotate through approved copy every 2 seconds while the conversation is still user-idle.
- Stop idle suggestion behavior as soon as the first user message is sent.
- Keep behavior deterministic and testable with explicit timing and stop conditions.

**Non-Goals:**

- Changing backend response behavior or API integration.
- Replacing the existing mock response map semantics.
- Persisting greeting/carousel state across browser reloads.

## Decisions

### Decision: Gate welcome greeting by first-user-message state

- Choice: Emit the greeting only when chat opens in a session where `userMessageCount === 0`.
- Rationale: This avoids duplicate welcome bubbles after the conversation has started while preserving current history behavior.
- Alternatives considered:
  - Always emit greeting on every open: rejected because repeated opens spam the transcript.
  - Emit greeting only once per app load regardless of user activity: rejected because reopening after hard close in an idle session would miss expected onboarding.

### Decision: Keep idle carousel as a fixed-order, fixed-interval rotator

- Choice: Use a fixed list of 5 approved strings and rotate one visible item every 2000ms in order, looping.
- Rationale: Deterministic behavior simplifies QA and ensures copy fidelity to approved content.
- Alternatives considered:
  - Random rotation: rejected due to flaky verification and inconsistent user experience.
  - Multi-item list display: rejected because the design target shows one-item-at-a-time prompt behavior.

### Decision: Use explicit timer lifecycle and teardown rules

- Choice: Manage welcome-delay timer and carousel interval independently with strict cleanup on close/unmount and state transitions.
- Rationale: Prevents leaked timers, duplicate emissions, and race conditions when users rapidly open/close/send.
- Alternatives considered:
  - Shared interval for all timing behavior: rejected because greeting and carousel have different triggers and stop conditions.
  - CSS-only animation without reactive state: rejected because logic still needs behavioral gating on user-message state.

## Risks / Trade-offs

- [Rapid open/close race] → Mitigation: clear pending greeting timeout on close and before scheduling a new one.
- [Carousel keeps running after first user message] → Mitigation: central guard condition (`hasUserMessage`) checked before each rotation tick and on message send.
- [Visual clutter in short sessions] → Mitigation: hide carousel immediately after first user message; greeting appears once per idle session.
