# GitHub Profile Cards - Testing Strategy

This document outlines the testing strategy for the `github-profile-cards` monorepo, covering the core logic, React UI packages, and Web Components. The primary tools anticipated are Jest for test running/assertions and React Testing Library for UI testing, with MSW (Mock Service Worker) or Jest manual mocks for handling API requests.

## 1. Core Package (`packages/core`)

The core package contains business logic, type definitions, and API interactions. Testing here focuses on ensuring data is fetched, processed, and typed correctly.

### 1.1. `github-api.ts`

This file is responsible for direct communication with the GitHub API.

*   **`fetchGitHubData(username, token?)`**:
    *   **API Call Verification**:
        *   Mock `fetch` (e.g., using `jest.spyOn(global, 'fetch')` or MSW).
        *   Ensure it calls `https://api.github.com/users/{username}` for user data.
        *   Ensure it calls `https://api.github.com/users/{username}/repos?type=owner&sort=stars&direction=desc&per_page=10` for repository data.
    *   **Authentication**:
        *   Verify that the `Authorization: Bearer ${token}` header is included in `fetch` calls when a `token` is provided.
        *   Verify no `Authorization` header is sent if no `token` is provided.
    *   **Data Transformation/Return**:
        *   Provide mock successful JSON responses from `fetch`.
        *   Verify that `fetchGitHubData` returns a structured object `{ user: GitHubUser, repos: GitHubRepo[] }` matching the defined types (subset of full API response).
    *   **Error Handling**:
        *   Simulate API errors (e.g., 404, 500, network error).
        *   Verify `fetchGitHubData` returns `null` or throws an appropriate error (based on its designed error handling).
    *   **Caching**:
        *   After a successful call, make a second call with the same `username` and `token`.
        *   Verify that `fetch` is not called again for the cached data types (user, repos).
        *   Verify the cached data is returned.
        *   Test cache expiry if implemented (not explicitly in current version, but good to note).

*   **`fetchGenericGitHubAPI(url, token?)`**:
    *   **API Call Verification**:
        *   Mock `fetch`.
        *   Ensure it calls the exact `url` provided as an argument.
    *   **Authentication**:
        *   Verify `Authorization` header usage as with `fetchGitHubData`.
    *   **Data Return**:
        *   Verify it returns the JSON response directly.
    *   **Error Handling**:
        *   Simulate API errors.
        *   Verify it throws an error or returns a specific error object as designed.

### 1.2. `card-logic.ts`

This file contains functions for transforming raw API data into formats suitable for UI components. These are pure functions and should be straightforward to test.

*   **`getProfileSummary(user: GitHubUser)`**:
    *   Input: A mock `GitHubUser` object.
    *   Output: Verify the returned object is structured as `ProfileSummaryData` and contains the correct fields (avatar_url, name, login, bio, location, followers, html_url) extracted from the input.
*   **`getGitHubMetrics(user: GitHubUser, repos: GitHubRepo[])`**:
    *   Input: Mock `GitHubUser` and an array of mock `GitHubRepo` objects.
    *   Output: Verify the returned `GitHubMetricsData` object contains correctly calculated values (public_repos, followers, following, total_stars_on_top_repos).
*   **`getTopRepos(repos: GitHubRepo[])`**:
    *   Input: An array of mock `GitHubRepo` objects.
    *   Output: Verify the returned `TopReposData` (which is `{ repos: RepoDisplayData[] }`) contains correctly mapped repository information, including `id`, `name`, `description`, `stargazers_count`, `language`, `html_url`, and `forks_count`.
*   **`getLanguageUsageStats(repos: GitHubRepo[], fetchFn, token?)`**:
    *   **`fetchFn` Interaction**:
        *   Provide an array of mock `GitHubRepo` objects, each with a `languages_url`.
        *   Mock `fetchFn` (e.g., `jest.fn()`).
        *   Verify `getLanguageUsageStats` calls `fetchFn` for each repository's `languages_url`, passing the URL and token.
    *   **Data Aggregation**:
        *   Make the mock `fetchFn` return sample language data (e.g., `{"JavaScript": 1024, "TypeScript": 2048}`).
        *   Verify that `getLanguageUsageStats` correctly aggregates these byte counts across multiple repositories into the `LanguageStats` object (e.g., `{"JavaScript": totalBytes, "TypeScript": totalBytes}`).
    *   **Error Handling for `fetchFn`**:
        *   Simulate `fetchFn` throwing an error for one of the repositories.
        *   Verify that `getLanguageUsageStats` handles this gracefully (e.g., skips the failing repo, logs error) and still processes other repositories.

### 1.3. `card-types.ts`

These are TypeScript type definitions. Direct unit testing is not applicable. Their correctness is implicitly verified by the tests for functions and components that use them, as TypeScript's type checking will be active during test compilation and execution.

## 2. React UI Packages (`react-mantine`, `react-material`)

Testing for React components will use React Testing Library. The strategy is similar for both Mantine and Material UI packages, differing only in the specific components and props used.

For each component (e.g., `ProfileCard`, `LanguageUsageCard`, `RepoItemCard`, etc.):

*   **Rendering Tests**:
    *   Provide mock props, including pre-processed data where components expect it (e.g., `ProfileSummaryCard` expects `ProfileSummaryData`).
    *   Use React Testing Library's queries (`getByText`, `getByRole`, `findByTestId`, etc.) to verify:
        *   Key information is displayed (e.g., username, repository names, follower counts, language names).
        *   Avatars are rendered with correct `src` attributes.
        *   Links have correct `href` attributes.
    *   For `ProfileCard` and `ProfileCardMUI`: Test that each `variant` prop (`summary`, `metrics`, `repos`, `contributions`) results in the rendering of the corresponding content or child component.

