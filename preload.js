/**
 * Segurança e Desempenho
*/

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    closeAbout: () => ipcRenderer.send('close-about'),
    setColor: (color) => ipcRenderer.on('set-color', color)
})