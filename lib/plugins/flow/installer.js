'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');

const { utils } = require('../../waterslide');

class FlowInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (utils.checkExistsNpm('flow-bin') || (yield operator.checkExists('.flowconfig'))) {
                return null;
            }
            return new _this(operator);
        })();
    }

    install() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const jsInstaller = yield _this2.operator.getInstaller('js');
            jsInstaller.addDevPackage('flow-bin');
            jsInstaller.addDevPackage('flow-typed');
            jsInstaller.addDevPackage('babel-preset-flow');

            const babelInstaller = yield _this2.operator.getInstaller('babel');
            babelInstaller.addPreset('flow');

            _this2.operator.addTester('flow', './node_modules/.bin/flow');

            // const eslintInstaller = await this.operator.getInstaller('eslint')
            // eslintInstaller.


            const conf = fs.readFileSync(path.join(__dirname, 'flowconfig')).toString();
            yield _this2.operator.writeFile('.flowconfig', conf);
        })();
    }
}

module.exports = FlowInstaller;
//# sourceMappingURL=installer.js.map