## Context

`AiChatWidget.vue` currently mixes UI structure, message-list rendering, markdown formatting, input handling, assistant response orchestration, timer lifecycle, and scroll-follow behavior in a single component. The file is large enough that small edits require scanning many unrelated concerns. We need to separate responsibilities without changing the current user-facing behavior defined by `ai-chatbot` requirements.

## Goals / Non-Goals

**Goals:**

- Decompose the widget into focused UI components with clear props/events boundaries.
- Move stateful orchestration logic into composables so presentation stays easy to read.
- Preserve existing behavior parity: open/close semantics, greeting/carousel timing, thinking/streaming lifecycle, markdown rendering, and conditional auto-scroll.
- Keep migration low-risk by preserving existing CSS class names and incremental wiring.

**Non-Goals:**

- Redesigning chat visuals or copy.
- Introducing backend integration, persistence, or API contract changes.
- Changing response timing constants or idle suggestion content.

## Decisions

### Decision: Split panel UI into small presentational components

- Choice: Create focused components for header, launcher button, message list, message row, and composer input section.
- Rationale: This reduces template complexity in `AiChatWidget.vue` and isolates markup/CSS ownership for each section.
- Alternatives considered:
  - Keep one component and only reorder sections: rejected because complexity remains centralized.
  - Split only messages and keep rest in parent: rejected because header/composer/launcher still create a large mixed template.

### Decision: Move chat orchestration into a session composable

- Choice: Create `useAiChatSession` as the single source for chat state and message lifecycle (`sendMessage`, streaming, message creation/removal, markdown rendering, response delay).
- Rationale: Separates business flow from view concerns, improves testability of pure logic paths, and keeps child components stateless.
- Alternatives considered:
  - Vuex/Pinia store: rejected as unnecessary for a widget-local state scope.
  - Keep logic inside parent component: rejected because maintenance cost remains high.

### Decision: Isolate idle greeting/carousel timers in a dedicated composable

- Choice: Create `useIdleSuggestionCarousel` to own welcome timeout and idle rotation interval with explicit `start`, `stop`, and cleanup APIs.
- Rationale: Timer lifecycle is error-prone and orthogonal to rendering; isolating it prevents leaks and race regressions.
- Alternatives considered:
  - Combine timers into `useAiChatSession`: rejected to avoid one large composable with mixed responsibilities.
  - Keep timer logic in parent SFC: rejected because this is the main source of current coupling.

### Decision: Keep behavior parity via compatibility-oriented integration

- Choice: Parent widget composes child components/composables and preserves current event flow plus current class names used by scoped styles.
- Rationale: Behavior parity and style parity minimize regression risk during refactor.
- Alternatives considered:
  - Rename CSS classes while refactoring: rejected because it increases visual regression surface.
  - Introduce feature flags for new structure: rejected as unnecessary overhead for a local component refactor.

## Risks / Trade-offs

- [Prop/event wiring mistakes between parent and child components] → Mitigation: keep contracts minimal and map one behavior at a time.
- [Timer cleanup regressions after extraction] → Mitigation: centralize cleanup in composable and call it from close/open/unmount paths.
- [Auto-scroll behavior drift after message list extraction] → Mitigation: keep scroll container ownership and near-bottom calculation in one place with unchanged thresholds.
- [CSS scope breakage across component boundaries] → Mitigation: preserve class names and migrate only styles that belong to each child component.
