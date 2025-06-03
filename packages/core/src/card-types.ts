// Define core GitHub data structures

export interface GitHubUser {
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
  login: string;
  name: string | null;
  public_repos: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null; // Primary language
  languages_url: string; // URL to fetch language breakdown
  forks_count: number; // Added this as it's often useful for repo cards
}

// Removed GitHubData import for now, will see if it's needed.

/**
 * Props for a card displaying a summary of a GitHub user's profile.
 */
export interface ProfileCardProps {
  username: string;
  token?: string;
  /**
   * Determines the specific type of profile information to display.
   * - `summary`: Basic info like avatar, name, bio, location, followers.
 * - `repos`: A list or grid of the user's most popular repositories.
 * - `contributions`: Data related to user's contribution activity (placeholder for now).
   */
  variant?: 'summary' | 'repos' | 'contributions';
}

/**
 * Input props for fetching data for a single repository.
 */
export interface RepoCardProps {
  username: string;
  repoName: string;
  token?: string;
}

/**
 * Props for displaying a single repository's details.
 */
export interface RepoDisplayData {
  id: number; // Added for React keys and general identification
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
}

/**
 * Props for displaying a grid of multiple GitHub repositories.
 */
export interface RepoGridDisplayData {
  /** An array of GitHubRepo objects or relevant subsets for display. */
  repos: Array<RepoDisplayData>; // Use RepoDisplayData for consistency
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
export interface LanguageUsageProps {
  username: string;
  token?: string;
}

/**
 * Represents aggregated language statistics for a user.
 * Keys are language names, values are the number of bytes or projects.
 */
export interface LanguageStats {
  [language: string]: number;
}

/**
 * Represents contribution statistics for a user.
 * This is a placeholder and would need further definition based on available GitHub data.
 */
export interface ContributionStats {
  total_contributions_last_year?: number;
  // Potentially detailed breakdown by date or repository.
}


// --- Data types for processed card data (some were already here) ---

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
// or a simple Pick like in RepoGridDisplayData.
export type TopReposData = RepoGridDisplayData; // TopReposData can alias RepoGridDisplayData
