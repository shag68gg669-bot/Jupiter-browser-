import { tabManager } from '../../tabs.js';
const centerLeft = document.getElementById('center-left');
const centerRight = document.getElementById('center-right');
const centerMiddle = document.getElementById('center-middle');


export function flowCaseMainTabGenerate() {
    const TabSection = document.createElement('div');
    TabSection.id = 'tab-section';
    TabSection.classList.add('top-bar-segment');
    centerLeft.appendChild(TabSection);

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

    createTabMenuContainer()
}

export function flowCaseMainTabUpdate() {
    const webview = tabManager.getTabWebview(tabManager.activeTabId);
    const mainTab = document.getElementById('main-tab');
    const tabMainContent = mainTab.querySelector('.tab-main-content');

    if (!tabMainContent) return;

    if (!webview) {
        console.error('webview element not found!');
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

function createTabMenuContainer() {
    const TabSection = document.getElementById("tab-section");

    const TabMenuContainer = document.createElement('div');
    TabMenuContainer.id = 'flow-tab-menu-container';
    TabSection.appendChild(TabMenuContainer);
}
