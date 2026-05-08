## ADDED Requirements

### Requirement: DM can create and manage campaigns
The system SHALL allow authenticated users with DM role to create campaigns and manage campaign metadata.

#### Scenario: DM creates a campaign
- **WHEN** an authenticated DM submits valid campaign details
- **THEN** the system SHALL create a campaign and assign the creator as campaign DM

#### Scenario: Non-DM attempts campaign creation
- **WHEN** a user without DM permissions attempts to create a campaign
- **THEN** the system MUST reject the operation

### Requirement: Campaign membership is role-based
The system MUST enforce role-scoped campaign membership using explicit member records.

#### Scenario: Player joins via valid invitation
- **WHEN** a player accepts a valid invitation to a campaign
- **THEN** the system SHALL add the user as a `player` campaign member

#### Scenario: User accesses campaign without membership
- **WHEN** a user requests campaign data for a campaign they are not a member of
- **THEN** the system MUST deny access to campaign resources
