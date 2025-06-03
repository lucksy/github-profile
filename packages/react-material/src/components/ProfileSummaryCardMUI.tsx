import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Link } from '@mui/material';
import type { ProfileCardProps, ProfileSummaryData } from '@github-profile-cards/core';

export const ProfileSummaryCardMUI: React.FC<ProfileCardProps & { variantData?: ProfileSummaryData }> = ({ username, variantData }) => {
  if (!variantData) {
    return (
      <Card>
        <CardContent>
          <Typography>No summary data available for {username}.</Typography>
        </CardContent>
      </Card>
    );
  }

  const { avatar_url, name, login, bio, location, followers, html_url } = variantData;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={avatar_url} sx={{ width: 80, height: 80, mr: 2 }} />
          <Box>
            <Typography variant="h5">{name || login}</Typography>
            {name && login !== name && <Typography variant="subtitle1" color="text.secondary">{login}</Typography>}
            <Typography variant="body2" color="text.secondary">
              {location || 'Location not specified'}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {bio || 'No bio available.'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Followers: {followers?.toLocaleString()}
        </Typography>
        <Link href={html_url} target="_blank" rel="noopener noreferrer" variant="body2">
          View Profile on GitHub
        </Link>
      </CardContent>
    </Card>
  );
};
