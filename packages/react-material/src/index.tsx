// Main entry point for the @github-profile-cards/react-material package

// Export the primary card components
export * from './components/ProfileCardMUI';
export * from './components/SingleRepoCardMUI';
export * from './components/LanguageUsageCardMUI';

// Export display/helper components if they are intended for direct use
export * from './components/RepoGridCardMUI';
export * from './components/RepoItemCardMUI';

// Consumers should import props types directly from '@github-profile-cards/core'.

// The individual variant cards (ProfileSummaryCardMUI, GitHubMetricsCardMUI, etc.)
// are primarily used internally by ProfileCardMUI and might not need direct export yet.
// If needed, they can be added here:
// export * from './components/ProfileSummaryCardMUI';
// export * from './components/GitHubMetricsCardMUI';
// export * from './components/TopReposCardMUI';
// export * from './components/ContributionCardMUI';
