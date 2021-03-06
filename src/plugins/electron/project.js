'use strict'

const fs = require('fs')
const path = require('path')

class ElectronProject {
    constructor(operator) {
        this.operator = operator
        operator.setTarget('electron')
    }

    async install() {
        await this.operator.setDirectory('src', 'source', 'source code directory')
        await this.operator.setDirectory('src/renderer', null, 'source code directory (Electron Renderer Process)')
        await this.operator.setDirectory('build', 'destination', 'build directory')
        await this.operator.setDirectory('release', null, 'release directory')

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('electron')
        jsInstaller.addDevPackage('electron-packager')
        jsInstaller.addDevPackage('electron-installer-dmg')
        jsInstaller.setMain('build/app.js')
        jsInstaller.setBuildConfig({
            'build': {
                'artifactName': '${productName}_installer.${ext}',
                'mac': {
                    'target': 'dmg',
                    'icon': 'build/app.icns'
                },
                'win': {
                    'target': '7z',
                    'icon': 'build/app.ico'
                }
            }
        })

        const browserGenerator = this.operator.getGenerator('browser')
        await browserGenerator.generate('src/renderer/index.js', {type: 'electron-renderer'})

        const iconGenerator = this.operator.getGenerator('electron-icon')
        await iconGenerator.generate('src/app.png')

        const appJsText = fs.readFileSync(path.join(__dirname, 'sample.app.js'))
        await this.operator.writeFile('src/app.js', appJsText, {type: 'copy'})
        await this.operator.writeFile('src/package.json', `${JSON.stringify({'main': './app.js'}, null, '  ')}\n`, {type: 'copy'})

        const gitInstaller = await this.operator.getInstaller('git')
        gitInstaller.addIgnore('release/')
    }
}

module.exports = ElectronProject
