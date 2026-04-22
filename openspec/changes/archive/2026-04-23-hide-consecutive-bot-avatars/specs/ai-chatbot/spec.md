## ADDED Requirements

### Requirement: Consecutive assistant messages show avatar only on the first message
The system MUST display the assistant avatar only on the first message of a consecutive group of assistant messages. Subsequent assistant messages in the same group MUST render a same-sized spacer element instead of the avatar to maintain horizontal alignment with the first message's bubble.

#### Scenario: Single assistant message shows avatar
- **WHEN** the message list contains a single assistant message (not preceded by another assistant message)
- **THEN** that message displays the assistant avatar

#### Scenario: First of consecutive assistant messages shows avatar
- **WHEN** the message list contains two or more consecutive assistant messages
- **THEN** the first assistant message in the group displays the assistant avatar

#### Scenario: Subsequent consecutive assistant messages show spacer
- **WHEN** the message list contains two or more consecutive assistant messages
- **THEN** every assistant message after the first in the group displays a spacer element instead of the avatar
- **AND** the spacer element occupies the same width as the avatar (24px) to keep bubble alignment consistent

#### Scenario: User message resets the avatar group
- **WHEN** a user message appears between two assistant messages
- **THEN** both assistant messages display the assistant avatar because they belong to separate groups

##### Example: Mixed message sequence

| Index | Role      | Previous Role | Shows Avatar |
| ----- | --------- | ------------- | ------------ |
| 0     | assistant | (none)        | yes          |
| 1     | assistant | assistant     | no           |
| 2     | user      | assistant     | N/A          |
| 3     | assistant | user          | yes          |
| 4     | assistant | assistant     | no           |
| 5     | assistant | assistant     | no           |
