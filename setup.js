const path = require('path');
const fs = require('fs');
const electron = require('devlab-electron');
const logger = require('devlab-electron-logger');
const provider = require('devlab-electron-provider');

// dirs ...................
const dirs = {
  app       : 'costs',
  databases : 'costs/databases',
  exports   : 'costs/exports',
  errors    : 'costs/errors',
};


// options ...................
const options = {
  name     : 'costs',
  debug    : false,
  icon     : "./builder/icons/1024x1024.png",
  width    : 600,
  height   : 800,
  preload  : path.join(__dirname, 'frontend', 'preload.js'),
  frontend : path.join(__dirname, 'frontend', 'index.html'),
};


// start ...................
const start = [

  // provider ...................
  async (app) => {
    await provider.setup({
      attrs       : require('./provider/attrs'),
      factories   : require('./provider/factories'),
    });
  },  

  // electron ...................
  async (app) => {

    const options = await app.options();

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', async () => {

      const window = await provider.factory('window main', {
        icon     : options.icon,
        width    : options.width,
        height   : options.height,
        preload  : options.preload,
        frontend : options.frontend,
        devtool  : options.debug
      });
      app.window(window);

    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.stop();
      }
    });

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', async () => {

      if (electron.BrowserWindow.getAllWindows().length === 0) {

        const window = await provider.factory('window main', {
          icon     : options.icon,
          width    : options.width,
          height   : options.height,
          preload  : options.preload,
          frontend : options.frontend,
          devtool  : options.debug
        });
        app.window(window);

      }
    });

    await provider.set('app', app);

  },
  // electron ...................


  // storage dirs ...................
  async (app) => {

    const home = await app.home();
    const list = {};
    for (let name in dirs) {
      list[name] =  path.join(home, dirs[name])
    }
    for (let i in list) {
        let dir = list[i];
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
    await provider.set('dirs', list);
   
  },

  // storage databases ...................
  async (app) => {

    const Asyncnedb = require('devlab-electron-backend/storage/databases/asyncnedb');
    const dirs = await provider.get('dirs');
    const dir = dirs.databases;
    const names = [
      'groups' ,
      'costs'
    ];
    const databases = {};
    for(const index in names){
        const name = names[index];
        const file = name+'.db';
        databases[name] = new Asyncnedb(dir, file)
    }
    await provider.set('databases', databases);
    
  },

  // storage schema ...................
  async (app) => {
    const schema = require('./backend/storage/schema');
    await provider.set('schema', schema);
  },  

  // storage procedures ...................
  async (app) => {

    const databases = await provider.get('databases');
    const schema    = await provider.get('schema');
    const procedures = require('./backend/storage/procedures');
    const Procedure = require('devlab-electron-backend/storage/procedure');

    const map = {};
    for(const name in procedures){
      const callback = procedures[name];
      map[name] = new Procedure({
        databases : databases,
        schema    : schema,
      }, callback);
    }
    await provider.set('procedures', map);

  },

  // channels ...................
  async (app) => {
    const channels = require('./backend/channels');
    for(const name in channels){
      electron.ipcMain.handle(name, channels[name]);
    }
  },

];
// start ...................


// stop ...................
const stop = [];


// error ...................
const error = async (app, error) => {
  const home = await app.home();
  const dir  = path.join(home, dirs.errors);
  await logger.error(dir, error);
};

module.exports = {
  options : options,
  start   : start,
  stop    : stop,
  error   : error,
};