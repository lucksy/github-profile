import React, { useEffect, useState } from 'react';
import { Loader, Alert, Title, Paper } from '@mantine/core';
import type { RepoCardProps, GitHubRepo, RepoDisplayData } from '@github-profile-cards/core';
import {
  fetchSingleRepo,
  NotFoundError,
  AuthenticationError,
  RateLimitError,
  GitHubAPIError,
} from '@github-profile-cards/core';
import { RepoItemCard } from './RepoItemCard';

export const SingleRepoCard: React.FC<RepoCardProps> = ({ username, repoName, token }) => {
  const [repoData, setRepoData] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!username || !repoName) {
        setError('Username and Repository Name are required.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchedRepo = await fetchSingleRepo(username, repoName, token);
        if (fetchedRepo) { // This check can remain or be removed if confident
          setRepoData(fetchedRepo);
        }
        // The `else` block that set a generic error is removed.
      } catch (err) {
        let message = 'An unknown error occurred while fetching repository data.';
        if (err instanceof NotFoundError) {
          message = `Repository '${username}/${repoName}' not found. Please check the names.`;
        } else if (err instanceof AuthenticationError) {
          message = 'Authentication failed. Please check your GitHub token if provided.';
        } else if (err instanceof RateLimitError) {
          message = 'Rate limit exceeded. Please try again later.';
        } else if (err instanceof GitHubAPIError) {
          message = `API Error: ${err.message}`;
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username, repoName, token]);

  if (loading) {
    return (
      <Paper withBorder p="md" style={{ textAlign: 'center' }}>
        <Loader />
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert color="red" title="Error loading repository">
        {error}
      </Alert>
    );
  }

  if (!repoData) {
    return (
      <Paper withBorder p="md">
         <Title order={4} mb="sm">Repository: {repoName}</Title>
        <Alert color="yellow" title="Not Found">
          Repository data for {username}/{repoName} could not be loaded.
        </Alert>
      </Paper>
    );
  }

  // Map GitHubRepo to RepoDisplayData for RepoItemCard
  const displayData: RepoDisplayData = {
    id: repoData.id,
    name: repoData.name,
    description: repoData.description,
    stargazers_count: repoData.stargazers_count,
    forks_count: repoData.forks_count,
    language: repoData.language,
    html_url: repoData.html_url,
  };

  return (
    <Paper withBorder p="md">
      <Title order={4} mb="sm">Repository: {repoData.name}</Title>
      <RepoItemCard repo={displayData} />
    </Paper>
  );
};
