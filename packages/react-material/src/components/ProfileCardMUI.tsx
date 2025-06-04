import React, { useEffect, useState } from 'react';
import {
  fetchGitHubData,
  getProfileSummary,
  getGitHubMetrics,
  getTopRepos,
  type GitHubData,
  type ProfileCardProps,
  // Import error types
  NotFoundError,
  AuthenticationError,
  RateLimitError,
  GitHubAPIError,
} from '@github-profile-cards/core';
import { Card, CircularProgress, Typography, Alert } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

// Import specific MUI variant components
import { ProfileSummaryCardMUI } from './ProfileSummaryCardMUI';
import { GitHubMetricsCardMUI } from './GitHubMetricsCardMUI';
import { TopReposCardMUI } from './TopReposCardMUI';
import { ContributionCardMUI } from './ContributionCardMUI';

export const ProfileCardMUI: React.FC<ProfileCardProps> = ({ username, token, variant = 'summary' }) => {
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!username) {
        setError('GitHub username is required.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchGitHubData(username, token);
        if (fetchedData) {
          setGithubData(fetchedData);
        }
        // The `else` block that set a generic error is removed.
      } catch (err) {
        let message = 'An unknown error occurred while fetching profile data.';
        if (err instanceof NotFoundError) {
          message = `User '${username}' not found. Please check the username.`;
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
  }, [username, token]);

  if (loading) {
    return (
      <Card sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} sx={{ mr: 1 }} />
        <Typography>Loading profile...</Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" icon={<ErrorOutline fontSize="inherit" />}>
        {error}
      </Alert>
    );
  }

  if (!githubData) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography>No data available.</Typography>
      </Card>
    );
  }

  const commonCardProps = { username, token, variant };

  if (variant === 'summary') {
    const summaryData = getProfileSummary(githubData.user);
    return <ProfileSummaryCardMUI {...commonCardProps} variantData={summaryData} />;
  }

  if (variant === 'metrics') {
    const metricsData = getGitHubMetrics(githubData.user, githubData.repos);
    return <GitHubMetricsCardMUI {...commonCardProps} variantData={metricsData} />;
  }

  if (variant === 'repos') {
    const topReposData = getTopRepos(githubData.repos);
    return <TopReposCardMUI {...commonCardProps} variantData={topReposData} />;
  }

  if (variant === 'contributions') {
    return <ContributionCardMUI {...commonCardProps} />;
  }

  return (
    <Card sx={{ p: 2 }}>
      <Typography color="error">Invalid card variant specified: {variant}</Typography>
    </Card>
  );
};
