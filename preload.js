/**
 * Segurança e Desempenho
*/

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    closeAbout: () => ipcRenderer.send('close-about'),
    setColor: (color) => ipcRenderer.on('set-color', color),
    setFile: (file) => ipcRenderer.on('set-file', file),
    atualizarConteudo: (content) => ipcRenderer.send('update-content', content)
})