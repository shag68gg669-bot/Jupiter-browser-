let openFlowTabMenu = false
let tabSpaceHovered = false
let flowTabMenuHovered = false
let draggedTabId = null

import {tabManager} from './tabs.js'
import { updateForwardBackRefreshButtons, updateMainTabAndUrlBar} from './generateUIElements.js'

function activateFlowTabMenu() {
    const flowTabMenu = document.getElementById('flow-tab-menu');
    
    flowTabMenu.classList.remove('menu-inactive');
    flowTabMenu.classList.add('menu-active');
}

function deactivateFlowTabMenu() {
    const flowTabMenu = document.getElementById('flow-tab-menu');
    
    flowTabMenu.classList.remove('menu-active');
    flowTabMenu.classList.add('menu-inactive');
}

function toggleFlowTabMenu(condition) {
    if (condition) {
        activateFlowTabMenu();
    } else {
        deactivateFlowTabMenu();
    }
}

function updateMenuState() {
    if(!openFlowTabMenu) {
        if(tabSpaceHovered) {
            openFlowTabMenu = true
            toggleFlowTabMenu(openFlowTabMenu);
        }
    }
    else {
        if(!flowTabMenuHovered && !tabSpaceHovered) {
            openFlowTabMenu = false
            //wait a short moment before closing the menu to allow for small mouse movements between the tab space and the menu
            setTimeout(() => {

                toggleFlowTabMenu(openFlowTabMenu);
                
            }, 400);
        }
    }
    
}

export function updateTabContentInfo(tabId) {
    const tab = document.getElementById(tabId);
    if (!tab) return;

    let webview;

    if (tabId === 'main-tab') {
        webview = tabManager.getTabWebview(tabManager.activeTabId);
    }
    else {
        webview = tabManager.getTabWebview(tabId);
    }

    const tabMainContent = tab.querySelector('.tab-main-content');
    if (!tabMainContent) return;

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

    // const iconUrl = webview.dataset.faviconUrl ||
    //     new URL('./internal pages/icons/defaultIcon.png', import.meta.url).href;
    // tabIconSpace.style.backgroundImage = `url("${iconUrl}")`;

    const titleText = webview.getTitle() || 'New Tab';
    tabTitleSpace.innerHTML = `<h >${titleText}</h>`;

    setTimeout(() => {
        const iconUrl = webview.dataset.faviconUrl ||
        new URL('/assets/defaultIcon.jpg.png', import.meta.url).href;
        tabIconSpace.style.backgroundImage = `url("${iconUrl}")`;
    }, 10);
}

function fillTabComponent(tabId) {
    const tab = document.getElementById(tabId);
    const webview = tabManager.getTabWebview(tabId);

    const tabMainContent = document.createElement('div');
    tabMainContent.classList.add('tab-main-content');
    tab.appendChild(tabMainContent);

    const TabCloseButtonContainer = document.createElement('div');
    TabCloseButtonContainer.classList.add('tab-close-button-container');
    tab.appendChild(TabCloseButtonContainer);

    const tabCloseButton = document.createElement('div');
    tabCloseButton.id = `tab-close-button-${tabId}`;
    tabCloseButton.classList.add('tab-close-button');
    TabCloseButtonContainer.appendChild(tabCloseButton);

    tabCloseButton.addEventListener('click', (event) => {
        if (tabManager.getTabCount() === 1) {
            console.warn('Cannot close the last tab.');
            return;
        }
        event.stopPropagation(); // Prevent the click event from propagating to the tab
        const tab = document.getElementById(tabId);
        tab.style.animation = 'squeezeTab 0.5s forwards';
        tab.addEventListener('animationend', () => {
            tab.remove();
        });

        tabManager.closeTab(tabId);
        updateForwardBackRefreshButtons(document.getElementById('buttons-section'));
        updateMainTabAndUrlBar();
        updateTabCount();

    });
}

