import React from 'react';
// CoreRepoGridCardProps is an alias for RepoGridDisplayData in core
import type { RepoGridDisplayData } from '@github-profile-cards/core';
import { SimpleGrid, Text } from '@mantine/core';
import { RepoItemCard } from './RepoItemCard'; // Updated import

// The props for this component directly use RepoGridDisplayData
export interface RepoGridCardProps extends RepoGridDisplayData {}

export const RepoGridCard: React.FC<RepoGridCardProps> = ({ repos }) => {
  if (!repos || repos.length === 0) {
    return <Text>No repositories to display.</Text>;
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3 }}
      spacing="md"
    >
      {/* RepoItemCard expects a single 'repo' object of type RepoDisplayData */}
      {repos.map((repo) => (
        <RepoItemCard
          key={repo.id} // Now using id as it's available on RepoDisplayData
          repo={repo}
        />
      ))}
    </SimpleGrid>
  );
};
