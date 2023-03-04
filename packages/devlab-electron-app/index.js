const electron = require('devlab-electron');

class App {

  constructor(attrs){

    this.attrs = Object.assign({
      options: {
        debug    : true,
        icon     : "",
        width    : 800,
        height   : 600,
        preload  : '',
        frontend : '',
      },
      start   : [],
      stop    : [],
      error   : null,
      window  : null,
    }, attrs);

  }

  async options(){
    return this.attrs.options;
  }

  async window(window){
    if(window){
      this.attrs.window = window;
    };
    return this.attrs.window;
  }
  async home(){
    return electron.app.getPath('home');
  }

  async start(){

    // Handle creating/removing shortcuts 
    // on Windows when installing/uninstalling.
    if (require('electron-squirrel-startup')) {
      const error = new Error('electron-squirrel-startup error!');
      await this.error(error);
      await this.stop();
      return null;
    }

    for(const i in this.attrs.start){
      try {
        await this.attrs.start[i](this);
      } 
      catch (error) {
        await this.error(error);
        await this.stop();
        return null;
      }
    }
  }

  async stop(){
    for(const i in this.attrs.stop){
      try {
        await this.attrs.stop[i](this);
      } 
      catch (error) {
        await this.error(error);
        electron.app.quit();
        return null;
      }
    }
    electron.app.quit();
  }


  async error(error){

    let executed = 0;
    if(this.attrs.error){
      try {
        await this.attrs.error(this, error);
        executed++;
      } 
      catch (error) {}
    }
    if(!executed){
      console.log('-------------------');
      console.log(error);
      console.log('-------------------');
    }

  }

  async on(name, callback){
    electron.app.on(name, callback);
  }

}

module.exports = App;