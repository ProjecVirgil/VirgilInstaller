const { app, BrowserWindow } = require('electron');


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation:false
        }
    });

    win.loadURL(`${app.getAppPath()}\\build\\index.html`); // URL del server React
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    } )
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
} )
app.on('activate', () => {
    if (BrowserWindow.getAllWindows() === 0) {
        createWindow()
    }
} )