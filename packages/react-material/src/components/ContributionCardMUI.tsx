import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import type { ProfileCardProps } from '@github-profile-cards/core';

export const ContributionCardMUI: React.FC<ProfileCardProps> = ({ username }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Contributions for {username}</Typography>
        <Typography variant="body2">Contribution graph coming soon.</Typography>
      </CardContent>
    </Card>
  );
};
