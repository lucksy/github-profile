import React from 'react';
import { Card, Text, SimpleGrid, Title } from '@mantine/core';
import type { ProfileCardProps, GitHubMetricsData } from '@github-profile-cards/core';

// This component now receives processed data for the metrics variant
export const GitHubMetricsCard: React.FC<ProfileCardProps & { variantData?: GitHubMetricsData }> = ({ username, variantData }) => {
  if (!variantData) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text>No metrics data available for {username}.</Text>
      </Card>
    );
  }

  const { public_repos, followers, following, total_stars_on_top_repos } = variantData;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} mb="md">GitHub Metrics</Title>
      <SimpleGrid cols={2} spacing="md">
        <Text>Public Repos: {public_repos?.toLocaleString()}</Text>
        <Text>Followers: {followers?.toLocaleString()}</Text>
        <Text>Following: {following?.toLocaleString()}</Text>
        <Text>Stars on Top Repos: {total_stars_on_top_repos?.toLocaleString()}</Text>
      </SimpleGrid>
    </Card>
  );
};
