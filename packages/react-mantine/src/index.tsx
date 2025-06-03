// Main entry point for the @github-profile-cards/react-mantine package

// Export the primary card components
export * from './components/ProfileCard';
export * from './components/SingleRepoCard';
export * from './components/LanguageUsageCard';

// Export display/helper components if they are intended for direct use
export * from './components/RepoGridCard'; // Displays a grid of repos given the data
export * from './components/RepoItemCard'; // Displays a single repo item, useful for custom lists

// Export relevant props types directly from the components if they define unique props,
// or re-export from core if they directly use core props.
// Most components use props defined in @github-profile-cards/core,
// so consumers can import those directly.

// For example, if ProfileCard had its own specific props not from core:
// export type { ProfileCardProps } from './components/ProfileCard';
// But since it uses CoreProfileCardProps (aliased as ProfileCardProps),
// users should get ProfileCardProps from '@github-profile-cards/core'.

// The individual variant cards (ProfileSummaryCard, GitHubMetricsCard, etc.)
// are primarily used internally by ProfileCard and might not need direct export yet,
// unless a use case for them as standalone components is identified.
// If needed, they can be added here:
// export * from './components/ProfileSummaryCard';
// export * from './components/GitHubMetricsCard';
// export * from './components/TopReposCard';
// export * from './components/ContributionCard';
