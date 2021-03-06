'use strict'

const fs = require('fs')
const path = require('path')

const {utils} = require('../../waterslide')

class MochaInstaller {
    constructor(operator) {
        this.operator = operator
    }

    static async getInstaller(operator) {
        if (utils.checkExistsNpm('mocha')
            || await operator.checkExists('test/mocha.opts')
            || await operator.checkExists('test/test-helper.js')
            || await operator.checkExists('test/test.js')
        ) {
            return null
        }

        return new this(operator)
    }

    async install() {
        const mochaOptsText = fs.readFileSync(path.join(__dirname, 'mocha.opts'))
        const testJs = fs.readFileSync(path.join(__dirname, 'sample.js'))

        await this.operator.getInstaller('power-assert')

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('mocha')
        jsInstaller.addDevPackage('babel-register')
        this.operator.addTester('mocha', './node_modules/.bin/mocha -c test')

        await this.operator.writeFile('test/mocha.opts', mochaOptsText)
        await this.operator.writeFile('test/test.js', testJs)
    }
}

module.exports = MochaInstaller
