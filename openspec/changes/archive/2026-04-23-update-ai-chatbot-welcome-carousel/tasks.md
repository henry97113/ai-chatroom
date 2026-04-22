## 1. Greeting Behavior

- [x] 1.1 Implement Requirement: Delayed welcome greeting on idle chat open in `src/components/AiChatWidget.vue` with fixed 500ms delay (Est: 20m)
- [x] 1.2 Implement Decision: Gate welcome greeting by first-user-message state and prevent duplicate welcome message entries on reopen (Est: 20m)
- [x] 1.3 Add/adjust assistant message initialization helper logic so greeting insertion respects existing in-memory history (Est: 20m)

## 2. Idle Carousel Behavior

- [x] 2.1 Implement Requirement: Idle suggestion carousel before first user message with the approved 5-item fixed copy list at the bottom of the messages area (Est: 25m)
- [x] 2.2 Implement Decision: Keep idle carousel as a fixed-order, fixed-interval rotator that advances every 2000ms and loops deterministically (Est: 20m)
- [x] 2.3 Hide and stop carousel behavior immediately after the first user message is sent in the session (Est: 20m)

## 3. Timer Lifecycle and Verification

- [x] 3.1 Implement Decision: Use explicit timer lifecycle and teardown rules for welcome timeout and carousel interval on close, reopen, and unmount (Est: 25m)
- [x] 3.2 Verify timing and stop-condition flows against spec examples: greeting at 500ms, 2-second rotation timeline, and post-first-message stop behavior (Est: 25m)
