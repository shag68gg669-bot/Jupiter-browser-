import { CTRLDown } from '../../checkForKeyPresses.js';
import { tabManager } from '../../tabs.js';
import { flowCaseGenerateTabElement } from './tab.js';

export function flowCaseTabMenuGenerate() {
    const TabMenuContainer = document.getElementById("flow-tab-menu-container");
    
    const FlowTabMenu = document.createElement('div');
    FlowTabMenu.id = 'flow-tab-menu';
    FlowTabMenu.classList.add('flow-tab-menu');
    TabMenuContainer.appendChild(FlowTabMenu);
    FlowTabMenu.classList.add('menu-active');

    segment();
    tabSpaceBounceEffectLogic();

    console.log(tabManager.tabs);
    generateTopOfMenuItems();
    // generateTabs()
    generateBottomOfMenuItems();
    createWebviewCover();
    handleFlowTabMenuToggle();
}

function segment () {
    const FlowTabMenu = document.getElementById('flow-tab-menu');

    const topOfFlowTabMenu = document.createElement('div');
    topOfFlowTabMenu.id = 'top-of-flow-tab-menu';
    topOfFlowTabMenu.classList.add('top-of-flow-tab-menu');
    topOfFlowTabMenu.classList.add('element-of-flow-tab-menu');
    FlowTabMenu.appendChild(topOfFlowTabMenu);

    const TabSpace = document.createElement('div');
    TabSpace.id = 'tab-space';
    TabSpace.classList.add('tab-space');
    FlowTabMenu.appendChild(TabSpace);

    const bottomOfFlowTabMenu = document.createElement('div');
    bottomOfFlowTabMenu.id = 'bottom-of-flow-tab-menu';
    bottomOfFlowTabMenu.classList.add('bottom-of-flow-tab-menu');
    bottomOfFlowTabMenu.classList.add('element-of-flow-tab-menu');
    FlowTabMenu.appendChild(bottomOfFlowTabMenu);
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

function generateTopOfMenuItems() {
    const topOfFlowTabMenu = document.getElementById('top-of-flow-tab-menu');

    const tabCount = document.createElement('div');
    tabCount.id = "tab-count";
    topOfFlowTabMenu.appendChild(tabCount);
    updateTabCount();
}

// function generateTabs() {
//     for (const i of tabManager.getAllTabs()){
//         flowCaseGenerateTabElement(i)
//     }
// }

export function updateTabCount() {
    const tabCount = document.getElementById('tab-count');
    tabCount.innerHTML = ` &#9776; ${tabManager.getTabCount()}`;
}

function generateBottomOfMenuItems() {
    const bottomOfFlowTabMenu = document.getElementById('bottom-of-flow-tab-menu');
    
    const addTabButton = document.createElement('div');
    addTabButton.id = 'add-tab-button';
    addTabButton.classList.add('add-tab-button');
    addTabButton.innerHTML = '<b class="icon">&#43;</b>';
    bottomOfFlowTabMenu.appendChild(addTabButton);

    addTabButton.onclick = () => onClickaddTab()
}

function onClickaddTab () {
    const tabId = tabManager.createTab({
        title: 'New Tab',
        url: new URL('../../internal pages/home/home.html', import.meta.url).href,
        isActive: false
    });

    tabManager.setActiveTab(tabId);
    flowCaseGenerateTabElement(tabManager.getTab(tabId));

    updateTabCount();

}

/// 
function createWebviewCover() {
    const tabMenuContainer = document.getElementById('flow-tab-menu-container');

    const WebviewCover = document.createElement('div');
    WebviewCover.id = 'flow-tab-menu-webview-cover';
    tabMenuContainer.appendChild(WebviewCover);
}

let flowTabMenuActivated = false
let flowTabMenuHovered = false
let mainTabHovered = false

function activateFlowTabMenu() {
    const flowTabMenu = document.getElementById('flow-tab-menu');
    const webviewCover = document.getElementById('flow-tab-menu-webview-cover');
    const tabMenuContainer = document.getElementById('flow-tab-menu-container');
    tabMenuContainer.style.display = 'flex';

    // webviewCover.classList.add('fade-in');
    // webviewCover.classList.remove('fade-out');

    flowTabMenu.classList.remove('menu-inactive');
    flowTabMenu.classList.add('menu-active');
}

function deactivateFlowTabMenu() {
    const flowTabMenu = document.getElementById('flow-tab-menu');
    const webviewCover = document.getElementById('flow-tab-menu-webview-cover');
    flowTabMenu.classList.remove('menu-active');
    flowTabMenu.classList.add('menu-inactive');


    // webviewCover.classList.add('fade-out');
    // webviewCover.classList.remove('fade-in');

    const tabMenuContainer = document.getElementById('flow-tab-menu-container');


    flowTabMenu.onanimationend = () => {
        if(!flowTabMenuActivated)
            tabMenuContainer.style.display = 'none';
    }
}

function handleFlowTabMenuToggle() {
    deactivateFlowTabMenu()
    flowTabMenuActivated = false

    document.getElementById('main-tab').addEventListener('mouseenter', () => {
        mainTabHovered = true;

        if(!flowTabMenuActivated){
            activateFlowTabMenu();
            flowTabMenuActivated = true;
        }

    });

    document.getElementById('main-tab').addEventListener('mouseleave', () => {
        mainTabHovered = false;
        
    });

    document.getElementById('flow-tab-menu').addEventListener('mouseenter', () => {
        flowTabMenuHovered = true;
        
    });

    document.getElementById('flow-tab-menu').addEventListener('mouseleave', () => {
        flowTabMenuHovered = false;
        
    });

    closeFlowTabMenuClickCase()
    toggleTabMenuHotKeyCase()
} 

function closeFlowTabMenuClickCase(){
    document.onclick = () => {

        if(flowTabMenuActivated && !flowTabMenuHovered && !mainTabHovered){
            deactivateFlowTabMenu();
            flowTabMenuActivated = false;
        }
    }
}

function toggleTabMenuHotKeyCase(){
    window.onkeydown = ((e) => {
        if(e.key == 't' && CTRLDown)
        if(flowTabMenuActivated){
            deactivateFlowTabMenu();
            flowTabMenuActivated = false;
        } else {
            activateFlowTabMenu();
            flowTabMenuActivated = true;
        }
    })
}