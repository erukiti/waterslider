'use strict'

const process = require('process')
const path = require('path')
const fs = require('fs')

const Operator = require('../generate/operator')
const Plugin = require('../plugin')
const config = require('../config')

const generate = async (cliUtils, argv) => {
    config.startLocal()

    const operator = new Operator(cliUtils)

    const parseOpt = name => {
        if (!argv[name]) {
            return []
        } else if (typeof argv[name] === 'string') {
            return [argv[name]]
        } else {
            return argv[name]
        }
    }

    operator.setOpt(parseOpt('opt'))
    operator.setNoOpt(parseOpt('noOpt'))

    operator.setGenerator(argv.generatorName, argv)

    await operator.install().catch(e => console.dir(e))
}

const generateCommand = cliUtils => {
    return {
        command: 'generate [options] <generatorName> <args...>',
        describe: 'generate file',
        builder: yargs => {
            yargs
                .option('opt', {
                    describe: 'set option',
                    type: 'string'
                })
                .option('no-opt', {
                    describe: 'disable option',
                    type: 'string'
                })
        },
        handler: argv => {
            generate(cliUtils, argv).catch(e => console.dir(e))
        }
    }
}

module.exports = generateCommand
