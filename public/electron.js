const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit();
}
if (isDev) {
	require('electron-reload')('./**/*');
}

function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule:true,
			contextIsolation: false,
		},
	});

	win.maximize();
	win.loadURL(
		isDev
			? 'http://localhost:8080'
			: `file://${path.join(__dirname, '../build/index.html')}`,
	);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.

	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
