import type { GitHubUser, GitHubRepo } from '../src/card-types';

// Custom Error Classes
export class GitHubAPIError extends Error {
  constructor(message: string, public status?: number, public url?: string) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export class NetworkError extends GitHubAPIError {
  constructor(message: string, url?: string) {
    super(message, undefined, url);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends GitHubAPIError {
  constructor(message: string, status: number, url?: string) {
    super(message, status, url);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends GitHubAPIError {
  constructor(message: string, status: number, url?: string) {
    super(message, status, url);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends GitHubAPIError {
  constructor(message: string, status: number, url?: string, public resetTime?: Date) {
    super(message, status, url);
    this.name = 'RateLimitError';
  }
}

export class InvalidRequestError extends GitHubAPIError {
  constructor(message: string, status?: number, url?: string) {
    super(message, status, url);
    this.name = 'InvalidRequestError';
  }
}


// Define the structure of the data returned by fetchGitHubData
export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
  // We can add more fields here later, like language details per repo if fetched.
}

// Basic In-Memory Cache
// Define a union type for all possible data types stored in the cache
type CachedData = GitHubUser | GitHubRepo | GitHubRepo[] | Record<string, number>;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<CachedData>>();
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
    throw new InvalidRequestError('GitHub username is required.');
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
  const cachedUserEntry = cache.get(userCacheKey);
  let user: GitHubUser | null = null;

  if (cachedUserEntry && Date.now() - cachedUserEntry.timestamp < CACHE_DURATION_MS) {
    user = cachedUserEntry.data as GitHubUser;
    // console.log(`Cache hit for user: ${username}`); // Optional: keep for debugging
  } else {
    const userUrl = `${GITHUB_API_BASE_URL}/users/${username}`;
    try {
      const userResponse = await fetch(userUrl, { headers });
      if (!userResponse.ok) {
        const status = userResponse.status;
        const errorText = await userResponse.text();
        if (status === 404) {
          throw new NotFoundError(`User ${username} not found. ${errorText}`, status, userUrl);
        } else if (status === 401 || status === 403) {
          throw new AuthenticationError(`Authentication failed for user ${username}. ${errorText}`, status, userUrl);
        } else if (status === 429) {
          throw new RateLimitError(`Rate limit exceeded for user ${username}. ${errorText}`, status, userUrl);
        } else if (status === 400) {
          throw new InvalidRequestError(`Invalid request for user ${username}. ${errorText}`, status, userUrl);
        } else {
          throw new GitHubAPIError(`Error fetching user ${username}: ${status} ${errorText}`, status, userUrl);
        }
      }
      user = await userResponse.json() as GitHubUser;
      cache.set(userCacheKey, { data: user, timestamp: Date.now() });
      // console.log(`Fetched user: ${username} from API`); // Optional: keep for debugging
    } catch (error: any) {
      if (error instanceof GitHubAPIError) {
        throw error; // Re-throw custom errors
      }
      // Assume other errors are network errors
      throw new NetworkError(`Network error fetching user ${username}: ${error.message}`, userUrl);
    }
  }

  // No need for `if (!user) return null;` as errors are now thrown.

  // --- Fetch User Repositories (Top 10 by stars) ---
  const reposCacheKey = `repos_${username}`;
  const cachedReposEntry = cache.get(reposCacheKey);
  let repos: GitHubRepo[] = [];

  if (cachedReposEntry && Date.now() - cachedReposEntry.timestamp < CACHE_DURATION_MS) {
    repos = cachedReposEntry.data as GitHubRepo[];
    // console.log(`Cache hit for repos: ${username}`); // Optional: keep for debugging
  } else {
    const reposUrl = `${GITHUB_API_BASE_URL}/users/${username}/repos?type=owner&sort=stars&direction=desc&per_page=10`;
    try {
      const reposResponse = await fetch(reposUrl, { headers });

      if (!reposResponse.ok) {
        const status = reposResponse.status;
        const errorText = await reposResponse.text();
        if (status === 404) { // Less likely for repos if user exists, but possible
          throw new NotFoundError(`Repos not found for user ${username}. ${errorText}`, status, reposUrl);
        } else if (status === 401 || status === 403) {
          throw new AuthenticationError(`Authentication failed fetching repos for ${username}. ${errorText}`, status, reposUrl);
        } else if (status === 429) {
          throw new RateLimitError(`Rate limit exceeded fetching repos for ${username}. ${errorText}`, status, reposUrl);
        } else if (status === 400) {
          throw new InvalidRequestError(`Invalid request for repos of user ${username}. ${errorText}`, status, reposUrl);
        } else {
          throw new GitHubAPIError(`Error fetching repos for ${username}: ${status} ${errorText}`, status, reposUrl);
        }
      }
      repos = await reposResponse.json() as GitHubRepo[];
      cache.set(reposCacheKey, { data: repos, timestamp: Date.now() });
      // console.log(`Fetched repos for: ${username} from API`); // Optional: keep for debugging
    } catch (error: any) {
      if (error instanceof GitHubAPIError) {
        throw error; // Re-throw custom errors
      }
      // Assume other errors are network errors
      throw new NetworkError(`Network error fetching repos for ${username}: ${error.message}`, reposUrl);
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

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const status = response.status;
      const errorBody = await response.text(); // Read body once
      // Determine reset time for RateLimitError if headers are available
      let resetTime: Date | undefined;
      if (status === 429) {
        const rateLimitResetHeader = response.headers.get('X-RateLimit-Reset');
        if (rateLimitResetHeader) {
          resetTime = new Date(parseInt(rateLimitResetHeader, 10) * 1000);
        }
      }

      switch (status) {
        case 401:
        case 403:
          throw new AuthenticationError(`Authentication failed: ${errorBody}`, status, url);
        case 404:
          throw new NotFoundError(`Resource not found: ${errorBody}`, status, url);
        case 429:
          throw new RateLimitError(`Rate limit exceeded: ${errorBody}`, status, url, resetTime);
        case 400:
          throw new InvalidRequestError(`Invalid request: ${errorBody}`, status, url);
        default:
          throw new GitHubAPIError(`GitHub API request failed: ${status} ${errorBody}`, status, url);
      }
    }
    return response.json() as Promise<T>;
  } catch (error: any) {
    if (error instanceof GitHubAPIError) {
      throw error; // Re-throw known API errors
    }
    // Assume other errors (e.g.,TypeError from fetch itself for network issues) are NetworkErrors
    throw new NetworkError(`Network error for ${url}: ${error.message}`, url);
  }
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
    throw new InvalidRequestError('Repository owner and name are required.');
  }

  const repoUrl = `${GITHUB_API_BASE_URL}/repos/${owner}/${repoName}`;
  const cacheKey = `repo_${owner}_${repoName}`;

  const cachedRepoEntry = cache.get(cacheKey);
  if (cachedRepoEntry && Date.now() - cachedRepoEntry.timestamp < CACHE_DURATION_MS) {
    // console.log(`Cache hit for repo: ${owner}/${repoName}`); // Optional
    return cachedRepoEntry.data as GitHubRepo;
  }

  // No specific try-catch here as fetchGenericGitHubAPI now throws structured errors
  // Let them propagate up.
  const repoData = await fetchGenericGitHubAPI<GitHubRepo>(repoUrl, token);
  cache.set(cacheKey, { data: repoData, timestamp: Date.now() });
  // console.log(`Fetched repo: ${owner}/${repoName} from API`); // Optional
  return repoData;
}
