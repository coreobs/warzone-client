// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const contextMenu = require('electron-context-menu')
 
contextMenu({
    prepend: (defaultActions, params, browserWindow) => [
        {
            label: 'Search Google for “{selection}”',
            // Only show it when right-clicking text
            visible: params.selectionText.trim().length > 0,
            click: () => {
                shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`);
            }
        }
    ]
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let loadingScreen;
const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(Object.assign({
    /// set the window height / width
    width: 760,
    height: 540,
    /// remove the window frame, so it will rendered without frames
    frame: false,
    /// and set the transparency to true, to remove any kind of background
    transparent: true
  }));
  loadingScreen.setResizable(false);
  loadingScreen.loadURL('file://' + __dirname + '/windows/loading/loading.html');
  loadingScreen.on('closed', () => loadingScreen = null);
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1356,
    height: 968,
    minWidth: 992,
    minHeight: 624,
    icon: __dirname + 'assets/icons/icon.png',
    webPreferences: {
      nodeIntegration: false
    },
    /// set show to false, the window will be visible when to loading screen will be removed
    show: false
  });

  mainWindow.removeMenu()

  // and load the index.html of the app.
  mainWindow.loadURL('https://ozfortress.com/')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
  mainWindow.webContents.on('did-finish-load', () => {
    /// when the content has loaded, hide the loading screen and show the main window
    if (loadingScreen) {
      loadingScreen.close();
    }

    mainWindow.webContents.insertCSS(
      'header {display: none !important;} #navbar.navbar-citadel {border: none !important;} ::-webkit-scrollbar {width: 10px !important;} ::-webkit-scrollbar-track {background: #f1f1f1 !important;} ::-webkit-scrollbar-thumb {background: #888 !important;} ::-webkit-scrollbar-thumb:hover {background: #555 !important;} .col-md-3 {display: none !important;} .col-md-9 {width: 100% !important;} .navbar-right {padding-right: 30px !important;}'
    )

    mainWindow.setTitle('warzone client - alpha')
    mainWindow.show();
  }
)}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createLoadingScreen();
  /// add a little timeout for tutorial purposes, remember to remove this
  setTimeout(() => {
    createWindow();
  }, 35000);
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
