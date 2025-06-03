import React from 'react';
import { Card, Avatar, Text, Group, Anchor } from '@mantine/core';
import type { ProfileCardProps, ProfileSummaryData } from '@github-profile-cards/core';

// This component now receives processed data for the summary variant
export const ProfileSummaryCard: React.FC<ProfileCardProps & { variantData?: ProfileSummaryData }> = ({ username, variantData }) => {
  if (!variantData) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text>No summary data available for {username}.</Text>
      </Card>
    );
  }

  const { avatar_url, name, login, bio, location, followers, html_url } = variantData;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group wrap="nowrap">
        <Avatar src={avatar_url} size={94} radius="md" />
        <div>
          <Text fz="lg" fw={500} mt="md">
            {name || login}
          </Text>
          {name && login !== name && <Text fz="xs" c="dimmed">{login}</Text>}
          <Text fz="xs" c="dimmed" mt={4}>
            {location || 'Location not specified'}
          </Text>
        </div>
      </Group>
      <Text mt="sm" mb="md" c="dimmed" fz="sm">
        {bio || 'No bio available.'}
      </Text>
      <Group justify="space-apart" mt="md">
        <Text fz="sm">Followers: {followers?.toLocaleString()}</Text>
        {/* Add more summary details if needed */}
      </Group>
      <Anchor href={html_url} target="_blank" fz="sm" mt="sm">
        View Profile on GitHub
      </Anchor>
    </Card>
  );
};
