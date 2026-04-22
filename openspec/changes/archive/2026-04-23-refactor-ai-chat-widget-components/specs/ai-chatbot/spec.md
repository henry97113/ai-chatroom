## ADDED Requirements

### Requirement: Modular chat widget composition
The system MUST structure AI chat widget implementation into focused UI components and dedicated composables for interaction orchestration, while preserving all existing user-facing behavior in this specification.

#### Scenario: UI sections are componentized
- **WHEN** maintainers inspect the chat widget source implementation
- **THEN** header, launcher button, message list/row rendering, and composer input sections are implemented as dedicated component files instead of a single monolithic template

#### Scenario: Orchestration concerns are extracted
- **WHEN** maintainers inspect chat logic implementation
- **THEN** message lifecycle orchestration (thinking/streaming flow, markdown rendering, and message mutation) and idle timer orchestration (welcome delay and suggestion rotation) are implemented in composable modules with explicit lifecycle control

#### Scenario: Runtime behavior parity is preserved
- **WHEN** users interact with the refactored widget
- **THEN** open/close behavior, in-memory message persistence, greeting delay, idle carousel rotation/stop conditions, simulated assistant delay, streaming markdown rendering, and conditional auto-scroll continue to satisfy the existing `ai-chatbot` requirements
