# GitHub Profile Cards Monorepo

This project provides a suite of components to display GitHub profile information in various web frameworks and as standalone Web Components. It fetches data from the GitHub API and renders it in configurable card-style UIs.

## Features

*   Display user profile summaries (avatar, bio, followers, etc.).
*   Show key metrics (public repos, stars on top repos, etc.).
*   List top repositories for a user.
*   Visualize language usage statistics.
*   Display information for a single repository.
*   Placeholder for contribution data/graph.
*   Components available for:
    *   React with Mantine UI
    *   React with Material UI (MUI)
    *   Framework-agnostic Web Components
*   In-memory caching for GitHub API responses.
*   Configurable via attributes (Web Components) or props (React).

## Monorepo Structure

This project is a monorepo managed with pnpm workspaces. Key packages include:

*   `packages/core`: Contains the core logic for fetching and processing GitHub data, type definitions, and API interaction utilities.
*   `packages/react-mantine`: Provides React components styled with [Mantine UI](https://mantine.dev/).
*   `packages/react-material`: Provides React components styled with [Material UI (MUI)](https://mui.com/).
*   `packages/web-components`: Provides framework-agnostic Web Components (Custom Elements).
*   `apps/`: Contains demo applications for each framework implementation.
    *   `apps/mantine-demo`
    *   `apps/material-demo`
    *   `apps/web-demo`

## Installation

### For Development (Cloning the Monorepo)

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/github-profile-cards-monorepo.git # Replace with actual repo URL
    cd github-profile-cards-monorepo
    ```
2.  Install dependencies using pnpm:
    ```bash
    pnpm install
    ```
3.  Build all packages:
    ```bash
    pnpm run build
    ```

### For Consuming Packages

Each UI package can be installed separately from NPM (once published). For example:

*   **Core Logic (typically a dependency of other packages):**
    ```bash
    npm install @github-profile-cards/core
    # or
    pnpm add @github-profile-cards/core
    ```

*   **React Mantine Components:**
    ```bash
    npm install @github-profile-cards/react-mantine @github-profile-cards/core @mantine/core react react-dom
    # or
    pnpm add @github-profile-cards/react-mantine @github-profile-cards/core @mantine/core react react-dom
    ```
    *(Ensure you also have `@mantine/hooks` and `@tabler/icons-react` if using all features, as they are peer dependencies of `@github-profile-cards/react-mantine`)*

*   **React Material UI Components:**
    ```bash
    npm install @github-profile-cards/react-material @github-profile-cards/core @mui/material @emotion/react @emotion/styled react react-dom
    # or
    pnpm add @github-profile-cards/react-material @github-profile-cards/core @mui/material @emotion/react @emotion/styled react react-dom
    ```

*   **Web Components:**
    ```bash
    npm install @github-profile-cards/web-components @github-profile-cards/core
    # or
    pnpm add @github-profile-cards/web-components @github-profile-cards/core
    ```

## Usage Examples

Replace `your-username` with the GitHub username you want to display. You can also provide a GitHub Personal Access Token (PAT) via the `token` prop/attribute for higher API rate limits or to access private data (if the token has permissions).

### React Mantine (`@github-profile-cards/react-mantine`)

```tsx
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ProfileCard, LanguageUsageCard, SingleRepoCard } from '@github-profile-cards/react-mantine';
import '@mantine/core/styles.css'; // Don't forget Mantine base styles

function MyMantineApp() {
  const username = "octocat";
  // const token = "YOUR_GITHUB_TOKEN"; // Optional

  return (
    <MantineProvider defaultColorScheme="auto">
      {/* Profile Summary */}
      <ProfileCard username={username} variant="summary" />

      {/* Profile Metrics */}
      <ProfileCard username={username} variant="metrics" />

      {/* Top Repositories */}
      <ProfileCard username={username} variant="repos" />

      {/* Contributions (Placeholder) */}
      <ProfileCard username={username} variant="contributions" />

      {/* Language Usage Stats */}
      <LanguageUsageCard username={username} />

      {/* Single Repository Card */}
      <SingleRepoCard username={username} repoName="Spoon-Knife" />
    </MantineProvider>
  );
}

export default MyMantineApp;
```

### React Material UI (`@github-profile-cards/react-material`)

```tsx
import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ProfileCardMUI, LanguageUsageCardMUI, SingleRepoCardMUI } from '@github-profile-cards/react-material';

const theme = createTheme(); // Your MUI theme

function MyMaterialApp() {
  const username = "mui";
  // const token = "YOUR_GITHUB_TOKEN"; // Optional

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Profile Summary */}
      <ProfileCardMUI username={username} variant="summary" />

      {/* Top Repositories */}
      <ProfileCardMUI username={username} variant="repos" />

      {/* Language Usage Stats */}
      <LanguageUsageCardMUI username={username} />

      {/* Single Repository Card */}
      <SingleRepoCardMUI username={username} repoName="material-ui" />
    </ThemeProvider>
  );
}

export default MyMaterialApp;
```

### Web Components (`@github-profile-cards/web-components`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Web Components Demo</title>
  <script type="module">
    // This registers the custom elements
    import '@github-profile-cards/web-components';
  </script>
  <style>
    body { font-family: sans-serif; padding: 20px; display: grid; gap: 20px; }
    profile-card-wc, language-usage-card-wc, single-repo-card-wc {
      border: 1px solid #ccc; padding: 1em; border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>Web Components GitHub Cards</h1>

  <!-- Profile Summary -->
  <profile-card-wc username="webcomponents" variant="summary"></profile-card-wc>

  <!-- Top Repositories -->
  <profile-card-wc username="webcomponents" variant="repos"></profile-card-wc>

  <!-- Language Usage -->
  <language-usage-card-wc username="webcomponents"></language-usage-card-wc>

  <!-- Single Repository -->
  <single-repo-card-wc username="webcomponents" repo-name="gold-standard"></single-repo-card-wc>

  <script>
    // Example of dynamically setting attributes
    // const token = "YOUR_GITHUB_TOKEN"; // Optional
    // document.querySelectorAll('profile-card-wc, language-usage-card-wc, single-repo-card-wc').forEach(card => {
    //   if (token) card.setAttribute('token', token);
    // });
  </script>
</body>
</html>
```

## GitHub Token (GITHUB_TOKEN)

To avoid hitting GitHub API rate limits, especially during development or for users with many repositories (affecting language stats), you can provide a GitHub Personal Access Token (PAT).

*   **For React Components**: Pass the token via the `token` prop.
*   **For Web Components**: Set the `token` attribute.
*   **For Core Functions**: Pass the token as an argument.

The core library's `fetchGitHubData` and `fetchGenericGitHubAPI` functions will use this token in the `Authorization` header. In Node.js environments, they can also pick up a `GITHUB_TOKEN` environment variable as a fallback if no token is directly provided. **However, client-side code (React, Web Components in the browser) should always rely on the explicitly passed `token` prop/attribute, as environment variables are not directly accessible in the browser.** Do not hardcode tokens directly into your client-side application code that gets committed to repositories.

## Development

1.  **Install Dependencies**: `pnpm install`
2.  **Build all packages**: `pnpm run build` (or `pnpm run -r build`)
3.  **Run Demo Applications**:
    *   `pnpm --filter @github-profile-cards/mantine-demo dev`
    *   `pnpm --filter @github-profile-cards/material-demo dev`
    *   `pnpm --filter @github-profile-cards/web-demo dev`
4.  **Running Tests (Placeholder for future)**:
    *   `pnpm test` (This would run tests in all packages if configured)

See `TESTING_STRATEGY.md` for details on the planned testing approach.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
