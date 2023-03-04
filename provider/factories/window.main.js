// electron ...................
const electron = require('devlab-electron');

module.exports = async (setup) => {

    setup = Object.assign({
        devtool: true,
        icon: "",
        width: 800,
        height: 600,
        preload: "",
        frontend: ""
    }, setup);

    const window = new electron.BrowserWindow({
        width: setup.width,
        height: setup.height,
        icon: setup.icon,
        webPreferences: {
            
            preload: setup.preload,

            // is default value after Electron v5
            nodeIntegration: false, 

            // protect against prototype pollution
            contextIsolation: true, 

            // turn off remote
            enableRemoteModule: false, 

        },
    });

    window.loadFile(setup.frontend);

    window.setMenu(null)

    if(setup.devtool){
        window.webContents.openDevTools();
    } 

    return window;
};