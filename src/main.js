import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import started from 'electron-squirrel-startup';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var isWindowMaximized = false;
let mainWindow;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 100,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  mainWindow.webContents.on('did-attach-webview', (event, webContents) => {
    webContents.setWindowOpenHandler(({ url }) => {
      mainWindow.webContents.send('open-popup-in-tab', url);
      return { action: 'deny' };
    });
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Listen for maximize/unmaximize events
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-unmaximized');
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('window-control', (event, action) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    if (action === 'minimize') {
      focusedWindow.minimize();
    } else if (action === 'maximize') {
      isWindowMaximized = focusedWindow.isMaximized();
      if (focusedWindow.isMaximized()) {
        focusedWindow.unmaximize();
      } else {
        focusedWindow.maximize();
      }
    } else if (action === 'close') {
      focusedWindow.close();
    }
  }
});

//send isWindowMaximized to preload.js
ipcMain.handle('is-window-maximized', () => {
  return BrowserWindow.getFocusedWindow() ? BrowserWindow.getFocusedWindow().isMaximized() : false;
});

var flowTabMenuState = false;

// send flowTabMenuState to preload.js
ipcMain.handle('get-flow-tab-menu-state', () => {
  return flowTabMenuState;
});

ipcMain.handle('toggle-flow-tab-menu', (event) => {
  flowTabMenuState = !flowTabMenuState;
  if (event && event.sender) {
    event.sender.send('flow-tab-menu-state-changed', flowTabMenuState);
  }
  return flowTabMenuState;
});