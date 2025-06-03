// Interfaces for GitHub API data
export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepoOwner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface GitHubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubRepoOwner;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
    node_id: string;
  } | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
}

// Basic In-Memory Cache
interface CacheEntry {
  data: any;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const GITHUB_API_BASE_URL = 'https://api.github.com';

/**
 * Fetches GitHub user profile and top repository data.
 *
 * @param username The GitHub username.
 * @param token Optional GitHub personal access token for authenticated requests.
 * @returns A structured object containing the fetched data or null if an error occurs.
 */
export async function fetchGitHubData(
  username: string,
  token?: string
): Promise<GitHubData | null> {
  if (!username) {
    console.error('GitHub username is required.');
    return null;
  }

  const apiToken = token || process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }

  // --- Fetch User Profile ---
  const userCacheKey = `user_${username}`;
  const cachedUser = cache.get(userCacheKey);
  let user: GitHubUser | null = null;

  if (cachedUser && Date.now() - cachedUser.timestamp < CACHE_DURATION_MS) {
    user = cachedUser.data as GitHubUser;
    console.log(`Cache hit for user: ${username}`);
  } else {
    try {
      const userResponse = await fetch(`${GITHUB_API_BASE_URL}/users/${username}`, { headers });
      if (userResponse.status === 404) {
        console.error(`User ${username} not found.`);
        return null;
      }
      if (!userResponse.ok) {
        console.error(`Error fetching user ${username}: ${userResponse.status} ${await userResponse.text()}`);
        // Potentially handle rate limits more specifically here
        return null;
      }
      user = await userResponse.json() as GitHubUser;
      cache.set(userCacheKey, { data: user, timestamp: Date.now() });
      console.log(`Fetched user: ${username} from API`);
    } catch (error) {
      console.error(`Network or other error fetching user ${username}:`, error);
      return null;
    }
  }

  if (!user) return null; // Should not happen if logic is correct, but as a safeguard.

  // --- Fetch User Repositories (Top 5 by stars) ---
  const reposCacheKey = `repos_${username}`;
  const cachedRepos = cache.get(reposCacheKey);
  let repos: GitHubRepo[] = [];

  if (cachedRepos && Date.now() - cachedRepos.timestamp < CACHE_DURATION_MS) {
    repos = cachedRepos.data as GitHubRepo[];
    console.log(`Cache hit for repos: ${username}`);
  } else {
    try {
      // Fetching top 5 repositories sorted by stars
      const reposResponse = await fetch(`${GITHUB_API_BASE_URL}/users/${username}/repos?type=owner&sort=stargazers&per_page=5&direction=desc`, { headers });
      if (!reposResponse.ok) {
        console.error(`Error fetching repos for ${username}: ${reposResponse.status} ${await reposResponse.text()}`);
        // Don't return null for the whole thing if repos fail, maybe return partial data?
        // For now, we'll return what we have (user data) and empty repos or handle as error.
        // To keep it simple, if repos fail, we'll consider it a partial failure for now.
      } else {
        repos = await reposResponse.json() as GitHubRepo[];
        cache.set(reposCacheKey, { data: repos, timestamp: Date.now() });
        console.log(`Fetched repos for: ${username} from API`);
      }
    } catch (error) {
      console.error(`Network or other error fetching repos for ${username}:`, error);
      // As above, decide on error handling strategy.
    }
  }

  return {
    user,
    repos,
  };
}
