import { createAndPopulateFlowTabMenu} from "./populateFlowTabMenu";
import {tabManager} from './tabs.js'
import {webviewBehaviors} from './webviewBehaviors.js'
import {updateTabContentInfo} from './populateFlowTabMenu.js'
const centerLeft = document.getElementById('center-left');
const centerRight = document.getElementById('center-right');
const centerMiddle = document.getElementById('center-middle');

const App = document.getElementById('app');
const MainContent = document.getElementById('main-content');


function generateUIElements(elements) {
    const TabSection = document.createElement('div');
    TabSection.id = 'tab-section';
    TabSection.classList.add('top-bar-segment');
    centerLeft.appendChild(TabSection);


    const buttonsSection = document.createElement('div');
    buttonsSection.id = 'buttons-section';
    buttonsSection.classList.add('top-bar-segment');
    centerLeft.appendChild(buttonsSection);

    const mainTabContainer = document.createElement('div');
    mainTabContainer.id = 'main-tab-container';
    mainTabContainer.classList.add('top-bar-segment');
    TabSection.appendChild(mainTabContainer);

    const mainTab = document.createElement('div');
    mainTab.id = 'main-tab';
    mainTab.classList.add('main-tab');
    mainTabContainer.appendChild(mainTab);

    const mainTabContent = document.createElement('div');
    mainTabContent.classList.add('tab-main-content');
    mainTab.appendChild(mainTabContent);

    createAndPopulateFlowTabMenu();

    updateForwardBackRefreshButtons(buttonsSection);

    // Create the middle items container


    const middleItemsContainer = document.createElement('div');
    middleItemsContainer.id = 'middle-items-container';
    middleItemsContainer.classList.add('top-bar-segment');
    centerMiddle.appendChild(middleItemsContainer);

    const urlBarContainer = document.createElement('div');
    urlBarContainer.id = 'url-bar-container';
    urlBarContainer.classList.add('top-bar-segment');
    middleItemsContainer.appendChild(urlBarContainer);

    const urlBar = document.createElement('input');
    urlBar.id = 'url-bar';
    urlBar.classList.add('url-bar');
    urlBar.type = 'text';
    urlBar.placeholder = 'Enter URL';
    urlBarContainer.appendChild(urlBar);

    // Hide the URL bar when its container is too narrow.
    const updateUrlBarVisibility = () => {
        urlBarContainer.style.display = middleItemsContainer.offsetWidth < 200 ? 'none' : 'flex';
    };

    if ('ResizeObserver' in window) {
        const middleItemsResizeObserver = new ResizeObserver(updateUrlBarVisibility);
        middleItemsResizeObserver.observe(middleItemsContainer);
    } else {
        window.addEventListener('resize', updateUrlBarVisibility);
    }

    updateUrlBarVisibility();

    const urlRelatedButtonsContainer = document.createElement('div');
    urlRelatedButtonsContainer.id = 'url-related-buttons-container';
    urlRelatedButtonsContainer.classList.add('top-bar-segment');
    urlBarContainer.appendChild(urlRelatedButtonsContainer);

    const copyButton = document.createElement('div');
    copyButton.id = 'copy-button';
    copyButton.classList.add('url-bar-related-button');
    copyButton.innerHTML = '<b class="icon url-bar-icon">&#128452;</b>';
    urlRelatedButtonsContainer.appendChild(copyButton);
    copyButton.onclick = () => {
        const urlBar = document.getElementById('url-bar');
        if (urlBar.value.trim() !== '') {
            navigator.clipboard.writeText(urlBar.value);
        }
    };

    const bookmarkButton = document.createElement('div');
    bookmarkButton.id = 'bookmark-button';
    bookmarkButton.classList.add('url-bar-related-button');
    bookmarkButton.innerHTML = '<b class="icon url-bar-icon">&#9734;</b>';
    urlRelatedButtonsContainer.appendChild(bookmarkButton);

    const otherMiddleButtonsContainer = document.createElement('div');
    otherMiddleButtonsContainer.id = 'other-middle-buttons-container';
    otherMiddleButtonsContainer.classList.add('top-bar-segment');
    middleItemsContainer.appendChild(otherMiddleButtonsContainer);
}

// generate or update back, forward, refresh and home buttons
export function updateForwardBackRefreshButtons(buttonsSection) {
    const backButton = document.getElementById('back-button');
    const forwardButton = document.getElementById('forward-button');
    const refreshButton = document.getElementById('refresh-button');
    const webview = document.querySelector(`#webview-${tabManager.activeTabId}`);
    console.log(`webview-${tabManager.activeTabId}`);
    if (!webview) {
        console.error('webview element not found!');
        return;
    }

    if (!backButton) {
        const backButton = document.createElement('div');
        backButton.id = 'back-button';
        backButton.innerHTML = '<b class="icon UI-icon">&#10229;</b>';
        backButton.classList.add('UI-button');
        
        buttonsSection.appendChild(backButton);
    }
    else {
        backButton.className = 'UI-button';
        backButton.classList.add(`backButton-${tabManager.activeTabId}`);
        if (webview.canGoBack()) 
            backButton.classList.add('UI-button-active');

    }

    if (!forwardButton) {
        const forwardButton = document.createElement('div');
        forwardButton.id = 'forward-button';
        forwardButton.innerHTML = '<b class="icon UI-icon">&#10230;</b>';
        forwardButton.classList.add('UI-button');
        buttonsSection.appendChild(forwardButton);
    }
    else {
        forwardButton.className = 'UI-button';
        forwardButton.classList.add(`forwardButton-${tabManager.activeTabId}`);
        if (webview.canGoForward()) {
            forwardButton.classList.add('UI-button-active');
        } else {
            forwardButton.classList.remove('UI-button-active');
        }
    }


    if (!refreshButton) {
        const refreshButton = document.createElement('div');
        refreshButton.id = 'refresh-button';
        refreshButton.innerHTML = '<b class="icon UI-icon">&#8634;</b>';
        refreshButton.classList.add('UI-button');
        refreshButton.classList.add('UI-button-active');
        buttonsSection.appendChild(refreshButton);
    }
    document.getElementById('back-button').onclick = () => {
        const activeWebview = document.querySelector(`#webview-${tabManager.activeTabId}`);
        activeWebview?.goBack();
    };

    document.getElementById('forward-button').onclick = () => {
        const activeWebview = document.querySelector(`#webview-${tabManager.activeTabId}`);
        activeWebview?.goForward();
    };

    document.getElementById('refresh-button').onclick = () => {
        const activeWebview = document.querySelector(`#webview-${tabManager.activeTabId}`);
        activeWebview?.reload();
    };

}

export function updateMainTabAndUrlBar() {
    const Mainwebview = document.querySelector(`#webview-${tabManager.activeTabId}`);
    document.getElementById('url-bar').value = Mainwebview.getURL();
    setTimeout(() => {
    updateTabContentInfo('main-tab');
    }, 10);
}
export function handleUIElements() {
    generateUIElements();
    webviewBehaviors();
}
