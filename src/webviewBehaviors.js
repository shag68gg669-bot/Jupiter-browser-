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
        updateMainTabAndUrlBar();

        setInterval(updateTabContentInfo(Mainwebview.id.replace('webview-', '')), 2000);
        setInterval(updateTabContentInfo('main-tab'), 2000);
    });

    Mainwebview.addEventListener('page-title-updated',  () => {
        updateTabContentInfo(Mainwebview.id.replace('webview-', ''));
        updateMainTabAndUrlBar();

        //this is very unelequant and dumb but I don't know a better way of solving the glitches 
        setTimeout(updateTabContentInfo('main-tab'), 100);
        setTimeout(updateTabContentInfo(Mainwebview.id.replace('webview-', '')), 50);
    });

    Mainwebview.addEventListener('page-favicon-updated',  () => {
        updateTabContentInfo(Mainwebview.id.replace('webview-', ''));
        updateMainTabAndUrlBar();

        //this is very unelequant and dumb but I don't know a better way of solving the glitches 
        setTimeout(updateTabContentInfo('main-tab'), 50);
        setTimeout(updateTabContentInfo(Mainwebview.id.replace('webview-', '')), 50);
    });
    
}

