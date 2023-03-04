// IMPORT "electron" ...................
const electron = {
  contextBridge , 
  ipcRenderer 
} = require('electron');

// MY/API ......................................
let channels = {};
channels.invoke = (name, attrs, callback) => {
  electron.ipcRenderer.invoke(name, attrs).then((result) => {
      callback(result);
  })
} 

// MY/API ......................................
electron.contextBridge.exposeInMainWorld('myAPI', {
  channels : channels
});
