# @github-profile-cards/web-components

This package provides framework-agnostic Web Components for displaying GitHub profile information using data from `@github-profile-cards/core`.

## Components

The following custom elements are registered when this package is imported:

*   `profile-card-wc`: Displays various aspects of a GitHub profile.
    *   Attributes: `username`, `token` (optional), `variant` (summary, metrics, repos, contributions).
*   `language-usage-card-wc`: Displays language usage statistics for a user.
    *   Attributes: `username`, `token` (optional).
*   `single-repo-card-wc`: Displays details for a single repository (Note: data fetching for specific repo name is currently placeholder).
    *   Attributes: `username`, `repo-name`, `token` (optional).

## Installation

```bash
npm install @github-profile-cards/web-components @github-profile-cards/core
# or
yarn add @github-profile-cards/web-components @github-profile-cards/core
# or
pnpm add @github-profile-cards/web-components @github-profile-cards/core
```

## Usage

Import the package to register the web components. Then, you can use them in your HTML.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Web Components Demo</title>
  <script type="module">
    import '@github-profile-cards/web-components';
  </script>
</head>
<body>
  <profile-card-wc username="octocat" variant="summary"></profile-card-wc>
  <language-usage-card-wc username="octocat"></language-usage-card-wc>
</body>
</html>
```

You can set attributes dynamically using JavaScript:
```javascript
const profileCard = document.querySelector('profile-card-wc');
profileCard.setAttribute('username', 'anotheruser');
```

## License

MIT
