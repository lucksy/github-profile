import type { GitHubUser, GitHubRepo, LanguageStats, ProfileSummaryData, GitHubMetricsData, TopReposData, RepoDisplayData } from './card-types';
// LanguageUsageStat might be replaced by LanguageStats depending on the outcome of getLanguageUsageStats

/**
 * Extracts and returns data needed for the Profile Summary Card.
 */
export function getProfileSummary(user: GitHubUser): ProfileSummaryData {
  return {
    avatar_url: user.avatar_url,
    name: user.name,
    login: user.login,
    bio: user.bio,
    location: user.location,
    followers: user.followers,
    html_url: user.html_url,
  };
}

/**
 * Extracts and returns data for the GitHub Metrics Card.
 */
export function getGitHubMetrics(user: GitHubUser, repos: GitHubRepo[]): GitHubMetricsData {
  const total_stars_on_top_repos = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  return {
    public_repos: user.public_repos,
    followers: user.followers,
    following: user.following,
    total_stars_on_top_repos,
  };
}

/**
 * Processes repository data for the Top Repos Card.
 * This function maps the raw repo data to the fields defined in TopReposData (via RepoDisplayData).
 */
export function getTopRepos(repos: GitHubRepo[]): TopReposData {
  const mappedReposArray: RepoDisplayData[] = repos.map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    language: repo.language,
    html_url: repo.html_url,
  }));
  return { repos: mappedReposArray };
}


/**
 * Calculates language usage statistics from a list of repositories.
 * This version will fetch detailed language data for each repository.
 * Common language colors can be added here or by the UI components.
 */
export async function getLanguageUsageStats(
  repos: GitHubRepo[],
  fetchFn: (url: string, token?: string) => Promise<Record<string, number>>,
  token?: string
): Promise<LanguageStats> {
  const aggregatedLanguageStats: LanguageStats = {};

  for (const repo of repos) {
    if (repo.languages_url) {
      // Removed try-catch as per no-useless-catch. Errors from fetchFn will propagate.
      const repoLanguages = await fetchFn(repo.languages_url, token);
      for (const [lang, bytes] of Object.entries(repoLanguages)) {
        aggregatedLanguageStats[lang] = (aggregatedLanguageStats[lang] || 0) + bytes;
      }
    }
  }
  return aggregatedLanguageStats;
}

/**
 * Provides a basic color for known languages.
 * This is a simplified version; a more comprehensive mapping might be needed.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
