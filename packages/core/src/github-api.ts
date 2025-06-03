import type { GitHubUser, GitHubRepo } from '../src/card-types';

// Define the structure of the data returned by fetchGitHubData
export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
  // We can add more fields here later, like language details per repo if fetched.
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

  // --- Fetch User Repositories (Top 10 by stars) ---
  const reposCacheKey = `repos_${username}`;
  const cachedRepos = cache.get(reposCacheKey);
  let repos: GitHubRepo[] = [];

  if (cachedRepos && Date.now() - cachedRepos.timestamp < CACHE_DURATION_MS) {
    repos = cachedRepos.data as GitHubRepo[];
    console.log(`Cache hit for repos: ${username}`);
  } else {
    try {
      // Fetching top 10 repositories sorted by stars (stargazers is an alias for stars)
      // Using `sort=stars` and `direction=desc` for clarity, though stargazers is often used.
      const reposUrl = `${GITHUB_API_BASE_URL}/users/${username}/repos?type=owner&sort=stars&direction=desc&per_page=10`;
      const reposResponse = await fetch(reposUrl, { headers });

      if (!reposResponse.ok) {
        console.error(`Error fetching repos for ${username}: ${reposResponse.status} ${await reposResponse.text()}`);
        // For now, return user data with empty repos array if repos fetch fails
      } else {
        // The fetched repo data will have more fields than our GitHubRepo type.
        // TypeScript will allow this assignment as long as GitHubRepo's fields are present.
        repos = await reposResponse.json() as GitHubRepo[];
        cache.set(reposCacheKey, { data: repos, timestamp: Date.now() });
        console.log(`Fetched repos for: ${username} from API`);
      }
    } catch (error) {
      console.error(`Network or other error fetching repos for ${username}:`, error);
      // Return user data with empty repos array in case of network error
    }
  }

  return {
    user,
    repos,
  };
}

/**
 * A generic fetch utility for making authenticated GitHub API requests.
 * @param url The full URL to fetch.
 * @param token Optional GitHub personal access token.
 * @returns Promise<T> The JSON response body.
 * @throws Will throw an error if the network response is not ok.
 */
export async function fetchGenericGitHubAPI<T>(
  url: string,
  token?: string
): Promise<T> {
  const apiToken = token || process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Error fetching ${url}: ${response.status} ${errorBody}`);
    throw new Error(`GitHub API request failed: ${response.status} - ${url}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches data for a single repository.
 * @param owner The owner of the repository.
 * @param repoName The name of the repository.
 * @param token Optional GitHub personal access token.
 * @returns Promise<GitHubRepo> The repository data.
 */
export async function fetchSingleRepo(
  owner: string,
  repoName: string,
  token?: string
): Promise<GitHubRepo | null> {
  if (!owner || !repoName) {
    console.error('Repository owner and name are required.');
    return null;
  }

  const repoUrl = `${GITHUB_API_BASE_URL}/repos/${owner}/${repoName}`;
  const cacheKey = `repo_${owner}_${repoName}`;

  const cachedRepo = cache.get(cacheKey);
  if (cachedRepo && Date.now() - cachedRepo.timestamp < CACHE_DURATION_MS) {
    console.log(`Cache hit for repo: ${owner}/${repoName}`);
    return cachedRepo.data as GitHubRepo;
  }

  try {
    const repoData = await fetchGenericGitHubAPI<GitHubRepo>(repoUrl, token);
    cache.set(cacheKey, { data: repoData, timestamp: Date.now() });
    console.log(`Fetched repo: ${owner}/${repoName} from API`);
    return repoData;
  } catch (error) {
    console.error(`Error fetching single repo ${owner}/${repoName}:`, error);
    return null;
  }
}
