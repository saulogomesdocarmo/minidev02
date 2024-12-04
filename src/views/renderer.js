/**
 * Processo de Renderização - Front-end
 */

function fechar() {
    api.closeAbout()
}

const area = document.getElementById('txtArea')

area.focus

function atualizarLinhas() {
    const linhasNumeradas = document.getElementById('linhas')

    let linhasNumeradasHTML = ""

    let linha = area.value.split('\n')

    for (let i = 0; i < linha.length; i++) {
        linhasNumeradasHTML += i + 1 + '<br>'
    }
    linhasNumeradas.innerHTML = linhasNumeradasHTML
}

atualizarLinhas()

area.addEventListener('input', () => {
    atualizarLinhas()
})

area.addEventListener('scroll', () => {
    document.getElementById('linhas').scrollTop = area.scrollTop
})

area.addEventListener('keydown', (event) => {

    if (event.key === 'Tab') {

        event.preventDefault()

        const textarea = event.target
        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const ident = '  '

        textarea.valeu = textarea.value.substring(0,
            start) + ident + textarea.value.substring(end)

        textarea.selectionStart = textarea.selectionEnd =
            start + ident
    }
})

api.setColor((event, color) => {
    if (area) {
        area.style.color = color
    }
})