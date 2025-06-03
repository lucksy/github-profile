import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import type { ProfileCardProps, GitHubMetricsData } from '@github-profile-cards/core';

export const GitHubMetricsCardMUI: React.FC<ProfileCardProps & { variantData?: GitHubMetricsData }> = ({ username, variantData }) => {
  if (!variantData) {
    return (
      <Card>
        <CardContent>
          <Typography>No metrics data available for {username}.</Typography>
        </CardContent>
      </Card>
    );
  }

  const { public_repos, followers, following, total_stars_on_top_repos } = variantData;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>GitHub Metrics</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">Public Repos:</Typography>
            <Typography variant="h6">{public_repos?.toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">Followers:</Typography>
            <Typography variant="h6">{followers?.toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">Following:</Typography>
            <Typography variant="h6">{following?.toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">Total Stars (Top Repos):</Typography>
            <Typography variant="h6">{total_stars_on_top_repos?.toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
