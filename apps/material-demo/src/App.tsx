import { useState } from 'react';
// Code component removed from @mui/material import
// React default import removed as it's not needed with new JSX transform
import { Container, TextField, Button, Stack, Typography, Paper, Box } from '@mui/material';
import { ProfileCardMUI, LanguageUsageCardMUI, SingleRepoCardMUI } from '@github-profile-cards/react-material';

// A mock token for development - replace with a real one if needed
const MOCK_DEV_TOKEN = 'YOUR_GITHUB_TOKEN_HERE'; // Replace or remove
const USE_MOCK_TOKEN_INFO = ' (Note: A mock token placeholder is in App.tsx. Replace it with a real PAT for testing private repo features, or ensure it is removed/handled for any public deployment.)';


import { getProfileSummary, getGitHubMetrics, getTopRepos } from '@github-profile-cards/core'; // Import core functions

const mockCoreData = { // Same mock data as in Mantine demo
  user: {
    login: 'mockuser',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    name: 'Mock User MUI',
    bio: 'This is a mock user bio for MUI demo.',
    followers: 4321,
    following: 65,
    location: 'Mock Location MUI',
    public_repos: 12,
    html_url: 'https://github.com/mockuser',
  },
  repos: [
    { id: 1, name: 'mui-mock-repo-1', description: 'A mock MUI repository.', stargazers_count: 150, language: 'CSS', html_url: 'https://github.com/mockuser/mui-mock-repo-1', languages_url: '', forks_count: 12 },
    { id: 2, name: 'another-mui-mock-repo', description: 'Another MUI one!', stargazers_count: 70, language: 'JavaScript', html_url: 'https://github.com/mockuser/another-mui-mock-repo', languages_url: '', forks_count: 7 },
  ],
  languageStats: {
    'CSS': 8000,
    'JavaScript': 12000,
    'HTML': 3000,
  }
};


function App() {
  const [username, setUsername] = useState<string>('mui'); // Default to 'mui'
  const [inputValue, setInputValue] = useState<string>('mui');
  // token state and setToken removed. tokenValue will be derived directly.
  const currentToken = MOCK_DEV_TOKEN === 'YOUR_GITHUB_TOKEN_HERE' ? undefined : MOCK_DEV_TOKEN;

  const handleSubmit = () => {
    setUsername(inputValue);
  };

  const handleUseMockUser = () => {
    setInputValue('mockuser');
    setUsername('mockuser');
  };

  // If username is 'mockuser', render mock data directly
  if (username === 'mockuser') {
    const summary = getProfileSummary(mockCoreData.user as any);
    const metrics = getGitHubMetrics(mockCoreData.user as any, mockCoreData.repos as any[]);
    const topRepos = getTopRepos(mockCoreData.repos as any[]);
    const languageStats = mockCoreData.languageStats;

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
          GitHub Profile Cards - Material UI Demo (Mock Data)
        </Typography>
        <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
          <Typography>Displaying hardcoded mock data for "mockuser".</Typography>
          <Button onClick={() => { setInputValue('mui'); setUsername('mui'); }} sx={{mt: 1}}>Back to Live Data (mui)</Button>
        </Paper>
        <Stack spacing={3}>
          <Paper elevation={1} sx={{ p: 2 }}><Typography variant="h5" component="h3" gutterBottom>Summary (Mock)</Typography>
            <pre>{JSON.stringify(summary, null, 2)}</pre>
          </Paper>
          <Paper elevation={1} sx={{ p: 2 }}><Typography variant="h5" component="h3" gutterBottom>Metrics (Mock)</Typography>
            <pre>{JSON.stringify(metrics, null, 2)}</pre>
          </Paper>
          <Paper elevation={1} sx={{ p: 2 }}><Typography variant="h5" component="h3" gutterBottom>Top Repos (Mock)</Typography>
            <pre>{JSON.stringify(topRepos, null, 2)}</pre>
          </Paper>
          <Paper elevation={1} sx={{ p: 2 }}><Typography variant="h5" component="h3" gutterBottom>Contributions (Mock)</Typography>
            <Typography>Contribution graph coming soon (mock).</Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2 }}><Typography variant="h5" component="h3" gutterBottom>Language Usage (Mock)</Typography>
            <pre>{JSON.stringify(languageStats, null, 2)}</pre>
          </Paper>
        </Stack>
      </Container>
    );
  }

  // Render live data components
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
        GitHub Profile Cards - Material UI Demo
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            label="GitHub Username"
            placeholder="Enter GitHub username"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" onClick={handleSubmit}>Load Cards</Button>
        </Box>
        <Box sx={{ mt: 1 }}>
           <Button onClick={handleUseMockUser} variant="outlined">Use "mockuser"</Button>
        </Box>
         {MOCK_DEV_TOKEN === 'YOUR_GITHUB_TOKEN_HERE' &&
            <Typography variant="caption" color="text.secondary" display="block" sx={{mt:1}}>No development token provided. API rate limits may apply. {USE_MOCK_TOKEN_INFO}</Typography>
        }
      </Paper>

      {username && ( // This will be true for non-mock user
        <Stack spacing={3}>
          {/* Code component removed, username rendered directly in Typography */}
          <Typography variant="h4" component="h2">ProfileCard Variants for: <Typography component="span" fontFamily="monospace">{username}</Typography> (Live)</Typography>

          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>Summary (Live)</Typography>
            <ProfileCardMUI username={username} token={currentToken} variant="summary" />
          </Paper>

          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>Metrics (Live)</Typography>
            <ProfileCardMUI username={username} token={currentToken} variant="metrics" />
          </Paper>

          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>Top Repositories (Live)</Typography>
            <ProfileCardMUI username={username} token={currentToken} variant="repos" />
          </Paper>

          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>Contributions (Live)</Typography>
            <ProfileCardMUI username={username} token={currentToken} variant="contributions" />
          </Paper>

          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>Language Usage (Live)</Typography>
            <LanguageUsageCardMUI username={username} token={currentToken} />
          </Paper>

          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>Single Repo Example (material-ui for {username})</Typography>
            {/* Using a known repo for the mui org, or could add inputs */}
            <SingleRepoCardMUI username={username} token={currentToken} repoName={username === 'mui' ? 'material-ui' : 'Spoon-Knife'} />
          </Paper>
        </Stack>
      )}
    </Container>
  );
}

export default App;
