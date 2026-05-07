# Tablerune

Tablerune is a comprehensive tool for Tabletop RPG (TTRPG) players and Dungeon Masters (DMs). It aims to streamline the experience of managing characters and campaigns, allowing everyone to focus on the story.

## Features

### For Players
- **Character Management**: Create and maintain detailed character profiles.
- **Stat Tracking**: Keep track of health, items, and resources in real-time.
- **Narrative Support**: Document backstories and record key decisions made throughout the journey.

### For Dungeon Masters
- **Campaign Management**: Create and organize multiple campaigns effortlessly.
- **Player Integration**: Invite players to join campaigns and manage their involvement.
- **Live Tracking**: Monitor player stats and progress to ensure a smooth game flow.
- **Interactive Maps (Upcoming)**: A future feature to create and manage tactical maps for encounters.

## Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Testing**: [Vitest](https://vitest.dev/) (Unit/Component) & [Playwright](https://playwright.dev/) (E2E)

## Getting Started

### Prerequisites

Ensure you have [pnpm](https://pnpm.io/installation) installed.

### Installation

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

### Building

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Project Structure

- `src/lib`: Core logic and reusable components.
- `src/routes`: SvelteKit pages and layouts.
- `static`: Static assets like images and fonts.
- `playwright.config.ts`: E2E testing configuration.
- `vitest.config.ts`: Unit and component testing configuration.
