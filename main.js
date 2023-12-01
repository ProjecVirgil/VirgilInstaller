const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation:false
        }
    });

    let indexPath;
    indexPath = path.join(app.getAppPath(), 'build', 'index.html');
    win.loadURL(`file://${indexPath}`);


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