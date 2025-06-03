import React from 'react';
import type { RepoDisplayData } from '@github-profile-cards/core';
import { Card, CardContent, Typography, Link, Box, Chip } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ForkRightIcon from '@mui/icons-material/ForkRight'; // Using a generic fork icon

// Using getLanguageColor from core (assuming it's exported or we create a similar one)
// For now, a placeholder or direct styling.
// import { getLanguageColor } from '@github-profile-cards/core';


// Placeholder for language color mapping specific to MUI if needed
const getMuiLanguageColor = (language: string): string => {
  // Basic color mapping, can be expanded
  const colors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    // Add more or use a default
  };
  return colors[language] || '#CCCCCC'; // Return a default color
};


export interface RepoItemCardMUIProps {
  repo: RepoDisplayData;
}

export const RepoItemCardMUI: React.FC<RepoItemCardMUIProps> = ({ repo }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Link href={repo.html_url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontWeight: 'bold', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {repo.name}
          </Link>
          {repo.language && (
            <Chip
              label={repo.language}
              size="small"
              sx={{
                backgroundColor: getMuiLanguageColor(repo.language),
                color: '#fff' // Basic contrast, might need adjustment
              }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '60px' // Approx 3 lines
        }}>
          {repo.description || 'No description available.'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <StarBorderIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1.5 }}>
            {repo.stargazers_count.toLocaleString()}
          </Typography>
          <ForkRightIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
          <Typography variant="body2" color="text.secondary">
            {repo.forks_count.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
