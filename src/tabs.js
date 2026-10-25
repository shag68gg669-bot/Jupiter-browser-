class TabManager {
  constructor() {
    this.tabs = new Map();
    this.activeTabId = null;
    this.nextTabNumber = 1;
  }

  createTab({ title, url = 'about:blank' } = {}) {
    const tabId = `tab-${this.nextTabNumber}`;
    this.nextTabNumber += 1;

    const tab = {
      id: tabId,
      title: title || `Tab ${this.tabs.size + 1}`,
      url,
      webviewId: `webview-${tabId}`,
    };

    this.tabs.set(tabId, tab);
    this.createWebview(tab);

    if (this.activeTabId === null) {
      this.setActiveTab(tabId);
    }

    return tabId;
  }

  createWebview(tab) {
    const container = document.getElementById('webview-container');
    if (!container) {
      throw new Error('Missing #webview-container element');
    }

    const webview = document.createElement('webview');
    webview.id = tab.webviewId;
    webview.classList.add('webview');
    webview.src = tab.url;
    webview.allowpopups = true;
    container.appendChild(webview);
  }

  setActiveTab(tabId) {
    document.querySelectorAll('.active-webview')?.forEach((el) => el.classList.remove('active-webview'));

    document.getElementById(`webview-${tabId}`).classList.add('active-webview');

    this.activeTabId = tabId;

    document.querySelector('.active-tab')?.classList.add('selectable-tab');
    document.querySelector('.active-tab')?.classList.remove('active-tab');
    
    const tab = document.getElementById(tabId);
    tab.classList.add('active-tab');
    tab.classList.remove('selectable-tab');
  }

  closeTab(tabId) {
    const tab = this.tabs.get(tabId);
    document.getElementById(tab.webviewId)?.remove();
    this.tabs.delete(tabId);

    if (this.activeTabId === tabId) {
      const nextTab = this.tabs.values().next().value;
      this.activeTabId = null;
      if (nextTab) this.setActiveTab(nextTab.id);
    }
  }

  moveTab(tabId, targetTabId, insertAfter = false) {
    if (!this.tabs.has(tabId) || !this.tabs.has(targetTabId) || tabId === targetTabId) {
      return;
    }

    const tabs = [...this.tabs.entries()];
    const [movedTab] = tabs.splice(tabs.findIndex(([id]) => id === tabId), 1);
    const targetIndex = tabs.findIndex(([id]) => id === targetTabId);
    tabs.splice(targetIndex + Number(insertAfter), 0, movedTab);

    this.tabs = new Map(tabs);
  }

  getTab(tabId) {
    return this.tabs.get(tabId) || null;
  }

  getTabWebview(tabId) {
    const tab = this.getTab(tabId);
    return document.getElementById(tab.webviewId);
  }

  getAllTabs() {
    return [...this.tabs.values()];
  }

  getTabCount() {
    return this.tabs.size;
  }
}

const tabManager = new TabManager();

export { TabManager, tabManager };
