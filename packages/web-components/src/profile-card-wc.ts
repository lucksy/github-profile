import {
  fetchGitHubData,
  getProfileSummary,
  getGitHubMetrics,
  getTopRepos,
  type GitHubData,
  type ProfileSummaryData,
  type GitHubMetricsData,
  type TopReposData,
  // ProfileCardProps from core is { username, token, variant }, which matches attributes
  type ProfileCardProps,
} from '@github-profile-cards/core';

console.log('[v2 profile-card-wc] ProfileCardWC script loaded.');
class ProfileCardWC extends HTMLElement {
  private shadow: ShadowRoot;
  private _username: string | null = null;
  private _token: string | null = null;
  private _variant: ProfileCardProps['variant'] = 'summary'; // Default variant

  static get observedAttributes() {
    return ['username', 'token', 'variant'];
  }

  constructor() {
    super();
    console.log('[v2 profile-card-wc] Constructor invoked.');
    this.shadow = this.attachShadow({ mode: 'open' });
    // Initial render or placeholder
    this.render();
  }

  connectedCallback() {
    console.log('[v2 profile-card-wc] connectedCallback. Initial attributes:', { username: this.getAttribute('username'), token: this.getAttribute('token'), variant: this.getAttribute('variant') });
    this.updateFromAttributes();
    this.fetchAndRenderData();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.log(`[v2 profile-card-wc] attributeChangedCallback: ${name} changed from ${oldValue} to ${newValue}`);
    if (oldValue === newValue) return;
    (this as any)[`_${name}`] = newValue; // Simplified, assumes attribute name matches private field name convention

    if (name === 'variant') {
        this._variant = newValue as ProfileCardProps['variant'] || 'summary';
    }

    // Re-fetch and render if critical attributes change
    if (this.isConnected) { // Check if the element is in the DOM
        this.fetchAndRenderData();
    }
  }

  private updateFromAttributes() {
    this._username = this.getAttribute('username');
    this._token = this.getAttribute('token');
    this._variant = (this.getAttribute('variant') as ProfileCardProps['variant']) || 'summary';
  }

  private async fetchAndRenderData() {
    console.log('[v2 profile-card-wc] fetchAndRenderData called. State:', { username: this._username, token: this._token, variant: this._variant });
    if (!this._username) {
      console.warn('[v2 profile-card-wc] fetchAndRenderData: No username, rendering error.');
      this.renderError('Username attribute is required.');
      return;
    }

    this.renderLoading();

    try {
      const data = await fetchGitHubData(this._username, this._token || undefined);
      console.log('[v2 profile-card-wc] fetchGitHubData response:', data);
      if (!data) {
        console.warn('[v2 profile-card-wc] fetchGitHubData returned null/undefined, rendering error.');
        this.renderError('User not found or error fetching data.');
        return;
      }
      this.render(data);
    } catch (error) {
      console.error('[v2 profile-card-wc] fetchGitHubData caught error:', error);
      this.renderError(error instanceof Error ? error.message : 'Unknown error occurred.');
    }
  }

  private renderError(message: string) {
    console.log('[v2 profile-card-wc] renderError called with message:', message);
    this.shadow.innerHTML = `
      <style>
        .error { color: red; border: 1px solid red; padding: 10px; }
      </style>
      <div class="error">${message}</div>
    `;
  }

  private renderLoading() {
    console.log('[v2 profile-card-wc] renderLoading called.');
    this.shadow.innerHTML = `
      <style>
        .loading { padding: 10px; }
      </style>
      <div class="loading">Loading profile...</div>
    `;
  }

  private render(data?: GitHubData) {
    console.log('[v2 profile-card-wc] render called with data:', data);
    if (!this.shadow) return;

    // Basic styles - can be expanded significantly
    let styles = `
      :host { display: block; border: 1px solid #ccc; padding: 16px; border-radius: 8px; font-family: sans-serif; }
      .avatar { width: 80px; height: 80px; border-radius: 50%; margin-right: 16px; }
      .container { display: flex; align-items: center; }
      .info h2 { margin: 0 0 4px 0; }
      .info p { margin: 0 0 8px 0; font-size: 0.9em; color: #555; }
      a { color: #0366d6; text-decoration: none; }
      a:hover { text-decoration: underline; }
      ul { list-style: none; padding-left: 0; }
      li { margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
      .error { color: red; }
      .loading { color: #555; }
      .repo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
      .repo-item { border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
      .repo-item h3 { margin: 0 0 5px 0; font-size: 1.1em; }
    `;

    if (!data) {
      this.shadow.innerHTML = `<style>${styles}</style><div class="loading">Initializing...</div>`;
      return;
    }

    let content = '';
    if (this._variant === 'summary') {
      const summary = getProfileSummary(data.user);
      content = `
        <div class="container">
          <img src="${summary.avatar_url}" alt="${summary.login}" class="avatar">
          <div class="info">
            <h2><a href="${summary.html_url}" target="_blank">${summary.name || summary.login}</a></h2>
            ${summary.name && summary.login !== summary.name ? `<p>@${summary.login}</p>` : ''}
            <p>${summary.bio || 'No bio available.'}</p>
            <p>Location: ${summary.location || 'Not specified'}</p>
            <p>Followers: ${summary.followers.toLocaleString()}</p>
          </div>
        </div>
      `;
    } else if (this._variant === 'metrics') {
        const metrics = getGitHubMetrics(data.user, data.repos);
        content = `
            <h2>GitHub Metrics for ${this._username}</h2>
            <p>Public Repos: ${metrics.public_repos.toLocaleString()}</p>
            <p>Followers: ${metrics.followers.toLocaleString()}</p>
            <p>Following: ${metrics.following.toLocaleString()}</p>
            <p>Total Stars (Top Repos): ${metrics.total_stars_on_top_repos.toLocaleString()}</p>
        `;
    } else if (this._variant === 'repos') {
      const topRepos = getTopRepos(data.repos); // This returns { repos: RepoDisplayData[] }
      content = `
        <h2>Top Repositories for ${this._username}</h2>
        <div class="repo-grid">
          ${topRepos.repos.map(repo => `
            <div class="repo-item">
              <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
              <p>${repo.description || 'No description.'}</p>
              <p>Stars: ${repo.stargazers_count.toLocaleString()} | Language: ${repo.language || 'N/A'}</p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (this._variant === 'contributions') {
      content = `<p>Contribution data coming soon for ${this._username}.</p>`;
    } else {
      content = `<p class="error">Invalid variant: ${this._variant}</p>`;
    }
    this.shadow.innerHTML = `<style>${styles}</style>${content}`;
  }
}

customElements.define('profile-card-wc', ProfileCardWC);