function addTab(url = new URL('./internal pages/home/home.html', import.meta.url).href) {

    const tabSpaceContent = document.getElementById('tab-space-content');
    const tab = document.createElement('div');
    tab.id = `tab-${tabManager.nextTabNumber}`;
    tab.classList.add('tab');
    tab.classList.add('selectable-tab');
    tab.classList.add('unselected-tab');
    tabSpaceContent.appendChild(tab);

    tabDragLogic(tab.id);

    tabManager.createTab({
        title: 'New Tab',
        url: url, // new URL('./internal pages/log/log.html', import.meta.url).href,
        isActive: false
    });

    if (tabManager.activeTabId === tab.id) {
        tab.classList.add('active-tab');
    }
    fillTabComponent(tab.id);
    tab.addEventListener('click', () => {

        if (tab.id !== tabManager.activeTabId) {
            tabManager.setActiveTab(tab.id);
            // console.log(`Tab ${tabId} clicked. Active tab set to ${tabManager.activeTabId}`);
            updateForwardBackRefreshButtons(document.getElementById('buttons-section'));
            updateMainTabAndUrlBar();
        }
    });

    tabManager.setActiveTab(tab.id);
    const webview = tabManager.getTabWebview(tab.id);
    webview.addEventListener('page-favicon-updated', (event) => {
        const faviconUrl = event.favicons[0] || '';
        if (faviconUrl) {
            webview.dataset.faviconUrl = faviconUrl;
        } else {
            delete webview.dataset.faviconUrl;
        }
    });
    webview.addEventListener('page-title-updated', () => {
    });
    webview.addEventListener('dom-ready', () => {
        updateTabContentInfo(tab.id);
        updateForwardBackRefreshButtons(document.getElementById('buttons-section'));
        updateMainTabAndUrlBar();
    });
    updateTabCount();
}

export function openPopupInNewTab(url) {
    addTab(url);
}

function tabDragLogic(tabId){
    const tab = document.getElementById(tabId);
    const tabSpaceContent = document.getElementById('tab-space-content');
    tab.draggable = true;
    tab.addEventListener('dragstart', (event) => {
        draggedTabId = tab.id;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', tab.id);
        tab.classList.add('tab-dragging');
    });
    tab.addEventListener('dragover', (event) => {
        if (!draggedTabId || draggedTabId === tab.id) return;

        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const bounds = tab.getBoundingClientRect();
        const insertAfter = event.clientY >= bounds.top + bounds.height / 2;
        tab.classList.toggle('tab-drop-before', !insertAfter);
        tab.classList.toggle('tab-drop-after', insertAfter);
    });
    tab.addEventListener('dragleave', () => {
        tab.classList.remove('tab-drop-before', 'tab-drop-after');
    });
    tab.addEventListener('drop', (event) => {
        const draggedId = event.dataTransfer.getData('text/plain') || draggedTabId;
        if (!draggedId || draggedId === tab.id) return;

        event.preventDefault();
        event.stopPropagation();

        const draggedTab = document.getElementById(draggedId);
        if (!draggedTab || draggedTab.parentElement !== tabSpaceContent) return;

        const bounds = tab.getBoundingClientRect();
        const insertAfter = event.clientY >= bounds.top + bounds.height / 2;
        tabSpaceContent.insertBefore(draggedTab, insertAfter ? tab.nextSibling : tab);
        tabManager.moveTab(draggedId, tab.id, insertAfter);
    });
    tab.addEventListener('dragend', () => {
        draggedTabId = null;
        tab.classList.remove('tab-dragging');
        tabSpaceContent.querySelectorAll('.tab-drop-before, .tab-drop-after').forEach((dropTarget) => {
            dropTarget.classList.remove('tab-drop-before', 'tab-drop-after');
        });
    });
}

