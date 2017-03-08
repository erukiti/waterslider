'use strict'

class BrowserProject {
    constructor(operator) {
        this.operator = operator
        operator.setFinalizer('browser')
    }

    async install() {
        this.operator.getInstaller('js')
        this.operator.getInstaller('browser').generate('src/index.js', {type: 'web'})

        this.operator.setDirectory('src', 'source', 'source code directory')
        this.operator.setDirectory('build', 'destination', 'build directory')
    }
}

module.exports = BrowserProject
