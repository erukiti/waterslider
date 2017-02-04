'use strict'

const process = require('process')

class Plugin {
    constructor() {

    }

    requireTarget(name) {
        return require(`./plugins/target/${name}/${name}_target`)
    }

    requireGenerator(name) {
        return require(`./plugins/generator/${name}/${name}_generator`)
    }

    requireFinalizer(name) {
        return require(`./plugins/finalizer/${name}/${name}_finalizer`)
    }

    requireBuilder(name) {
        return require(`./plugins/builder/${name}/${name}_builder`)
    }

    requireLocal(name) {
        return require(`${process.cwd()}/node_modules/${name}`)
    }
}

module.exports = Plugin
