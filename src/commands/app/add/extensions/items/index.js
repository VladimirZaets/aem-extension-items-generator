/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const aioLogger = require('@adobe/aio-lib-core-logging')('PLUGINNAME', { provider: 'debug' })
const { Command, Flags, CliUx } = require('@oclif/core');
const fs = require('fs');
const { workflow } = require('../../../../../workflow')
const AstConvertor = require('../../../../../ast-convertor')
const { TEMPLATES_MAP, AREA } = require('../../../../../config')
const { astMerge } = require('../../../../../ast-merge')
class IndexCommand extends Command {
  async run () {
    aioLogger.debug('this is the index command.')
    const astConvertor = new AstConvertor()
    const buttonConfigs = await workflow()
    const configFilePath = `${process.cwd()}/src/aem-cf-console-admin-1/web-src/src/components/ExtensionRegistration.js`
    const configFile = fs.readFileSync(configFilePath).toString()
    let ASTTree = astConvertor.JStoAST(configFile)
    const actionBarButtons = buttonConfigs.filter(item => item.area === AREA.ACTION_BAR)
    const headerMenuButtons = buttonConfigs.filter(item => item.area === AREA.HEADER_MENU)
    if (actionBarButtons.length) {
        ASTTree = await astMerge(ASTTree, TEMPLATES_MAP.ADD_BUTTONS.ACTION_BAR, actionBarButtons)
    }
    if (headerMenuButtons.length) {
        ASTTree = await astMerge(ASTTree, TEMPLATES_MAP.ADD_BUTTONS.HEADER_MENU, headerMenuButtons)
    }
    const resultJSFile = astConvertor.ASTtoJS(ASTTree)
    fs.writeFileSync(configFilePath, resultJSFile)
  }
}


// this is set in package.json, see https://github.com/oclif/oclif/issues/120
// if not set it will get the first (alphabetical) topic's help description
IndexCommand.description = 'Add items to existing extension'
IndexCommand.examples = [
  '$ aio app add extensions items'
]

module.exports = IndexCommand
