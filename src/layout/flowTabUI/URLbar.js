import { tabManager } from '../../tabs.js';
const centerLeft = document.getElementById('center-left');
const centerRight = document.getElementById('center-right');
const centerMiddle = document.getElementById('center-middle');

let isBarActive = false

export function flowCaseURLBarGenerate() {
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



    updateResizeVisibility();
    generateURLBarRelatedButtons();
    checkIfTheBarIsActive()
}

function updateResizeVisibility() {
    const urlBarContainer = document.getElementById('url-bar-container');
    const middleItemsContainer = document.getElementById('middle-items-container');

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
}

function generateURLBarRelatedButtons() {
    const urlBarContainer = document.getElementById('url-bar-container');

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

}

/////

export function flowCaseURLBarUpdate() {
    const webview = document.getElementsByClassName('active-webview')[0]
    const urlBar = document.getElementById('url-bar');
    if (!webview) {
        console.error('webview element not found!');
        return;
    }
    urlBar.value = webview.getURL();
}


function checkIfTheBarIsActive() {
    const urlBar = document.getElementById('url-bar');
    const urlBarContainer = document.getElementById('url-bar-container');

    urlBar.addEventListener("focus", () => {
        isBarActive = true
        urlBarContainer.classList.add('url-bar-focus')
    })

    urlBar.addEventListener("blur", () => {
        isBarActive = false
        urlBarContainer.classList.remove('url-bar-focus')
    })

    navigate()
}

function navigate () {
    const urlBar = document.getElementById('url-bar');
    const webview = document.getElementsByClassName('active-webview')[0]

    document.onkeydown = ((e)=>{
        if(e.key == "Enter" && isBarActive){
            try{
                webview.loadURL(urlBar.value)
            }
            catch {
                webview.loadURL('https://youtu.be/QDia3e12czc?si=00v9_tFD_TdplyyJ')
            }
        }
    })
}