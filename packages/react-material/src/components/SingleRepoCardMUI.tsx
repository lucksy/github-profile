import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import type { RepoCardProps, GitHubRepo, RepoDisplayData } from '@github-profile-cards/core';
import {
  fetchSingleRepo,
  NotFoundError,
  AuthenticationError,
  RateLimitError,
  GitHubAPIError,
} from '@github-profile-cards/core';
import { RepoItemCardMUI } from './RepoItemCardMUI';

export const SingleRepoCardMUI: React.FC<RepoCardProps> = ({ username, repoName, token }) => {
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
        if (fetchedRepo) {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
        <CircularProgress size={24} sx={{ mr: 1 }} />
        <Typography>Loading repository...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" icon={<ErrorOutline fontSize="inherit" />}>
        {error}
      </Alert>
    );
  }

  if (!repoData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Repository: {repoName}
          </Typography>
          <Alert severity="warning" icon={<ErrorOutline fontSize="inherit" />}>
            Repository data for {username}/{repoName} could not be loaded.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Map GitHubRepo to RepoDisplayData for RepoItemCardMUI
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
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Repository: {repoData.name}
        </Typography>
        <RepoItemCardMUI repo={displayData} />
      </CardContent>
    </Card>
  );
};
