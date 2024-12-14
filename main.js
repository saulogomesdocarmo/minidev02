/**PROCESSO PRINCIPAL DO APLICATIVO */
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron/main')
const path = require('node:path')

// Importação da biblioteca file system (nativa do javascript) para manipular arquivos
const fs = require('fs')

// criação de um objeto com a estrutura básica de um arquivo
let file = {}




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


// Novo Arquivo

function novoArquivo() {
    file = {
        name: "Sem titulo",
        content: "",
        saved: false,
        path: app.getPath('documents') + 'titulo'
    }

    console.log(file)

    win.webContents.send('set-file', file)
}


// Abrir arquivo

// 2 Funções -> abrirAqruivo() LerArquivo(caminho)

async function abrirArquivo() {

    let dialogFile = await dialog.showOpenDialog({
        defaultPath: file.path
    })

    // console.log(dialogFile)

    if (dialogFile.canceled === true) {
        return false

    } else {

        file = {
            name: path.basename(dialogFile.filePaths[0]),
            content: lerArquivos(dialogFile.filePaths[0]),
            saved: true,
            path: dialogFile.filePaths[0],
        }

        console.log(file)
        win.webContents.send('set-file', file)
    }
}

// Ler arquivos

function lerArquivos(filePath) {
    // Usar o trycatch -> sempre que trabalhar com arquivos

    try {
        return fs.readFileSync(filePath, 'utf-8')

    } catch (error) {
        console.log(error)
        return ''
    }
}

// Salvar e Salvar como

// 3 Funções 1 -> Salvar como 2 -> Salvar 3 -> Salvar arquivo

async function salvarComo() {
    let dialogFile = await dialog.showSaveDialog({
        defaultPath: file.path
    })

    if (dialogFile.canceled === true) {
        return false

    } else {
        salvarArquivo(dialogFile.filePath)
    }
}

function salvar() {
    if (file.saved === true) {
        return salvarArquivo(file.path)

    } else {
        return salvarComo()
    }
}


function salvarArquivo(filePath) {
    console.log(file)

    try {
        fs.writeFile(filePath, file.content,
            (error) => {
                file.path = filePath
                file.saved = true
                file.name = path.basename(filePath)

                win.webContents.send('set-file', file)
            }
        )
    } catch (error) {
        console.log(error)
    }
}

ipcMain.on('update-content', (event, value) => {
    file.content = value
})
