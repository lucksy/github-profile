import React from 'react';
import type { RepoGridCardProps as CoreRepoGridCardProps, GitHubRepo } from '@github-profile-cards/core';
import { SimpleGrid, Text } from '@mantine/core';
import { RepoCard } from './RepoCard'; // Assuming RepoCardProps from core matches what RepoCard expects

export type RepoGridCardProps = CoreRepoGridCardProps;

export const RepoGridCard: React.FC<RepoGridCardProps> = ({ repos }) => {
  if (!repos || repos.length === 0) {
    return <Text>No repositories to display.</Text>;
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3 }}
      spacing="md"
    >
      {repos.map((repo) => (
        <RepoCard
          key={repo.id}
          repo={repo}
        />
      ))}
    </SimpleGrid>
  );
};
