import {
  fetchGitHubData,
  getLanguageUsageStats,
  fetchGenericGitHubAPI,
  getLanguageColor, // For color consistency
  type LanguageStats,
  type LanguageUsageProps, // { username, token }
} from '@github-profile-cards/core';

class LanguageUsageCardWC extends HTMLElement {
  private shadow: ShadowRoot;
  private _username: string | null = null;
  private _token: string | null = null;

  static get observedAttributes() {
    return ['username', 'token'];
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
    (this as any)[`_${name}`] = newValue;

    if (this.isConnected) {
      this.fetchAndRenderData();
    }
  }

  private updateFromAttributes() {
    this._username = this.getAttribute('username');
    this._token = this.getAttribute('token');
  }

  private async fetchAndRenderData() {
    if (!this._username) {
      this.renderError('Username attribute is required.');
      return;
    }

    this.renderLoading();

    try {
      const githubData = await fetchGitHubData(this._username, this._token || undefined);
      if (!githubData || !githubData.repos) {
        this.renderError('User or repository data not found.');
        return;
      }
      const stats = await getLanguageUsageStats(githubData.repos, fetchGenericGitHubAPI, this._token || undefined);
      this.render(stats);
    } catch (error) {
      this.renderError(error instanceof Error ? error.message : 'Unknown error occurred.');
    }
  }

  private renderError(message: string) {
    this.shadow.innerHTML = `
      <style>:host { display: block; } .error { color: red; border: 1px solid red; padding: 10px; }</style>
      <div class="error">${message}</div>
    `;
  }

  private renderLoading() {
    this.shadow.innerHTML = `
      <style>:host { display: block; } .loading { padding: 10px; }</style>
      <div class="loading">Loading language usage...</div>
    `;
  }

  private render(stats?: LanguageStats) {
    if (!this.shadow) return;

    const styles = `
      :host { display: block; border: 1px solid #ccc; padding: 16px; border-radius: 8px; font-family: sans-serif; }
      h3 { margin: 0 0 12px 0; }
      .lang-item { margin-bottom: 8px; }
      .lang-name { display: inline-block; width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; vertical-align: middle; }
      .lang-bar-container { display: inline-block; width: calc(100% - 150px); height: 16px; background-color: #f0f0f0; border-radius: 4px; overflow: hidden; vertical-align: middle; }
      .lang-bar { height: 100%; background-color: #0366d6; border-radius: 4px; transition: width 0.3s ease-in-out; }
      .lang-percent { font-size: 0.8em; margin-left: 5px; vertical-align: middle; }
      .error { color: red; }
      .empty { color: #555; }
    `;

    if (!stats || Object.keys(stats).length === 0) {
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <h3>Language Usage</h3>
        <div class="empty">No language data to display.</div>
      `;
      return;
    }

    const totalBytes = Object.values(stats).reduce((acc, bytes) => acc + bytes, 0);
    if (totalBytes === 0) {
        this.shadow.innerHTML = `
        <style>${styles}</style>
        <h3>Language Usage</h3>
        <div class="empty">No language data (0 bytes).</div>
      `;
      return;
    }

    // Sort and take top N, similar to React versions
    const sortedLanguages = Object.entries(stats)
      .sort(([, aBytes], [, bBytes]) => bBytes - aBytes)
      .slice(0, 7); // Top 7 languages

    let content = `<h3>Language Usage</h3>`;
    sortedLanguages.forEach(([lang, bytes]) => {
      const percentage = (bytes / totalBytes) * 100;
      const color = getLanguageColor(lang) || '#0366d6'; // Use core color or a default
      content += `
        <div class="lang-item">
          <span class="lang-name" title="${lang}">${lang}</span>
          <div class="lang-bar-container">
            <div class="lang-bar" style="width: ${percentage.toFixed(1)}%; background-color: ${color};"></div>
          </div>
          <span class="lang-percent">${percentage.toFixed(1)}%</span>
        </div>
      `;
    });

    this.shadow.innerHTML = `<style>${styles}</style>${content}`;
  }
}

customElements.define('language-usage-card-wc', LanguageUsageCardWC);
