## ADDED Requirements

### Requirement: DM can view party-wide player state
The system SHALL provide DMs with a campaign dashboard showing player character health and inventory summaries.

#### Scenario: DM opens campaign dashboard
- **WHEN** a DM loads a campaign dashboard
- **THEN** the system SHALL return health and inventory summaries for all player characters in that campaign

#### Scenario: Player attempts DM dashboard access
- **WHEN** a non-DM campaign member requests DM-only party summary views
- **THEN** the system MUST deny access to DM-only views

### Requirement: DM can record party-level state updates
The system SHALL allow DMs to record updates to party-visible health and item status as part of campaign management.

#### Scenario: DM records state correction
- **WHEN** a DM applies a correction to a character's tracked health or item state
- **THEN** the system SHALL persist the change and associate it with the campaign context

#### Scenario: DM updates non-member character
- **WHEN** a DM attempts to modify a character outside campaigns they manage
- **THEN** the system MUST reject the update
