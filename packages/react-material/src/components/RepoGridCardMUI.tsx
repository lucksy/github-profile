import React from 'react';
import type { RepoGridDisplayData } from '@github-profile-cards/core';
import { Grid, Typography } from '@mui/material';
import { RepoItemCardMUI } from './RepoItemCardMUI';

export interface RepoGridCardMUIProps extends RepoGridDisplayData {}

export const RepoGridCardMUI: React.FC<RepoGridCardMUIProps> = ({ repos }) => {
  if (!repos || repos.length === 0) {
    return <Typography>No repositories to display.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {repos.map((repo) => (
        <Grid item xs={12} sm={6} md={4} key={repo.id}>
          <RepoItemCardMUI repo={repo} />
        </Grid>
      ))}
    </Grid>
  );
};