function listenForActions(){
    const mainTab = document.getElementById('tab-section');


    mainTab.addEventListener('mouseenter', () => {
        tabSpaceHovered = true
        console.log("Tab space hovered:", tabSpaceHovered)
        updateMenuState();
    });

    mainTab.addEventListener('mouseleave', () => {
        tabSpaceHovered = false
        console.log("Tab space hovered:", tabSpaceHovered)
        updateMenuState();
    });

    const flowTabMenu = document.getElementById('flow-tab-menu');

    flowTabMenu.addEventListener('mouseenter', () => {
        flowTabMenuHovered = true
        console.log("Flow tab menu hovered:", flowTabMenuHovered)
        updateMenuState();
    });

    flowTabMenu.addEventListener('mouseleave', () => {
        flowTabMenuHovered = false
        console.log("Flow tab menu hovered:", flowTabMenuHovered)
        updateMenuState();
    });


}
function tabSpaceBounceEffectLogic(){
    const TabSpace = document.getElementById('tab-space');
    const tabSpaceContent = document.createElement('div');
    tabSpaceContent.id = 'tab-space-content';
    TabSpace.appendChild(tabSpaceContent);

    let stretchOffset = 0;
    let stretchResetTimer;
    TabSpace.addEventListener('wheel', (event) => {
        const atTop = TabSpace.scrollTop <= 0;
        const atBottom = TabSpace.scrollTop + TabSpace.clientHeight >= TabSpace.scrollHeight - 1;
        const isOverscrolling = (atTop && event.deltaY < 0) || (atBottom && event.deltaY > 0);

        if (!isOverscrolling) return;

        event.preventDefault();
        stretchOffset = Math.max(-12, Math.min(12, stretchOffset - event.deltaY * 0.18));
        tabSpaceContent.style.setProperty('--stretch-offset', `${stretchOffset}px`);
        tabSpaceContent.style.setProperty('--stretch-origin', stretchOffset > 0 ? 'top' : 'bottom');
        tabSpaceContent.style.setProperty('--stretch-scale', `${1 + Math.abs(stretchOffset) / 480}`);

        clearTimeout(stretchResetTimer);
        stretchResetTimer = setTimeout(() => {
            stretchOffset = 0;
            tabSpaceContent.style.setProperty('--stretch-offset', '0px');
            tabSpaceContent.style.setProperty('--stretch-scale', '1');
        }, 120);
    }, { passive: false });
}

function updateTabCount() {
    const tabCount = document.getElementById('tab-count');
    tabCount.innerHTML = ` &#9776; ${tabManager.getTabCount()}`;
}

export function createAndPopulateFlowTabMenu() {
    const TabSection = document.getElementById("tab-section");

    const FlowTabMenu = document.createElement('div');
    FlowTabMenu.id = 'flow-tab-menu';
    FlowTabMenu.classList.add('flow-tab-menu');
    TabSection.appendChild(FlowTabMenu);
    FlowTabMenu.classList.add('menu-inactive');

    const topOfFlowTabMenu = document.createElement('div');
    topOfFlowTabMenu.id = 'top-of-flow-tab-menu';
    topOfFlowTabMenu.classList.add('top-of-flow-tab-menu');
    topOfFlowTabMenu.classList.add('element-of-flow-tab-menu');
    FlowTabMenu.appendChild(topOfFlowTabMenu);

    const tabCount = document.createElement('div');
    tabCount.id = "tab-count";
    topOfFlowTabMenu.appendChild(tabCount);
    updateTabCount();

    const TabSpace = document.createElement('div');
    TabSpace.id = 'tab-space';
    TabSpace.classList.add('tab-space');
    FlowTabMenu.appendChild(TabSpace);

    tabSpaceBounceEffectLogic();

    const bottomOfFlowTabMenu = document.createElement('div');
    bottomOfFlowTabMenu.id = 'bottom-of-flow-tab-menu';
    bottomOfFlowTabMenu.classList.add('bottom-of-flow-tab-menu');
    bottomOfFlowTabMenu.classList.add('element-of-flow-tab-menu');
    FlowTabMenu.appendChild(bottomOfFlowTabMenu);

    const addTabButton = document.createElement('div');
    addTabButton.id = 'add-tab-button';
    addTabButton.classList.add('add-tab-button');
    addTabButton.innerHTML = '<b class="icon">&#43;</b>';
    bottomOfFlowTabMenu.appendChild(addTabButton);

    addTab();
    addTabButton.addEventListener('click', () => {
        addTab();
    });

    window.electronAPI.onOpenPopupInTab(openPopupInNewTab);

    listenForActions();
}
