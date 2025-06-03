import React, { useEffect, useState } from 'react';
import {
  fetchGitHubData,
  getProfileSummary,
  getGitHubMetrics,
  getTopReposData,
  type GitHubData,
  type ProfileSummaryData,
  type GitHubMetricsData,
  type TopReposData,
  type ProfileCardProps as CoreProfileCardProps, // Renaming to avoid conflict if we define a local variant
} from '@github-profile-cards/core';
import { Card, Avatar, Text, Group, Loader, Alert, SimpleGrid, List, Anchor, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

// Re-exporting or re-defining to ensure it's part of this package's API if needed,
// or just use CoreProfileCardProps directly in consuming apps.
export type ProfileCardProps = CoreProfileCardProps;

export const ProfileCard: React.FC<ProfileCardProps> = ({ username, token, variant = 'summary' }) => {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchGitHubData(username, token);
        if (fetchedData) {
          setData(fetchedData);
        } else {
          setError('User not found or an error occurred.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadData();
    } else {
      setError('GitHub username is required.');
      setLoading(false);
    }
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
      <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
        {error}
      </Alert>
    );
  }

  if (!data) {
    return null; // Or some other placeholder
  }

  if (variant === 'summary') {
    const summary = getProfileSummary(data);
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group wrap="nowrap">
          <Avatar src={summary.avatar_url} size={94} radius="md" />
          <div>
            <Text fz="lg" fw={500} mt="md">
              {summary.name || summary.login}
            </Text>
            {summary.name && <Text fz="xs" c="dimmed">{summary.login}</Text>}
            <Text fz="xs" c="dimmed" mt={4}>
              {summary.location || 'Location not specified'}
            </Text>
          </div>
        </Group>
        <Text mt="sm" mb="md" c="dimmed" fz="sm">
          {summary.bio || 'No bio available.'}
        </Text>
        <Group justify="space-apart" mt="md">
          <Text fz="sm">Followers: {summary.followers}</Text>
          {/* Add more summary details if needed */}
        </Group>
         <Anchor href={summary.html_url} target="_blank" fz="sm" mt="sm">
          View Profile on GitHub
        </Anchor>
      </Card>
    );
  }

  if (variant === 'metrics') {
    const metrics = getGitHubMetrics(data);
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">GitHub Metrics</Title>
        <SimpleGrid cols={2}>
          <Text>Public Repos: {metrics.public_repos}</Text>
          <Text>Followers: {metrics.followers}</Text>
          <Text>Following: {metrics.following}</Text>
          <Text>Stars on Top Repos: {metrics.total_stars_on_top_repos}</Text>
        </SimpleGrid>
      </Card>
    );
  }

  if (variant === 'top-repos') {
    const topRepos = getTopReposData(data.repos);
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
         <Title order={4} mb="md">Top Repositories</Title>
        {topRepos.length > 0 ? (
          <List spacing="xs" size="sm">
            {topRepos.map((repo) => (
              <List.Item key={repo.id}>
                <Anchor href={repo.html_url} target="_blank">
                  {repo.name}
                </Anchor>
                {repo.description && <Text size="xs" c="dimmed">{repo.description}</Text>}
                <Group gap="xs">
                    <Text size="xs">Stars: {repo.stargazers_count}</Text>
                    {repo.language && <Text size="xs">Lang: {repo.language}</Text>}
                </Group>
              </List.Item>
            ))}
          </List>
        ) : (
          <Text>No repositories found.</Text>
        )}
      </Card>
    );
  }

  return <Text>Invalid card variant specified.</Text>;
};
