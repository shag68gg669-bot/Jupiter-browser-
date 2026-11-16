import { createWebview, removeWebview, setActiveWebview } from './webviews.js';

class TabManager {
  constructor() {
    this.tabs = new Map();
    this.activeTabId = null;
    this.nextTabNumber = 1;
    this.tabActivationList = [];
  }

  createTab({ title, url = 'about:blank' } = {}) {
    const tabId = `tab-${this.nextTabNumber}`;
    this.nextTabNumber += 1;

    const tab = {
      id: tabId,
      title: title || `Tab ${this.tabs.size + 1}`,
      url,
      webviewId: `webview-${tabId}`,
      tabActivationIndex: 0
    };

    this.tabs.set(tabId, tab);
    createWebview(tabId);

    if (this.activeTabId === null) {
      this.setActiveTab(tabId);
    }

    return tabId;
  }


  setActiveTab(tabId) {
    const tab = this.getTab(tabId);
    if (!tab) {
      console.error(`Tab ${tabId} not found`);
      return;
    }

    this.activeTabId = tabId;
    setActiveWebview(tabId);
    for (const value of this.tabs.values()) {
      value.tabActivationIndex += 1;
    }
    tab.tabActivationIndex = 0;
  }

  closeTab(tabId) {
    const tab = this.tabs.get(tabId);
    if (!tab) {
      return;
    }

    if (this.tabs.size === 1) {
      console.warn('Cannot close the last tab');
      return;
    }

    removeWebview(this.getTabWebview(tabId));
    this.tabs.delete(tabId);
    this.tabActivationList = this.tabActivationList.filter((id) => id !== tabId);

    if (this.activeTabId === tabId) {
      const nextTabId = this.getSmallestActivationIndex();
      if (nextTabId) {
        this.setActiveTab(nextTabId);
      }
    }
  }

  getTab(tabId) {
    return this.tabs.get(tabId) || null;
  }

  getTabWebview(tabId) {
    const tab = this.getTab(tabId);
    return tab ? document.getElementById(tab.webviewId) : null;
  }

  getSmallestActivationIndex() {
    let minTabId = null;

    for (const [tabId, tab] of this.tabs) {
      if (minTabId === null || tab.tabActivationIndex < this.tabs.get(minTabId).tabActivationIndex) {
        minTabId = tabId;
      }
    }

    return minTabId;
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
