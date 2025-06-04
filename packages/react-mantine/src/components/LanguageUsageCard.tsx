import React, { useState, useEffect } from 'react';
import {
  LanguageUsageProps,
  LanguageStats,
  fetchGitHubData,
  getLanguageUsageStats,
  fetchGenericGitHubAPI,
  getLanguageColor, // Import from core
  // Import error types
  NotFoundError,
  AuthenticationError,
  RateLimitError,
  GitHubAPIError,
} from '@github-profile-cards/core';
import { Card, Text, Progress, Group, Title, Stack, Loader, Alert } from '@mantine/core';

export const LanguageUsageCard: React.FC<LanguageUsageProps> = ({ username, token }) => {
  const [languageStats, setLanguageStats] = useState<LanguageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!username) return;
      setLoading(true);
      setError(null);
      try {
        const githubData = await fetchGitHubData(username, token);
        if (githubData && githubData.repos) {
          const stats = await getLanguageUsageStats(githubData.repos, fetchGenericGitHubAPI, token);
          setLanguageStats(stats);
        }
        // The `else` block that set a generic error is removed.
        // If fetchGitHubData throws an error (e.g. NotFoundError for the user),
        // it will be caught by the catch block below.
      } catch (err) {
        let message = 'An unknown error occurred while fetching language data.';
        if (err instanceof NotFoundError) {
          // This could be from fetchGitHubData or getLanguageUsageStats if a repo's language URL 404s
          message = `Could not find user '${username}' or required repository data.`;
        } else if (err instanceof AuthenticationError) {
          message = 'Authentication failed. Please check your GitHub token if provided.';
        } else if (err instanceof RateLimitError) {
          message = 'Rate limit exceeded. Please try again later.';
        } else if (err instanceof GitHubAPIError) { // Covers errors from fetchGitHubData and getLanguageUsageStats
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
    return <Loader />;
  }

  if (error) {
    return <Alert color="red" title="Error">{error}</Alert>;
  }

  if (!languageStats || Object.keys(languageStats).length === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Language Usage</Title>
        <Text>No language data to display.</Text>
      </Card>
    );
  }

  const totalBytes = Object.values(languageStats).reduce((acc, bytes) => acc + bytes, 0);
  if (totalBytes === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Language Usage</Title>
        <Text>No language byte data to display (total is zero).</Text>
      </Card>
    );
  }

  // Sort languages by usage and take top N or filter by percentage
  const sortedLanguages = Object.entries(languageStats)
    .sort(([, aBytes], [, bBytes]) => bBytes - aBytes)
    .slice(0, 10); // Display top 10 languages, for example

  const progressSections = sortedLanguages.map(([lang, bytes]) => ({
    value: (bytes / totalBytes) * 100,
    color: getLanguageColor(lang) || '#CCCCCC', // Use core's color mapping
    label: lang,
    tooltip: `${lang}: ${((bytes / totalBytes) * 100).toFixed(1)}% (${bytes.toLocaleString()} bytes)`,
  }));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} mb="xl">Language Usage</Title>
      <Progress.Root size="xl" mb="lg">
        {progressSections.map(section => (
          <Progress.Section
            key={section.label}
            value={section.value}
            color={section.color}
            // tooltip={section.tooltip} // Removed invalid prop
          />
        ))}
      </Progress.Root>
      <Stack gap="xs">
        {progressSections.map(section => (
          // If tooltips are desired per section, they should wrap this Group or Text
          <Group key={section.label} gap="xs">
            <div style={{ width: 10, height: 10, backgroundColor: section.color, borderRadius: '50%' }} />
            <Text size="sm">{section.label} ({section.value.toFixed(1)}%) {/* section.tooltip can be used here or in a Mantine Tooltip */}</Text>
          </Group>
        ))}
      </Stack>
    </Card>
  );
};
