'use strict'
// @flow

const {getConfig, Plugin} = require('../waterslide')
const Setup = require('./')
import type {Generator, Installer} from './'

const config = getConfig()
const plugin = new Plugin()

type InstallerFactory = {
    getInstaller: (Operator) => ?Installer
}

class Operator {
    setup: Setup

    constructor(setup: Setup) {
        this.setup = setup
    }

    // FIXME
    getOpt() {
        return this.setup.opt
    }

    getNoOpt() {
        return this.setup.noOpt
    }

    getNoUse() {
        return this.setup.noUse
    }

    getIsUse() {
        return this.setup.isUse
    }

    /**
     * @returns {string}
     */
    getProjectDir() {
        return this.setup.projectDir
    }

    /**
     *
     * @param {number} priority [0..9]
     * @param {string} command
     */
    addCommand(priority: number, command: string) {
        this.setup.command.addCommand(priority, command)
    }


    /**
     *
     * @param {string} directory
     * @param {string} type
     * @param {string} description
     */
    // FIXME
    async setDirectory(directory: string, type: string, description: string) {
        const documentInstaller = await this.getInstaller('document')
        // console.dir(typeof documentInstaller.setDirectory)
        // if (typeof documentInstaller.setDriectory !== 'function') {
        //     throw Error()
        // }

        documentInstaller.setDirectory(directory, description)
        if (type) {
            this.setup.directories[type] = directory
            config.writeLocal('directories', this.setup.directories)
        }
    }

    /**
     *
     * @param {string} name
     */
    getGenerator(name: string) {
        if (!this.setup.generators[name]) {
            const Klass = plugin.requireGenerator(name)
            this.setup.generators[name] = new Klass(this.setup.operator)
        }
        return this.setup.generators[name]
    }

    /**
     *
     * @param {string} name
     * @param {Generator} generator
     */
    replaceGenerator(name: string, generator: Generator) {
        if (this.setup.generators[name]) {
            this.setup.operator.error(`${name} generator is already used.`)
        } else {
            this.setup.generators[name] = generator
        }
    }

    /**
     *
     * @param {string} name
     * @returns {Installer}
     */
    async getInstaller(name: string) {
        if (!this.setup.installers[name]) {
            const klass: InstallerFactory = plugin.requireInstaller(name)
            const installer = await klass.getInstaller(this.setup.operator)
            if (!installer) {
                this.setup.cliUtils.verbose(`${name} installer is ignored.`)

                return {
                    install: () => {}
                }
            }

            this.setup.cliUtils.verbose(`installer: ${name}`, 1)
            this.setup.installers[name] = installer
        }

        return this.setup.installers[name]
    }

    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    isInstalled(name: string) {
        return this.setup.installers[name] !== null
    }

    /**
     *
     * @param {string} name
     */
    setTarget(name: string) {
        this.setup.target = name
        config.writeLocal('target', this.setup.target)
    }

    /**
     *
     * @param {string} name
     */
    addBuilder(name: string) {
        if (this.setup.builders.includes(name)) {
            return
        }
        this.setup.builders.push(name)
        config.writeLocal('builders', this.setup.builders)
    }

    /**
     *
     * @param {string} name
     */
    addTester(name: string, command: string) {
        if (typeof this.setup.testers[name] === 'string') {
            return
        }

        this.setup.testers[name] = command
        config.writeLocal('testers', this.setup.testers)
    }

    /**
     *
     * @param {string} name
     * @returns {Promise<Buffer>}
     */
    readFile(name: string) {
        return this.setup.fsio.readFile(name)
    }

    /**
     *
     * @param {string} name
     * @returns {Buffer}
     */
    readFileSync(name: string) {
        return this.setup.fsio.readFileSync(name)
    }

    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    checkExists(name: string) {
        return this.setup.fsio.checkExists(name)
    }

    /**
     *
     * @param {string} src
     * @param {string|Buffer} content
     * @param {Object} opts
     */
    writeFile(src: string, content: string | Buffer, opts: Object = {}) {
        if ('type' in opts) {
            const opts2 = Object.assign({}, opts)
            delete opts2.type
            this.setup.entries.push({src, type: opts.type, opts})
        } else {
            this.setup.entries.push({src, opts})
        }

        config.writeLocal('entries', this.setup.entries.filter(entry => entry.opts && entry.opts.type).map(entry => {
            const opts2 = Object.assign({}, entry.opts)
            delete opts2.type
            return {src: entry.src, type: entry.opts.type, opts: opts2}
        }))

        return this.setup.fsio.writeFile(src, content, opts).then(isWrote => {
            if (isWrote) {
                this.setup.cliUtils.message(`wrote ${src}`, 1)
            }
        })
    }

    /**
     *
     * @param {function} cb
     */
    postInstall(cb: () => void) {
        this.setup.postInstalls.push(cb)
    }

    /**
     *
     * @param {string} title
     * @param {string} message
     */
    setInfo(title: string, message: string) {
        this.setup.info.push({title, message})
        config.writeLocal('info', this.setup.info)
    }

    /**
     *
     * @param {string} message
     */
    verbose(message: string) {
        this.setup.cliUtils.verbose(message, 1)
    }

    /**
     *
     * @param {string} message
     */
    message(message: string) {
        this.setup.cliUtils.message(message, 1)
    }

    /**
     *
     * @param {string} message
     */
    error(message: string) {
        this.setup.cliUtils.error(message, 1)
    }
}

module.exports = Operator
