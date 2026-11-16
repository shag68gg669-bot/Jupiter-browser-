import {tabManager} from './tabs.js';
import {flowCaseMainTabUpdate} from './layout/flowTabUI/mainTab.js';
import {flowCaseButtonsSectionUpdate} from './layout/flowTabUI/buttonSection.js';
import {flowCaseURLBarUpdate} from './layout/flowTabUI/URLbar.js';
import {flowCaseUpdateTabElement, flowCaseGenerateTabElement, flowCaseUpdateAllTabs, } from './layout/flowTabUI/tab.js';
import {updateTabCount} from './layout/flowTabUI/tabMenu.js';
import { checkForKeyPresses } from './checkForKeyPresses.js';

export function createWebviews() {
    if (tabManager.getTabCount() === 0) {
        tabManager.createTab({
            title: 'New Tab',
            url: new URL('./internal pages/home/home.html', import.meta.url).href,
            isActive: false
        });
    }
    window.electronAPI.onOpenPopupInTab((url => {
        const tabId = tabManager.createTab({
            title: 'New Tab',
            url: url,
            isActive: true
        });
        tabManager.setActiveTab(tabId);
        flowCaseGenerateTabElement(tabManager.getTab(tabId));
        updateTabCount();
        // console.log('New tab created with URL: ' + url);
    }));
}

function addWebviewEventListeners(webview) {
    webview.addEventListener('dom-ready', () => {
        const tabId = webview.id.replace('webview-', '');
        const tab = tabManager.getTab(tabId);
        if (!tab) {
            return;
        }

        flowCaseGenerateTabElement(tab);
        flowCaseUpdateTabElement(tabId);
        flowCaseUpdateAllTabs();
        updateTabCount();
    });

    webview.addEventListener('page-title-updated', () => {
        flowCaseUpdateTabElement(webview.id.replace('webview-', ''));
    });

    webview.addEventListener('page-favicon-updated', (event) => {
        updateFaveIcon(webview, event);
        flowCaseUpdateTabElement(webview.id.replace('webview-', ''));
    });
}

export function createWebview(tabid) {
    const tab = tabManager.getTab(tabid);
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
    addWebviewEventListeners(webview);
}

export function setActiveWebview(tabId) {
    const webview = document.getElementById(`webview-${tabId}`);
    if (!webview) {
        console.error(`Webview for tab ${tabId} not found`);
        return;
    }

    document.querySelectorAll('.active-webview')?.forEach((el) => {
        el.classList.remove('active-webview')
        removeMainWebviewEventListeners(el);
    });
    webview.classList.add('active-webview');
    addMainWebviewEventListeners(webview);

}

function addMainWebviewEventListeners(webview) {
    webview.addEventListener('dom-ready', () => {
        flowCaseMainTabUpdate();
        flowCaseButtonsSectionUpdate();
        flowCaseURLBarUpdate();
        
    });
    webview.addEventListener('page-title-updated', () => {
        flowCaseMainTabUpdate();
    });
    webview.addEventListener('page-favicon-updated', (event) => {
        updateFaveIcon(webview, event);
        flowCaseMainTabUpdate();
    });
    webview.addEventListener('did-navigate', () => {
        flowCaseMainTabUpdate();
        flowCaseURLBarUpdate();
    })
    webview.addEventListener('did-navigate-in-page', () => {
        flowCaseMainTabUpdate();
        flowCaseURLBarUpdate();
    })
}

function removeMainWebviewEventListeners(webview) {
    webview.removeEventListener('page-title-updated', () => {
        flowCaseMainTabUpdate();
    });
    webview.removeEventListener('page-favicon-updated', () => {
        setTimeout(10, flowCaseMainTabUpdate());
    });
    webview.removeEventListener('did-navigate', () => {
        flowCaseMainTabUpdate();
        flowCaseURLBarUpdate();
    })

}

export function removeWebview(webview) {
    if (!webview) {
        return;
    }

    webview.remove();
    const tabId = webview.id.replace('webview-', '');
    const tab = document.getElementById(tabId);

    if (tab) {
        tab.style.animation = 'squeezeTab 0.5s forwards';
        tab.addEventListener('animationend', () => {
            tab.remove();
        }, { once: true });
    }
}

function updateFaveIcon(webview, event) {
     const faviconUrl = event.favicons[0];
    if (faviconUrl) {
        webview.dataset.faviconUrl = faviconUrl;
    } else {
        delete webview.dataset.faviconUrl;
    }
}