/**PROCESSO PRINCIPAL DO APLICATIVO */
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron/main')
const path = require('node:path')

let win
function createWindow() {
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
        width: 1010,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}

function aboutWindow() {
    const main = BrowserWindow.getFocusedWindow()
    let about
    if (main) {
        about = new BrowserWindow({
            width: 320,
            height: 160,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }

        })
    }
    about.loadFile('./src/views/sobre.html')

    ipcMain.addListener('close-about', () => {
        console.log("Recebi a mensagem close-about")

        if (about && !about.isDestroyed()) {
            about.close()
        }
    })
}

app.whenReady().then(() => {
    createWindow()


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo',
                accelerator: 'CmdOrCtrl+N',
                click: () => novoArquivo()
            },
            {
                label: 'Abrir',
                accelerator: 'CmdOrCtrl+O',
                click: () => abrirArquivo()
            },
            {
                label: 'Salvar',
                accelerator: 'CmdOrCtrl+S',
                click: () => salvar()
            },
            {
                label: 'Salvar Como',
                accelerator: 'CmdOrCtrl+Shift+S',
                click: () => salvarComo()
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                accelerator: 'Alt+F4',
                click: () => app.quit(

                )
            }

        ]
    },
    {
        label: 'Editar',
        submenu: [
            {
                label: 'Desfazer',
                role: 'undo'
            },
            {
                label: 'Refazer',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recortar',
                role: 'cut'
            },
            {
                label: 'Copiar',
                role: 'copy'
            },
            {
                label: 'Colar',
                role: 'paste'
            },

        ]
    },
    {
        label: 'Zoom',
        submenu: [
            {
                label: 'Aumentar',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir ',
                role: 'zoomOut'
            },
            {
                label: 'Reduzir ',
                role: 'resetZoom'
            },
        ]
    },
    {
        label: 'Cor',
        submenu: [
            {
                label: 'Amarelo',
                click: () => win.webContents.send("set-color", "#e5b567")
            },
            {
                label: 'Azul',
                click: () => win.webContents.send("set-color", "#9cdcfe")
            },
            {
                label: 'Laranja',
                click: () => win.webContents.send("set-color", "#e87d3e")
            },
            {
                label: 'Pink',
                click: () => win.webContents.send("set-color", "#b05279")
            },
            {
                label: 'Roxo',
                click: () => win.webContents.send("set-color", "#9e86c8")
            },
            {
                label: 'Verde',
                click: () => win.webContents.send("set-color", "#b4d273")
            },
            {
                type: 'separator',
                click: () => win.webContents.send("set-color", "#b4d273")
            },
            {
                type: 'separator',
            },
            {
                label: 'Restaurar a cor padrão',
                click: () => win.webContents.send("set-color", "#9cdcfe")
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/saulogomesdocarmo/minidev.git')
            },
            {
                label: 'LinkedIn',
                click: () => shell.openExternal('https://www.linkedin.com/in/saulo-gomes-do-carmo-74156719a/')
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    },
]