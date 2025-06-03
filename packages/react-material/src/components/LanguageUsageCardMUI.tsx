import React, { useState, useEffect } from 'react';
import {
  LanguageUsageProps,
  LanguageStats,
  fetchGitHubData,
  getLanguageUsageStats,
  fetchGenericGitHubAPI,
  getLanguageColor, // Using the core one, will need to map its output to MUI sx prop or use MUI specific colors
} from '@github-profile-cards/core';
import { Card, CardContent, Typography, Box, LinearProgress, CircularProgress, Alert } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';


// Helper to convert hex color from getLanguageColor to a format MUI understands well,
// or define MUI-specific colors. For now, we'll use the hex directly if provided.
const getMuiLanguageColorStyle = (language: string): React.CSSProperties => {
  const coreColor = getLanguageColor(language); // This returns a hex string like '#RRGGBB' or undefined
  return {
    backgroundColor: coreColor || '#CCCCCC', // Default color if core doesn't provide one
  };
};


export const LanguageUsageCardMUI: React.FC<LanguageUsageProps> = ({ username, token }) => {
  const [languageStats, setLanguageStats] = useState<LanguageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!username) {
        setError('Username is required.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const githubData = await fetchGitHubData(username, token);
        if (githubData && githubData.repos) {
          const stats = await getLanguageUsageStats(githubData.repos, fetchGenericGitHubAPI, token);
          setLanguageStats(stats);
        } else {
          setError('User or repository data not found.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load language usage data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [username, token]);

  if (loading) {
    return (
      <Card sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} sx={{ mr: 1 }} />
        <Typography>Loading languages...</Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" icon={<ErrorOutline fontSize="inherit" />}>
        {error}
      </Alert>
    );
  }

  if (!languageStats || Object.keys(languageStats).length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Language Usage</Typography>
          <Typography>No language data to display.</Typography>
        </CardContent>
      </Card>
    );
  }

  const totalBytes = Object.values(languageStats).reduce((acc, bytes) => acc + bytes, 0);
  if (totalBytes === 0) {
     return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Language Usage</Typography>
          <Typography>No language byte data to display (total is zero).</Typography>
        </CardContent>
      </Card>
    );
  }

  const sortedLanguages = Object.entries(languageStats)
    .sort(([, aBytes], [, bBytes]) => bBytes - aBytes)
    .slice(0, 7); // Display top 7 languages, for example

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Language Usage</Typography>
        {sortedLanguages.map(([lang, bytes]) => {
          const percentage = (bytes / totalBytes) * 100;
          const colorStyle = getMuiLanguageColorStyle(lang);
          return (
            <Box key={lang} sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">{lang}</Typography>
                <Typography variant="caption" color="text.secondary">{percentage.toFixed(1)}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: colorStyle.backgroundColor,
                  },
                }}
              />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};
