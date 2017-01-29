const process = require('process')
const generateName = require('sillyname')

const newProject = require('./new/project')
const setting = require('./setting/index')

const generateProjectDirName = () => {
    return generateName().toLowerCase().replace(' ', '-')
}

if (process.argv.length <= 2) {
    console.error('need args')
    process.exit(1)
}

if (process.argv[2] === 'new') {
    if (process.argv.length > 3) {
        newProject(process.argv[3])
    } else {
        newProject(generateProjectDirName())
    }
}

if (process.argv[2] == 'setting') {
    setting(process.argv.slice(3))
}
