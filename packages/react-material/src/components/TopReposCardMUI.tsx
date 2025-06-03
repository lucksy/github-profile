import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import type { ProfileCardProps, TopReposData } from '@github-profile-cards/core';
import { RepoGridCardMUI } from './RepoGridCardMUI';

export const TopReposCardMUI: React.FC<ProfileCardProps & { variantData?: TopReposData }> = ({ username, variantData }) => {
  if (!variantData || !variantData.repos || variantData.repos.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Top Repositories</Typography>
          <Typography>No repositories found for {username}.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Top Repositories</Typography>
        <RepoGridCardMUI repos={variantData.repos} />
      </CardContent>
    </Card>
  );
};
