## ADDED Requirements

### Requirement: Player can create and maintain campaign characters
The system SHALL allow players to create and update characters within campaigns where they are members.

#### Scenario: Player creates character in joined campaign
- **WHEN** a player submits valid character details (including race and class/spec) for a joined campaign
- **THEN** the system SHALL create a character owned by that player in that campaign

#### Scenario: Player updates character story details
- **WHEN** a player edits background story or character decision history
- **THEN** the system SHALL persist the updated character narrative fields

### Requirement: Character health and items are tracked
The system MUST maintain current health and inventory item state for each character.

#### Scenario: Player updates character health
- **WHEN** a player records health changes for their character
- **THEN** the system SHALL store the updated health values for that character

#### Scenario: Player manages inventory items
- **WHEN** a player adds, updates, or removes inventory items for their character
- **THEN** the system SHALL persist the resulting inventory state
