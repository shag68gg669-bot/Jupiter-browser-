const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),
    minimize: () => ipcRenderer.send('window-control', 'minimize'),
    maximize: () => ipcRenderer.send('window-control', 'maximize'),
    close: () => ipcRenderer.send('window-control', 'close'),
    onWindowMaximized: (callback) => ipcRenderer.on('window-maximized', callback),
    onWindowUnmaximized: (callback) => ipcRenderer.on('window-unmaximized', callback),
    getFlowTabMenuState: () => ipcRenderer.invoke('get-flow-tab-menu-state'),
    onOpenPopupInTab: (callback) => ipcRenderer.on('open-popup-in-tab', (_event, url) => callback(url)),
    
});