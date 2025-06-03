import React from 'react';
import { getLanguageUsage, type LanguageUsageCardProps as CoreLanguageUsageCardProps, type LanguageUsageStat } from '@github-profile-cards/core';
import { Card, Text, Progress, Group, Title, Stack } from '@mantine/core';

export type LanguageUsageCardProps = CoreLanguageUsageCardProps;

export const LanguageUsageCard: React.FC<LanguageUsageCardProps> = ({ repos }) => {
  const langUsage = getLanguageUsage(repos);

  if (langUsage.length === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Language Usage</Title>
        <Text>No language data to display.</Text>
      </Card>
    );
  }

  const totalCount = langUsage.reduce((acc, stat) => acc + stat.count, 0);

  const progressSections = langUsage.map(stat => ({
    value: (stat.count / totalCount) * 100,
    color: stat.color || getRandomColor(stat.language), // Use provided color or generate one
    label: stat.language,
    tooltip: `${stat.language}: ${stat.count} repo(s) (${((stat.count / totalCount) * 100).toFixed(1)}%)`,
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
            tooltip={section.tooltip}
          />
        ))}
      </Progress.Root>
      <Stack gap="xs">
        {progressSections.map(section => (
          <Group key={section.label} gap="xs">
            <div style={{ width: 10, height: 10, backgroundColor: section.color, borderRadius: '50%' }} />
            <Text size="sm">{section.label} ({((section.value)).toFixed(1)}%)</Text>
          </Group>
        ))}
      </Stack>
    </Card>
  );
};

// Helper function for random colors if not provided - for visual distinction
// In a real app, consistent color mapping based on language name is better.
// The core package's getLanguageColor is one such example.
const colorCache: Record<string, string> = {};
function getRandomColor(languageName: string): string {
  if (colorCache[languageName]) {
    return colorCache[languageName];
  }
  // Simple hash function to get a somewhat consistent color
  let hash = 0;
  for (let i = 0; i < languageName.length; i++) {
    hash = languageName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`;
  colorCache[languageName] = color;
  return color;
}