*   **Data Fetching and State (for container components like `ProfileCard`, `LanguageUsageCard`)**:
    *   Mock the data fetching functions from `@github-profile-cards/core` (e.g., `fetchGitHubData`, `getLanguageUsageStats`, `fetchGenericGitHubAPI`) using `jest.mock()`.
    *   **Initial Load**: Verify that the component calls these mocked functions on mount (e.g., with `useEffect`).
    *   **Loading State**:
        *   Ensure the mocked functions initially don't resolve immediately.
        *   Verify that a loading indicator (e.g., a spinner, "Loading..." text) is displayed.
    *   **Error State**:
        *   Make the mocked functions return an error or `null`.
        *   Verify that an appropriate error message or error UI is displayed.
    *   **Successful Data Display**:
        *   Make the mocked functions return successful mock data.
        *   Use `waitFor` or `findBy*` queries from React Testing Library to ensure the component updates and displays the fetched data correctly.

*   **Interaction Tests (Simple)**:
    *   Primarily for links: verify `href` attributes are correct.
    *   If any interactive elements like buttons (e.g., "Retry" on error) are present, test their basic functionality.

*   **Specific Tests for `ProfileCard` / `ProfileCardMUI` Wrapper**:
    *   Verify that it correctly passes processed data to the appropriate child variant component (`ProfileSummaryCard`, `GitHubMetricsCard`, etc.) based on the `variant` prop. This involves checking that the child component receives the expected `variantData`.

## 3. Web Components Package (`packages/web-components`)

Testing Web Components can be done by appending them to the JSDOM environment provided by Jest, then interacting with their attributes and querying their Shadow DOM.

For each web component (e.g., `profile-card-wc`, `language-usage-card-wc`):

*   **Rendering Tests**:
    *   Create an instance of the component: `document.createElement('profile-card-wc')`.
    *   Set necessary attributes (e.g., `element.setAttribute('username', 'testuser')`).
    *   Append it to `document.body`.
    *   **Asynchronous Nature**: Data fetching and rendering inside web components are often asynchronous (within `connectedCallback` or `attributeChangedCallback`). Tests will need to use `async/await` and potentially wait for updates in the Shadow DOM (e.g., using MutationObserver or simple polling if necessary, though often direct checks after await suffice).
    *   Access the Shadow DOM: `element.shadowRoot`.
    *   Query elements within the Shadow DOM (e.g., `element.shadowRoot.querySelector('h2')`) to verify content.
    *   Test different `variant` attributes for `profile-card-wc` and check if the corresponding content is rendered.

*   **Data Fetching and Attribute Handling**:
    *   Mock `core` fetching functions as done for React components.
    *   **`connectedCallback`**: Verify it triggers data fetching when the element is added to the DOM.
    *   **`attributeChangedCallback`**:
        *   Change observed attributes (e.g., `username`, `variant`).
        *   Verify that it triggers a re-fetch and re-render.
    *   **Loading/Error States**:
        *   Similar to React components, check that loading indicators or error messages are rendered in the Shadow DOM when fetching is in progress or fails.
    *   **Successful Data Display**:
        *   Ensure the Shadow DOM is correctly populated after mock data is "fetched."

*   **Attribute Reflection (if applicable)**:
    *   If component properties are designed to reflect back to attributes (not common for these display-heavy components but possible), test this synchronization.

## 4. Mocking Strategy

*   **API Mocks**:
    *   **MSW (Mock Service Worker)** is the preferred approach for intercepting actual HTTP requests at the network level. This provides high-fidelity mocks and can be shared between Jest tests, Storybook, and even development environments.
    *   Alternatively, **Jest's manual mocks** (`jest.mock('./path/to/module')`) or `jest.spyOn(global, 'fetch')` can be used to mock `fetch` calls made by `github-api.ts`.
    *   The goal is to isolate tests from the actual GitHub API to ensure they are fast, deterministic, and don't hit rate limits.

*   **Mock Data Examples**:
    *   Define standardized mock objects for `GitHubUser`, `GitHubRepo`, `LanguageStats`, etc. These mocks should represent various scenarios (e.g., user with/without bio, repo with/without description, different language distributions).
    *   Example `GitHubUser` mock:
        ```javascript
        const mockUser = {
          login: 'testuser',
          avatar_url: 'https://example.com/avatar.png',
          name: 'Test User',
          bio: 'A passionate developer.',
          followers: 150,
          following: 30,
          public_repos: 25,
          location: 'City, Country',
          html_url: 'https://github.com/testuser',
        };
        ```
    *   Example `GitHubRepo` mock:
        ```javascript
        const mockRepo = {
          id: 123,
          name: 'test-repo',
          description: 'A repository for testing.',
          html_url: 'https://github.com/testuser/test-repo',
          stargazers_count: 42,
          language: 'TypeScript',
          languages_url: 'https://api.github.com/repos/testuser/test-repo/languages',
          forks_count: 5,
        };
        ```
    *   Example `LanguageStats` (from `languages_url` endpoint):
        ```javascript
        const mockRepoLanguages = {
          'TypeScript': 20480,
          'JavaScript': 10240,
          'HTML': 4096,
        };
        ```

This testing strategy aims for comprehensive coverage, from low-level API interactions to UI rendering and behavior, ensuring the reliability and correctness of the `github-profile-cards` suite.
