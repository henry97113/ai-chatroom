## ADDED Requirements

### Requirement: Delayed welcome greeting on idle chat open
The system MUST display an assistant greeting message with exact text `Welcome to Nitra AI!` after a fixed 500ms delay when the chat widget opens and no user message has been sent in the current session.

#### Scenario: Greeting appears after fixed delay
- **WHEN** the user opens the chat widget in a session with zero user messages
- **THEN** the assistant greeting `Welcome to Nitra AI!` appears exactly 500ms after open

##### Example: Open-to-greeting timing
- **GIVEN** user message count is `0`
- **WHEN** chat opens at `t=0ms`
- **THEN** greeting is not visible before `t=500ms` and is visible at `t=500ms`

#### Scenario: Greeting is not duplicated in the same idle session
- **WHEN** a greeting message already exists in the current chat history and the user reopens the widget without sending a user message
- **THEN** the system does not append a second identical greeting message

### Requirement: Idle suggestion carousel before first user message
The system MUST display one idle suggestion item at the bottom of the messages area when zero user messages have been sent, and MUST rotate the displayed suggestion every 2 seconds.

#### Scenario: Carousel uses fixed approved options
- **WHEN** the idle suggestion carousel is active
- **THEN** the carousel uses only this fixed list:
  - `Upload your supplier list`
  - `Check if Avastin is in stock`
  - `Check if there's a better price for Xeomin`
  - `What are some generic options for Restylane`
  - `What's the best product for Xeomin`

#### Scenario: Carousel rotates in deterministic order every 2 seconds
- **WHEN** the idle suggestion carousel is active
- **THEN** exactly one suggestion is visible at a time
- **AND** the visible suggestion advances every 2000ms in list order and loops back to the first item after the last

##### Example: Rotation timeline
| Time | Visible suggestion |
| ---- | ------------------ |
| 0s | Upload your supplier list |
| 2s | Check if Avastin is in stock |
| 4s | Check if there's a better price for Xeomin |
| 6s | What are some generic options for Restylane |
| 8s | What's the best product for Xeomin |
| 10s | Upload your supplier list |

#### Scenario: Carousel stops after first user message
- **WHEN** the user sends the first user message
- **THEN** idle suggestion carousel content is hidden and no further 2-second rotation occurs
