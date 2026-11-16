import {tabManager} from './tabs.js'
import {updateForwardBackRefreshButtons} from './generateUIElements.js'
import {updateMainTabAndUrlBar} from './generateUIElements.js'
import {updateTabContentInfo} from './populateFlowTabMenu.js'
export function webviewBehaviors() {

    mainWebviewBehaviors();
}

export function mainWebviewBehaviors() {
    const Mainwebview = tabManager.getTabWebview(tabManager.activeTabId);
    
    if (!Mainwebview) {
        console.error('webview element not found!');
        return;
    }

    if (Mainwebview.dataset.navigationListenersAttached === 'true') {
        return;
    }
    Mainwebview.dataset.navigationListenersAttached = 'true';

    Mainwebview.addEventListener('dom-ready', () => {
        updateMainTabAndUrlBar();
        setInterval(() => {
            console.log(Mainwebview.getTitle());
        }, 1000);
    });
    
    
    Mainwebview.addEventListener('did-navigate', () => {
        updateForwardBackRefreshButtons(document.getElementById('buttons-section'));
        //updateMainTabAndUrlBar();
    });
        
    Mainwebview.addEventListener('did-navigate-in-page', () => {
        updateForwardBackRefreshButtons(document.getElementById('buttons-section'));
        //updateMainTabAndUrlBar();
    });

    Mainwebview.addEventListener('did-finish-load', () => {
        updateTabContentInfo(Mainwebview.id.replace('webview-', ''));
        updateForwardBackRefreshButtons(document.getElementById('buttons-section'));
        setTimeout(updateTabContentInfo(Mainwebview.id.replace('webview-', '')), 1000);
        setTimeout(updateTabContentInfo('main-tab'), 1000);

    });

    Mainwebview.addEventListener('page-title-updated',  () => {
        updateTabContentInfo(Mainwebview.id.replace('webview-', ''));
        console.log(Mainwebview.getTitle());
        updateTabContentInfo('main-tab');
    });

    Mainwebview.addEventListener('page-favicon-updated',  () => {
        updateTabContentInfo(Mainwebview.id.replace('webview-', ''));
        console.log('favicon updated for tab: ' + Mainwebview.id.replace('webview-', ''));
        updateTabContentInfo('main-tab');
    });
}
export function allWebviewBehaviors(webviewId) {

    const webview = document.getElementById(webviewId);

    webview.addEventListener('page-title-updated',  () => {
        updateTabContentInfo(webview.id.replace('webview-', ''));

    });

    webview.addEventListener('page-favicon-updated',  () => {
        updateTabContentInfo(webview.id.replace('webview-', ''));
    });
}

