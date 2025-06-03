import type { GitHubRepo } from '@github-profile-cards/core';
import { fetchSingleRepo } from '@github-profile-cards/core';

class SingleRepoCardWC extends HTMLElement {
  private shadow: ShadowRoot;
  private _username: string | null = null;
  private _token: string | null = null;
  private _repoName: string | null = null;

  static get observedAttributes() {
    return ['username', 'token', 'repo-name'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render(); // Initial placeholder
  }

  connectedCallback() {
    this.updateFromAttributes();
    this.fetchAndRenderData();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    const propName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase()); // repo-name -> repoName
    (this as any)[`_${propName}`] = newValue;

    if (this.isConnected) {
        this.fetchAndRenderData();
    }
  }

  private updateFromAttributes() {
    this._username = this.getAttribute('username');
    this._token = this.getAttribute('token');
    this._repoName = this.getAttribute('repo-name');
  }

  private async fetchAndRenderData() {
    if (!this._username || !this._repoName) {
      this.renderError('Username and repo-name attributes are required.');
      return;
    }

    this.renderLoading();

    try {
      const repoData = await fetchSingleRepo(this._username, this._repoName, this._token || undefined);
      if (!repoData) {
        this.renderError('Repository not found or error fetching data.');
        return;
      }
      this.render(repoData);
    } catch (error) {
      this.renderError(error instanceof Error ? error.message : 'Unknown error occurred.');
    }
  }

  private renderError(message: string) {
    this.shadow.innerHTML = `
      <style> :host { display: block; } .error { color: red; border: 1px solid red; padding: 10px; } </style>
      <div class="error">${message}</div>
    `;
  }

  private renderLoading() {
    this.shadow.innerHTML = `
      <style> :host { display: block; } .loading { padding: 10px; } </style>
      <div class="loading">Loading repository ${this._repoName}...</div>
    `;
  }

  private render(repo?: GitHubRepo) { // GitHubRepo is a placeholder, ideally a specific type for single repo display
    if (!this.shadow) return;

    const styles = `
      :host { display: block; border: 1px solid #ccc; padding: 16px; border-radius: 8px; font-family: sans-serif; }
      h3 { margin: 0 0 8px 0; }
      p { margin: 0 0 4px 0; font-size: 0.9em; }
      a { color: #0366d6; text-decoration: none; }
      a:hover { text-decoration: underline; }
    `;

    if (!repo) {
      // This state might be hit if render is called before data or after an error where repo is nullified
      this.shadow.innerHTML = `<style>${styles}</style><div class="empty">Repository data not available.</div>`;
      return;
    }

    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div>
        <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
        <p>${repo.description || 'No description available.'}</p>
        <p><strong>Stars:</strong> ${repo.stargazers_count.toLocaleString()}</p>
        <p><strong>Language:</strong> ${repo.language || 'N/A'}</p>
        <p><strong>Forks:</strong> ${repo.forks_count.toLocaleString()}</p>
      </div>
    `;
  }
}

customElements.define('single-repo-card-wc', SingleRepoCardWC);
