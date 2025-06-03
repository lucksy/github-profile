import React, { useState } from 'react';
import { Container, TextField, Button, Stack, Title, Paper, Group, Text, Code } from '@mantine/core';
import { ProfileCard, LanguageUsageCard, SingleRepoCard } from '@github-profile-cards/react-mantine';

// A mock token for development - replace with a real one if needed for private repo testing
const MOCK_DEV_TOKEN = 'YOUR_GITHUB_TOKEN_HERE'; // Replace or remove for production/sharing
const USE_MOCK_TOKEN_INFO = ' (Note: A mock token placeholder is in App.tsx. Replace it with a real PAT for testing private repo features, or ensure it is removed/handled for any public deployment.)';


const mockCoreData = {
  user: {
    login: 'mockuser',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4', // Octocat's avatar
    name: 'Mock User',
    bio: 'This is a mock user bio.',
    followers: 1234,
    following: 56,
    location: 'Mock Location',
    public_repos: 10,
    html_url: 'https://github.com/mockuser',
  },
  repos: [
    { id: 1, name: 'mock-repo-1', description: 'A mock repository.', stargazers_count: 100, language: 'JavaScript', html_url: 'https://github.com/mockuser/mock-repo-1', languages_url: '', forks_count: 10 },
    { id: 2, name: 'another-mock-repo', description: 'Another one!', stargazers_count: 50, language: 'TypeScript', html_url: 'https://github.com/mockuser/another-mock-repo', languages_url: '', forks_count: 5 },
  ],
  languageStats: {
    'JavaScript': 10240,
    'TypeScript': 5120,
    'HTML': 2048,
  }
};


function App() {
  const [username, setUsername] = useState<string>('octocat'); // Default to 'octocat'
  const [inputValue, setInputValue] = useState<string>('octocat');
  const [token, setToken] = useState<string | undefined>(MOCK_DEV_TOKEN === 'YOUR_GITHUB_TOKEN_HERE' ? undefined : MOCK_DEV_TOKEN);

  const handleSubmit = () => {
    setUsername(inputValue);
    // Potentially update token if there's an input for it
  };

  const handleUseMockUser = () => {
    setInputValue('mockuser');
    setUsername('mockuser');
  };

  // If username is 'mockuser', render mock data directly
  if (username === 'mockuser') {
    const summary = getProfileSummary(mockCoreData.user as any); // Cast as any if types are slightly off from full GitHubUser
    const metrics = getGitHubMetrics(mockCoreData.user as any, mockCoreData.repos as any[]);
    const topRepos = getTopRepos(mockCoreData.repos as any[]);
    const languageStats = mockCoreData.languageStats;

    return (
      <Container size="md" py="xl">
        <Title order={1} ta="center" mb="xl">GitHub Profile Cards - Mantine Demo (Mock Data)</Title>
        <Paper shadow="xs" p="md" mb="xl">
          <Text>Displaying hardcoded mock data for "mockuser".</Text>
           <Button onClick={() => { setInputValue('octocat'); setUsername('octocat'); }} mt="sm">Back to Live Data (octocat)</Button>
        </Paper>
        <Stack gap="lg">
          <Paper withBorder p="md"><Title order={3} size="h4" mb="sm">Summary (Mock)</Title>
            <pre>{JSON.stringify(summary, null, 2)}</pre>
          </Paper>
          <Paper withBorder p="md"><Title order={3} size="h4" mb="sm">Metrics (Mock)</Title>
            <pre>{JSON.stringify(metrics, null, 2)}</pre>
          </Paper>
          <Paper withBorder p="md"><Title order={3} size="h4" mb="sm">Top Repos (Mock)</Title>
            <pre>{JSON.stringify(topRepos, null, 2)}</pre>
          </Paper>
          <Paper withBorder p="md"><Title order={3} size="h4" mb="sm">Contributions (Mock)</Title>
            <Text>Contribution graph coming soon (mock).</Text>
          </Paper>
          <Paper withBorder p="md"><Title order={3} size="h4" mb="sm">Language Usage (Mock)</Title>
            <pre>{JSON.stringify(languageStats, null, 2)}</pre>
          </Paper>
        </Stack>
      </Container>
    );
  }

  // Render live data components
  return (
    <Container size="md" py="xl">
      <Title order={1} ta="center" mb="xl">GitHub Profile Cards - Mantine Demo</Title>

      <Paper shadow="xs" p="md" mb="xl">
        <Group>
          <TextField
            label="GitHub Username"
            placeholder="Enter GitHub username"
            value={inputValue}
            onChange={(event) => setInputValue(event.currentTarget.value)}
            style={{ flexGrow: 1 }}
          />
          <Button onClick={handleSubmit} mt="md">Load Cards</Button>
        </Group>
        <Group mt="sm">
           <Button onClick={handleUseMockUser} variant="outline">Use "mockuser"</Button>
        </Group>
        {MOCK_DEV_TOKEN === 'YOUR_GITHUB_TOKEN_HERE' &&
            <Text size="xs" c="dimmed" mt="xs">No development token provided. API rate limits may apply. {USE_MOCK_TOKEN_INFO}</Text>
        }
      </Paper>

      {username && ( // This will be true for non-mock user
        <Stack gap="lg">
          <Title order={2}>ProfileCard Variants for: <Code>{username}</Code></Title>

          <Paper withBorder p="md">
            <Title order={3} size="h4" mb="sm">Summary (Live)</Title>
            <ProfileCard username={username} token={token} variant="summary" />
          </Paper>

          <Paper withBorder p="md">
            <Title order={3} size="h4" mb="sm">Metrics (Live)</Title>
            <ProfileCard username={username} token={token} variant="metrics" />
          </Paper>

          <Paper withBorder p="md">
            <Title order={3} size="h4" mb="sm">Top Repositories (Live)</Title>
            <ProfileCard username={username} token={token} variant="repos" />
          </Paper>

          <Paper withBorder p="md">
            <Title order={3} size="h4" mb="sm">Contributions (Live)</Title>
            <ProfileCard username={username} token={token} variant="contributions" />
          </Paper>

          <Paper withBorder p="md">
            <Title order={3} size="h4" mb="sm">Language Usage (Live)</Title>
            <LanguageUsageCard username={username} token={token} />
          </Paper>

          <Paper withBorder p="md">
            <Title order={3} size="h4" mb="sm">Single Repo Example (Spoon-Knife for {username})</Title>
            {/* Using a well-known repo, or could add inputs for reponame */}
            <SingleRepoCard username={username} token={token} repoName="Spoon-Knife" />
          </Paper>
        </Stack>
      )}
    </Container>
  );
}

export default App;
