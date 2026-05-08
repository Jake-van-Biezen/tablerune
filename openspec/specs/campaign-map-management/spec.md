## ADDED Requirements

### Requirement: DM can upload maps for a campaign
The system SHALL allow campaign DMs to upload map assets associated with their campaigns.

#### Scenario: DM uploads valid map file
- **WHEN** a DM uploads a supported map asset for a campaign they manage
- **THEN** the system SHALL store the file and create a campaign map record

#### Scenario: Non-DM attempts map upload
- **WHEN** a non-DM user attempts to upload a map to a campaign
- **THEN** the system MUST reject the upload request

### Requirement: Campaign members can access authorized maps
The system MUST restrict map access to users with membership in the associated campaign.

#### Scenario: Campaign member views map library
- **WHEN** a campaign member requests the campaign's map list
- **THEN** the system SHALL return maps for that campaign

#### Scenario: External user requests campaign map
- **WHEN** a user without campaign membership requests a campaign map
- **THEN** the system MUST deny map metadata and asset access
