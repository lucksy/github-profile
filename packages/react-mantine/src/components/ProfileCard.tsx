import React, { useEffect, useState } from 'react';
import {
  fetchGitHubData,
  getProfileSummary,
  getGitHubMetrics,
  getTopRepos, // Updated import
  type GitHubData,
  type ProfileCardProps, // Use directly from core
  // Import specific data types if needed for casting or intermediate variables
  type ProfileSummaryData,
  type GitHubMetricsData,
  type TopReposData,
  // Import error types
  NotFoundError,
  AuthenticationError,
  RateLimitError,
  GitHubAPIError,
} from '@github-profile-cards/core';
import { Card, Loader, Alert, Text, Group } from '@mantine/core'; // Added Group
import { IconAlertCircle } from '@tabler/icons-react';

// Import the new specific components
import { ProfileSummaryCard } from './ProfileSummaryCard';
import { GitHubMetricsCard } from './GitHubMetricsCard';
import { TopReposCard } from './TopReposCard';
import { ContributionCard } from './ContributionCard';

export const ProfileCard: React.FC<ProfileCardProps> = ({ username, token, variant = 'summary' }) => {
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
        // Since fetchGitHubData now throws errors or returns data,
        // we only need to set data if the call succeeds.
        // The null check for fetchedData before setting state is no longer strictly necessary
        // if fetchGitHubData guarantees non-null on success, but it doesn't hurt.
        if (fetchedData) { // This check can remain for safety or be removed if confident
          setGithubData(fetchedData);
        }
        // The `else` block that set a generic error is removed because specific errors are now caught.
      } catch (err) {
        let message = 'An unknown error occurred while fetching profile data.';
        if (err instanceof NotFoundError) {
          message = `User '${username}' not found. Please check the username.`;
        } else if (err instanceof AuthenticationError) {
          message = 'Authentication failed. Please check your GitHub token if provided.';
        } else if (err instanceof RateLimitError) {
          message = 'Rate limit exceeded. Please try again later.';
        } else if (err instanceof GitHubAPIError) { // Catch other specific API errors
          message = `API Error: ${err.message}`;
        } else if (err instanceof Error) {
          message = err.message; // Fallback for other JS errors
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
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="center">
          <Loader />
          <Text>Loading profile...</Text>
        </Group>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" radius="md">
        {error}
      </Alert>
    );
  }

  if (!githubData) {
    return ( // This case might be hit briefly or if setError was called without data
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text>No data available.</Text>
      </Card>
    );
  }

  // Pass the original props (username, token, variant) along, plus the processed data
  const commonCardProps = { username, token, variant };

  if (variant === 'summary') {
    const summaryData = getProfileSummary(githubData.user);
    return <ProfileSummaryCard {...commonCardProps} variantData={summaryData} />;
  }

  if (variant === 'metrics') {
    const metricsData = getGitHubMetrics(githubData.user, githubData.repos);
    return <GitHubMetricsCard {...commonCardProps} variantData={metricsData} />;
  }

  if (variant === 'repos') { // Updated from 'top-repos'
    const topReposData = getTopRepos(githubData.repos); // Use getTopRepos
    return <TopReposCard {...commonCardProps} variantData={topReposData} />;
  }

  if (variant === 'contributions') {
    // ContributionCard currently shows a placeholder, so no specific data needed from here yet.
    return <ContributionCard {...commonCardProps} />;
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text c="red">Invalid card variant specified: {variant}</Text>
    </Card>
  );
};
