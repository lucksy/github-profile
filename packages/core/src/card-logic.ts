import type { GitHubUser, GitHubRepo, LanguageStats, ProfileSummaryData, GitHubMetricsData, TopReposData } from './card-types';
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
  return repos.map(repo => ({
    // Map to the fields expected by RepoDisplayData, which TopReposData uses.
    // id is not in RepoDisplayData, so it's removed if TopReposData strictly follows RepoGridDisplayData -> RepoDisplayData.
    // However, TopReposData was originally defined as Array<Pick<GitHubRepo, 'name' | 'description' | 'stargazers_count' | 'language' | 'html_url' | 'id'>>;
    // The current card-types.ts has TopReposData = RepoGridDisplayData, and RepoGridDisplayData.repos is Array<RepoDisplayData>.
    // RepoDisplayData now includes id.
    id: repo.id,
    name: repo.name,
    description: repo.description,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count, // forks_count is in GitHubRepo and RepoDisplayData
    language: repo.language,
    html_url: repo.html_url,
  }));
  // Since TopReposData is an alias for RepoGridDisplayData, the return type should be { repos: Array<RepoDisplayData> }
  return { repos: mappedRepos };
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
      try {
        const repoLanguages = await fetchFn(repo.languages_url, token);
        for (const [lang, bytes] of Object.entries(repoLanguages)) {
          aggregatedLanguageStats[lang] = (aggregatedLanguageStats[lang] || 0) + bytes;
        }
      } catch (error) {
        console.error(`Error fetching languages for repo ${repo.name}:`, error);
        // Optionally, continue to next repo or handle error differently
      }
    }
  }
  return aggregatedLanguageStats;
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
