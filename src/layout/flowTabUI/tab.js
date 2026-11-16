import { tabManager } from '../../tabs.js';
import { updateTabCount } from './tabMenu.js';
import { flowCaseButtonsSectionUpdate } from './buttonSection.js';
import { flowCaseURLBarUpdate } from './URLbar.js';
import { flowCaseMainTabUpdate } from './mainTab.js';

export function flowCaseGenerateTabElement(tab) {
    if (!tab) {
        console.error('Cannot generate tab UI without a tab');
        return;
    }

    if (document.getElementById(tab.id)) {
        return;
    }

    const tabSpaceContent = document.getElementById('tab-space-content');

    const tabElement = document.createElement('div');
    tabElement.classList.add('tab');
    tabElement.id = tab.id;
    tabSpaceContent.appendChild(tabElement);

    updateTabSelectionState(tab.id);
    fillTabElement(tab.id);
    tabClickHandler(tab.id);
}

function fillTabElement(tabId) {
    const tab = document.getElementById(`${tabId}`);

    const tabMainContent = document.createElement('div');
    tabMainContent.classList.add('tab-main-content');
    tabMainContent.id = `tab-main-content-${tabId}`;
    tab.appendChild(tabMainContent);

    const TabCloseButtonContainer = document.createElement('div');
    TabCloseButtonContainer.classList.add('tab-close-button-container');
    tab.appendChild(TabCloseButtonContainer);

    const tabCloseButton = document.createElement('div');
    tabCloseButton.id = `tab-close-button-${tabId}`;
    tabCloseButton.classList.add('tab-close-button');
    TabCloseButtonContainer.appendChild(tabCloseButton);

    tabCloseButtonClickHandler(tabId);
}

export function flowCaseUpdateTabElement(tabId) {
    const tab = document.getElementById(tabId);
    const webview = document.getElementById(`webview-${tabId}`);
    if (!tab || !webview) {
        // console.error(`Missing tab element for tab ${tabId}`);
        return;
    }
    const tabMainContent = tab.querySelector('.tab-main-content');

    if (!tabMainContent) {
        // console.error(`Missing .tab-main-content for tab ${tabId}`);
        return;
    }
    let tabIconSpace = tabMainContent.querySelector('.tab-icon-space');
    if (!tabIconSpace) {
        tabIconSpace = document.createElement('div');
        tabIconSpace.classList.add('tab-icon-space');
        tabMainContent.appendChild(tabIconSpace);
    }


    let tabTitleSpace = tabMainContent.querySelector('.tab-title-space');
    if (!tabTitleSpace) {
        tabTitleSpace = document.createElement('div');
        tabTitleSpace.classList.add('tab-title-space');
        tabMainContent.appendChild(tabTitleSpace);
    }

    const titleText = webview.getTitle() || 'New Tab';
    tabTitleSpace.innerHTML = `<h >${titleText}</h>`;

    setTimeout(() => {
    const iconUrl = webview.dataset.faviconUrl || new URL('../../assets/load.png', import.meta.url).href;
    tabIconSpace.style.backgroundImage = `url("${iconUrl}")`;
    }, 50);
}

function tabCloseButtonClickHandler(tabId) {
    const closeButton = document.getElementById(`tab-close-button-${tabId}`);
    closeButton.onclick = (event) => {
        event.stopPropagation()
        tabManager.closeTab(tabId);
        updateTabCount();
        flowCaseUpdateAllTabs()

        flowCaseMainTabUpdate();
        flowCaseButtonsSectionUpdate();
        flowCaseURLBarUpdate();
    }
}

function tabClickHandler(tabId) {
    const tabElement = document.getElementById(tabId);
    tabElement.onclick = () => {
        tabManager.setActiveTab(tabId);

        document.querySelectorAll('.tab').forEach((el) => {updateTabSelectionState(el.id)});
        flowCaseButtonsSectionUpdate();
        flowCaseMainTabUpdate();
        flowCaseURLBarUpdate();
    }
}

function updateTabSelectionState(tabId) {
    const tabElement = document.getElementById(tabId);
    if (!tabElement) {
        return;
    }

    if (tabManager.activeTabId === tabId) {
        tabElement.classList.add('active-tab');
        tabElement.classList.remove('selectable-tab');
    } else {
        tabElement.classList.remove('active-tab');
        tabElement.classList.add('selectable-tab');
    }
}

export function flowCaseUpdateAllTabs() {
    document.querySelectorAll('.tab').forEach((el) => {
        updateTabSelectionState(el.id)
        // if (!tabManager.getTab(el.id)) {
        //     el.remove();
        // }
    });
}

////////////////////////////