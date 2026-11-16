import { tabManager } from '../../tabs.js';

const centerLeft = document.getElementById('center-left');
const centerRight = document.getElementById('center-right');
const centerMiddle = document.getElementById('center-middle');



export function flowCaseButtonsSectionGenerate() {
    const buttonsSection = document.createElement('div');
    buttonsSection.id = 'buttons-section';
    buttonsSection.classList.add('top-bar-segment');
    centerLeft.appendChild(buttonsSection);

    const backButton = document.createElement('div');
    backButton.id = 'back-button';
    backButton.innerHTML = '<b class="icon UI-icon">&#10229;</b>';
    backButton.classList.add('UI-button');
    buttonsSection.appendChild(backButton);

    const forwardButton = document.createElement('div');
    forwardButton.id = 'forward-button';
    forwardButton.innerHTML = '<b class="icon UI-icon">&#10230;</b>';
    forwardButton.classList.add('UI-button');
    buttonsSection.appendChild(forwardButton);

    const refreshButton = document.createElement('div');
    refreshButton.id = 'refresh-button';
    refreshButton.innerHTML = '<b class="icon UI-icon">&#8634;</b>';
    refreshButton.classList.add('UI-button');
    refreshButton.classList.add('UI-button-active');
    buttonsSection.appendChild(refreshButton);
}

export function flowCaseButtonsSectionUpdate() {

    const webview = document.getElementsByClassName('active-webview')[0]

    const backButton = document.getElementById('back-button');
    const forwardButton = document.getElementById('forward-button');
    const refreshButton = document.getElementById('refresh-button');
    if (!webview) {
        console.error('webview element not found!');
        return;
    }

    backButton.className = 'UI-button';
    backButton.classList.add(`backButton-${tabManager.activeTabId}`);
    if (webview.canGoBack()){
        backButton.classList.add('UI-button-active');
    } else {
        forwardButton.classList.remove('UI-button-active');
    }

    forwardButton.className = 'UI-button';
    forwardButton.classList.add(`forwardButton-${tabManager.activeTabId}`);
    if (webview.canGoForward()) {
        forwardButton.classList.add('UI-button-active');
    } else {
        forwardButton.classList.remove('UI-button-active');
    }
    flowCaseButtonsSectionAddEventListeners();
}

function flowCaseButtonsSectionAddEventListeners() {
    const backButton = document.getElementById('back-button');
    const forwardButton = document.getElementById('forward-button');
    const refreshButton = document.getElementById('refresh-button');

    backButton.addEventListener('click', () => {
        const webview = document.getElementById(`webview-${tabManager.activeTabId}`);
        if (webview && webview.canGoBack()) {
            webview.goBack();
        }
    });

    forwardButton.addEventListener('click', () => {
        const webview = document.getElementById(`webview-${tabManager.activeTabId}`);
        if (webview && webview.canGoForward()) {
            webview.goForward();
        }
    });

    refreshButton.addEventListener('click', () => {
        const webview = document.getElementById(`webview-${tabManager.activeTabId}`);
        if (webview) {
            webview.reload();
        }
    });
}