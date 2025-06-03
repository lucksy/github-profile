# @github-profile-cards/react-material

This package provides React components built with Material UI (MUI) for displaying GitHub profile information using data from `@github-profile-cards/core`.

## Components

*   `ProfileCardMUI`: Displays various aspects of a GitHub profile (summary, metrics, repositories, contributions) based on a `variant` prop.
*   `LanguageUsageCardMUI`: Displays language usage statistics for a user.
*   `SingleRepoCardMUI`: Displays details for a single repository (Note: data fetching for specific repo name is currently placeholder).
*   And more helper components like `RepoGridCardMUI`, `RepoItemCardMUI`.

## Installation

```bash
npm install @github-profile-cards/react-material @github-profile-cards/core @mui/material @emotion/react @emotion/styled react react-dom
# or
yarn add @github-profile-cards/react-material @github-profile-cards/core @mui/material @emotion/react @emotion/styled react react-dom
# or
pnpm add @github-profile-cards/react-material @github-profile-cards/core @mui/material @emotion/react @emotion/styled react react-dom
```

Ensure you have set up MUI's `ThemeProvider` and `CssBaseline` in your application.

## Usage

```tsx
import { ProfileCardMUI } from '@github-profile-cards/react-material';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme();

function MyApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProfileCardMUI username="octocat" variant="summary" />
    </ThemeProvider>
  );
}

export default MyApp;
```

## License

MIT
