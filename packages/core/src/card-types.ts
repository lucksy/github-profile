import type { GitHubUser, GitHubRepo, GitHubData } from './github-api';

/**
 * Props for a card displaying a summary of a GitHub user's profile.
 */
export interface ProfileCardProps {
  username: string;
  token?: string;
  /**
   * Determines the specific type of profile information to display.
   * - `summary`: Basic info like avatar, name, bio, location, followers.
   * - `metrics`: Key statistics like public repos, followers, total stars on top repos, following.
   * - `top-repos`: A list or grid of the user's most popular repositories.
   */
  variant?: 'summary' | 'metrics' | 'top-repos'; // Removed 'contributions' for now as it requires more complex data
}

/**
 * Props for a card displaying information about a single GitHub repository.
 */
export interface RepoCardProps {
  /** The full GitHubRepo object or a relevant subset. */
  repo: Pick<GitHubRepo, 'name' | 'description' | 'stargazers_count' | 'forks_count' | 'language' | 'html_url'>;
}

/**
 * Props for a card displaying a grid of multiple GitHub repositories.
 */
export interface RepoGridCardProps {
  /** An array of GitHubRepo objects or relevant subsets. */
  repos: Array<Pick<GitHubRepo, 'id' | 'name' | 'description' | 'stargazers_count' | 'forks_count' | 'language' | 'html_url'>>;
}

/**
 * Represents the usage statistics for a single programming language.
 */
export interface LanguageUsageStat {
  language: string;
  count: number;
  /** A representative color for the language (e.g., hex code). */
  color?: string; // Color can be added later or by the UI component
}

/**
 * Props for a card displaying language usage statistics derived from a user's repositories.
 */
export interface LanguageUsageCardProps {
  /** An array of GitHubRepo objects from which to derive language statistics. */
  repos: GitHubRepo[]; // Needs full repo objects if we are to rely on `language` field.
}


// --- Data types for processed card data ---

export interface ProfileSummaryData {
  avatar_url: string;
  name: string | null;
  login: string;
  bio: string | null;
  location: string | null;
  followers: number;
  html_url: string;
}

export interface GitHubMetricsData {
  public_repos: number;
  followers: number;
  following: number;
  total_stars_on_top_repos: number; // Sum of stargazers_count from the fetched top repos
  // contributions_last_year: number; // This would require more complex data fetching
}

// LanguageUsageStat is already defined above and will be used for language usage data.

// TopReposData would likely be GitHubRepo[] or a Pick<...> version of it.
// For now, we assume the raw `data.repos` from `fetchGitHubData` is used directly,
// or a simple Pick like in RepoGridCardProps.
export type TopReposData = Array<Pick<GitHubRepo, 'name' | 'description' | 'stargazers_count' | 'language' | 'html_url' | 'id'>>;
