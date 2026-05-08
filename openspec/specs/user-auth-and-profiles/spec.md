## ADDED Requirements

### Requirement: Users authenticate with Supabase identity
The system MUST authenticate users through Supabase Auth before allowing access to campaign or character data.

#### Scenario: Unauthenticated user attempts protected access
- **WHEN** a user without a valid session requests a protected Tablerune route
- **THEN** the system SHALL deny access and require authentication

#### Scenario: Authenticated user starts a session
- **WHEN** a user completes a supported Supabase sign-in flow
- **THEN** the system SHALL establish an authenticated session for subsequent authorized requests

### Requirement: User profile is created and retrievable
The system SHALL maintain a profile record for each authenticated user, including display identity and app role preferences.

#### Scenario: First login creates profile
- **WHEN** an authenticated user has no existing profile record
- **THEN** the system SHALL create a new profile linked to the user identity

#### Scenario: User profile is loaded for app shell
- **WHEN** an authenticated user loads the application shell
- **THEN** the system SHALL return the user's profile details for role-aware navigation and context
