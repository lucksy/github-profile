import type { GitHubData, GitHubRepo } from './github-api';
import type { ProfileSummaryData, GitHubMetricsData, LanguageUsageStat, TopReposData } from './card-types';

/**
 * Extracts and returns data needed for the Profile Summary Card.
 */
export function getProfileSummary(data: GitHubData): ProfileSummaryData {
  return {
    avatar_url: data.user.avatar_url,
    name: data.user.name,
    login: data.user.login,
    bio: data.user.bio,
    location: data.user.location,
    followers: data.user.followers,
    html_url: data.user.html_url,
  };
}

/**
 * Extracts and returns data for the GitHub Metrics Card.
 */
export function getGitHubMetrics(data: GitHubData): GitHubMetricsData {
  const total_stars_on_top_repos = data.repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  return {
    public_repos: data.user.public_repos,
    followers: data.user.followers,
    following: data.user.following,
    total_stars_on_top_repos,
  };
}

/**
 * Processes repository data for the Top Repos Card.
 * For now, this function selects specific fields.
 */
export function getTopReposData(repos: GitHubRepo[]): TopReposData {
  return repos.map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    stargazers_count: repo.stargazers_count,
    language: repo.language,
    html_url: repo.html_url,
  }));
}


/**
 * Calculates language usage statistics from a list of repositories.
 * Note: This currently relies on the primary `language` field of each repo.
 * Common language colors can be added here or by the UI components.
 */
export function getLanguageUsage(repos: GitHubRepo[]): LanguageUsageStat[] {
  const langStats: Record<string, { count: number }> = {};

  for (const repo of repos) {
    if (repo.language) {
      if (!langStats[repo.language]) {
        langStats[repo.language] = { count: 0 };
      }
      langStats[repo.language].count++;
    }
  }

  const sortedLangStats = Object.entries(langStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([language, { count }]) => ({
      language,
      count,
      // Basic color mapping - can be expanded or moved to UI
      color: getLanguageColor(language),
    }));

  return sortedLangStats;
}

/**
 * Provides a basic color for known languages.
 * This is a simplified version; a more comprehensive mapping might be needed.
 */
function getLanguageColor(language: string): string | undefined {
  const colors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C#': '#178600',
    'C++': '#f34b7d',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Swift': '#F05138',
    'Kotlin': '#A97BFF',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Shell': '#89e051',
    'Rust': '#dea584',
    'Scala': '#c22d40',
    // Add more as needed
  };
  return colors[language];
}
