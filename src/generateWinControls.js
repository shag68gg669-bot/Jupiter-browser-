const topBar = document.getElementById('top-bar');
const leftSide = document.getElementById('left-side');
const center = document.getElementById('center');
const rightSide = document.getElementById('right-side');

const webview = document.getElementById('webview');
const appBody = document.getElementById('app');
// Example of sending a message to the main process
// window.electronAPI.sendMessage('Hello from the renderer process!');

// Example of receiving a message from the main process
// window.electronAPI.onMessage((message) => {
//   console.log('Received message from main process:', message);
// });

function createWindowControlButtons(buttonConfig) {
    const sideElements = {
        'left-side': leftSide,
        'right-side': rightSide,
    };

    Object.entries(buttonConfig).forEach(([side, buttons]) => {
        const sideContainer = sideElements[side];
        if (!sideContainer || typeof buttons !== 'object') return;

        Object.entries(buttons).forEach(([buttonId, classList]) => {
            const buttonSupport = document.createElement('div');
            buttonSupport.className = 'button-support';
            const button = document.createElement('div');
            button.id = buttonId;

            if (Array.isArray(classList)) {
                button.className = classList.join(' ');
            } else if (typeof classList === 'string') {
                button.className = classList;
            }

            if(window.electronAPI.platform !== 'darwin') {
                if (classList.includes('wincontrols-minimize')) {
                    button.innerHTML = "<b class='icon UI-icon'>&#128469;</b>";
                } 
                else if (classList.includes('wincontrols-maximize')) {
                    button.innerHTML = "<b class='icon UI-icon'>&#10720;</b>";
                }
                else if (classList.includes('wincontrols-close')) {
                    button.innerHTML = "<b class='icon UI-icon'>&#128473;</b>";
                }
            }

            buttonSupport.appendChild(button);
            sideContainer.appendChild(buttonSupport);


        });
    });
}

function updateMaximizeButton(isMaximized) {
    const button = document.querySelector('.wincontrols-maximize');
    if (button && window.electronAPI.platform !== 'darwin') {
        if (isMaximized) {
            button.innerHTML = "<b class='icon UI-icon'>&#x1f5d7;</b>";
            appBody.style.borderRadius = '0px';
        } else {
            button.innerHTML = "<b class='icon UI-icon'>&#10720;</b>";
            appBody.style.borderRadius = '10px';
        }
    }
}

function attachButtonListeners() {
    document.querySelectorAll('.wincontrols-minimize').forEach(button => {
        button.addEventListener('click', () => {
            window.electronAPI.minimize();
        });
    });

    document.querySelectorAll('.wincontrols-maximize').forEach(button => {
        button.addEventListener('click', async () => {
            console.log('Maximize button clicked');
            window.electronAPI.maximize();
            const isMaximized = await window.electronAPI.isWindowMaximized();
            
        });
    });

    document.querySelectorAll('.wincontrols-close').forEach(button => {
        button.addEventListener('click', () => {
            window.electronAPI.close();
        });
    });

    // Listen for window state changes
    window.electronAPI.onWindowMaximized(() => {
        updateMaximizeButton(true);
    });

    window.electronAPI.onWindowUnmaximized(() => {
        updateMaximizeButton(false);
    });
}

export function generateWindowControls() {
    const platform = window.electronAPI.platform;
    const themePath = `/src/themes&configs/default theme/winControlButtons-${platform}.json`;
    const fallbackPath = '/src/themes&configs/default theme/winControlButtons-win32.json';
    console.log(platform);
    fetch(themePath)
        .then(response => {
            if (!response.ok) throw new Error(`Theme file not found: ${themePath}`);
            return response.json();
        })
        .then(createWindowControlButtons)
        .then(attachButtonListeners)
        .catch(() => {
            fetch(fallbackPath)
                .then(response => {
                    if (!response.ok) throw new Error(`Fallback theme file not found: ${fallbackPath}`);
                    return response.json();
                })
                .then(createWindowControlButtons)
                .then(attachButtonListeners)
                .catch(error => {
                    console.error('Error fetching window controls data:', error);
                });
        });


}
