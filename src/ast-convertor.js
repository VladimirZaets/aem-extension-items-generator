const crypto = require('crypto')
const esprima = require('esprima');
const escodegen = require('escodegen')

class AstConvertor {
    constructor () {
        this.variables = {}
    }

    JStoAST(content) {
        const {map, origin} = collectJSXMap(content)
        const ASTTree = esprima.parseModule(origin)
        this.variables = map
        return ASTTree
    }

    ASTtoJS (AST) {
        let content = escodegen.generate(AST)
        for (const key in this.variables) {
            content = content.replace(`[['${key}']]`, this.variables[key])
        }
        return content
    }
}

const collectJSXMap = (content, map = {}, origin) => {
    if (!origin) {
        origin = content
    }
    const JSXEntryIndex = content.search(/</)
    if (JSXEntryIndex === -1) {
        return {
            map,
            origin
        }
    }

    const JSXLastIndex = (content.substring(JSXEntryIndex, content.length)).search(/>/) + JSXEntryIndex
    const closingTagIndex = content.search(`</${content.substring(JSXEntryIndex + 1, JSXLastIndex + 1)}`)
    if (closingTagIndex === -1) {
        return collectJSXMap(content.substring(JSXLastIndex + 1), map, origin)
    }
    const closingTagEndIndex = (content.substring(closingTagIndex, content.length)).search(/>/) + closingTagIndex
    const JSXTag = content.substring(JSXEntryIndex, closingTagEndIndex + 1)
    const randIndex = crypto.randomUUID()
    const next = collectJSXMap(content.substring(closingTagEndIndex + 1), map, origin)
    next.map[randIndex] = JSXTag
    next.origin = next.origin.replace(JSXTag, `[['${randIndex}']]`)
    return next
}

module.exports = AstConvertor
