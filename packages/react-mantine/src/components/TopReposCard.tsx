import React from 'react';
import { Card, Text, Title } from '@mantine/core'; // Removed SimpleGrid, Anchor, and unused Alert
import type { ProfileCardProps, TopReposData } from '@github-profile-cards/core';
import { RepoGridCard } from './RepoGridCard'; // Use the dedicated grid display component

// This component now receives processed TopReposData (which is { repos: RepoDisplayData[] })
export const TopReposCard: React.FC<ProfileCardProps & { variantData?: TopReposData }> = ({ username, variantData }) => {
  if (!variantData || !variantData.repos || variantData.repos.length === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Top Repositories</Title>
        <Text>No repositories found for {username}.</Text>
      </Card>
    );
  }

  // RepoGridCard expects { repos: RepoDisplayData[] } which matches TopReposData
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} mb="md">Top Repositories</Title>
      <RepoGridCard repos={variantData.repos} />
    </Card>
  );
};
