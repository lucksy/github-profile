import React from 'react';
import type { RepoCardProps as CoreRepoCardProps } from '@github-profile-cards/core';
import { Card, Text, Group, Anchor, Badge } from '@mantine/core';
import { IconStar, IconGitFork } from '@tabler/icons-react';

export type RepoCardProps = CoreRepoCardProps;

export const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Group justify="space-between" mt="md" mb="xs">
        <Anchor href={repo.html_url} target="_blank" fz="lg" fw={500} truncate="end">
          {repo.name}
        </Anchor>
        {repo.language && <Badge color={getLanguageColor(repo.language)} variant="light">{repo.language}</Badge>}
      </Group>

      <Text size="sm" c="dimmed" style={{ minHeight: '40px' }}> {/* Ensure consistent height for description */}
        {repo.description || 'No description available.'}
      </Text>

      <Group justify="flex-start" mt="md" gap="xs">
        <Group gap={4}>
          <IconStar size={16} />
          <Text size="sm" c="dimmed">
            {repo.stargazers_count}
          </Text>
        </Group>
        <Group gap={4}>
          <IconGitFork size={16} />
          <Text size="sm" c="dimmed">
            {repo.forks_count}
          </Text>
        </Group>
      </Group>
    </Card>
  );
};

// Helper function for language colors - can be centralized or made more sophisticated
// Duplicated from core's card-logic for now, ideally this would come from core or a shared util
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    'JavaScript': 'yellow',
    'TypeScript': 'blue',
    'Python': 'teal',
    'Java': 'orange',
    'C#': 'green',
    'C++': 'pink',
    'PHP': 'indigo',
    'Ruby': 'red',
    'Go': 'cyan',
    'Swift': 'orange',
    'Kotlin': 'grape',
    'HTML': 'red',
    'CSS': 'grape',
    'Shell': 'lime',
    'Rust': 'orange',
    'Scala': 'red',
  };
  return colors[language?.toLowerCase()] || 'gray';
}
