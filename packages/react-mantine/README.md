# @github-profile-cards/react-mantine

This package provides React components built with Mantine UI for displaying GitHub profile information using data from `@github-profile-cards/core`.

## Components

*   `ProfileCard`: Displays various aspects of a GitHub profile (summary, metrics, repositories, contributions) based on a `variant` prop.
*   `LanguageUsageCard`: Displays language usage statistics for a user.
*   `SingleRepoCard`: Displays details for a single repository (Note: data fetching for specific repo name is currently placeholder).
*   And more helper components like `RepoGridCard`, `RepoItemCard`.

## Installation

```bash
npm install @github-profile-cards/react-mantine @github-profile-cards/core @mantine/core react react-dom
# or
yarn add @github-profile-cards/react-mantine @github-profile-cards/core @mantine/core react react-dom
# or
pnpm add @github-profile-cards/react-mantine @github-profile-cards/core @mantine/core react react-dom
```

Ensure you have set up Mantine's `MantineProvider` in your application.

## Usage

```tsx
import { ProfileCard } from '@github-profile-cards/react-mantine';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

function MyApp() {
  return (
    <MantineProvider>
      <ProfileCard username="octocat" variant="summary" />
    </MantineProvider>
  );
}

export default MyApp;
```

## License

MIT
