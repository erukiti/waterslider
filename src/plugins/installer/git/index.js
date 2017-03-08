'use strict'

const GithubApi = require('github-api')

const { utils, getConfig } = require('../../../waterslider')

class GitGenerator {
    constructor(operator) {
        this.operator = operator
        this.ignoreFiles = ['node_modules/', 'npm-debug.log', 'build/']

        const config = getConfig()
        this.token = config.getGlobal('github_token')

        // if (this.token) {
        //     this.githubRepository = `casual-${operator.getProjectDir()}`
        //     this.github = new GithubApi({token: this.token})
        //     this.githubUser = this.github.getUser()
        //     this.githubUser.getProfile().then(profile => {
        //         this.githubUsername = profile.data.login
        //         this.githubRepositoryUrl = `git+https://github.com/${this.githubUsername}/${this.githubRepository}.git`
        //     })
        // }
    }

    static async getInstaller(operator) {
        const { code, stdout, stderr } = await utils.exec('git status').catch(e => console.dir(e))
        if (stderr.indexOf('fatal: Not a git repository') === -1) {
            return null
        }

        return new this(operator)
    }

    addIgnore(path) {
        this.ignoreFiles.push(path)
    }

    getGithubRepository() {
        return this.githubRepository
    }

    getGithubRepositoryUrl() {
        return this.githubRepositoryUrl
    }

    getGithubUsername() {
        return this.githubUsername
    }

    async install() {
        if (this.githubUser) {
            // FIXME: 制御の流れを考える。たとえばoutputsを全部Promise化
            this.githubUser.createRepo({
                name: this.githubRepository,
                private: true
            }).catch(err => console.dir(err))
        }

        // FIXME: git リポジトリがまだ存在しないことを確認する必要がある
        this.operator.addCommand(9, 'git init')
        this.operator.addCommand(9, 'git add .')
        this.operator.addCommand(9, "git commit -m 'first commited by waterslider. see. http://github.com/erukiti/waterslider/'")

        await this.operator.writeFile('.gitignore', this.ignoreFiles.join('\n'))
    }
}

module.exports = GitGenerator