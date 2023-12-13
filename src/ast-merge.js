const estraverse = require('estraverse')
const ejs = require('ejs')
const path = require('path')
const { TEMPLATE_PACKAGE } = require('./config')
const esprima = require('esprima')
const astMerge = async (AST, rules, data) => {
    let current = AST
    let currentRule = null
    let currentNode = null
    rules = [{node: 'key.name=methods'}, ...rules]

    for (let i = 0; i < rules.length; i++) {
        let isFound = false
        estraverse.replace(current, {
            enter: function (node) {
                const [key, value] = rules[i].node.split('=')
                const conditionFirstOperand = key.split('.').reduce(
                    (accumulator, currentValue) => accumulator && accumulator[currentValue], node
                )
                if (conditionFirstOperand === value) {
                    isFound = true
                    if (i !== rules.length - 1) {
                        current = node
                        currentNode = node
                    } else {
                        currentNode = node
                        currentRule = rules[i]
                        this.break()
                    }
                }
            }
        })

        if (!isFound) {
            if (rules[i].dataAdapter) {
                currentRule = rules[i]
                break
            } else {
                throw new Error(`node ${rules[i].node} not found`)
            }
        }
    }

    const adaptedData = currentRule.dataAdapter(data)
    const parsedTemplate = await renderedTemplate(currentRule.template, adaptedData, parseTemplate)
    const templateAST = parsedTemplate.structure.split('.').reduce(
        (accumulator, currentValue) => accumulator && accumulator[currentValue], parsedTemplate.ast
    )
    mergeTrees(currentNode, templateAST)
    return AST
}

const mergeTrees = (current, node) => {
    if (current.type === 'ArrayExpression') {
        current.elements = [...node.elements, ...current.elements]
        return
    }

    if (current.value.type === 'ObjectExpression') {
        current.value.properties = [node, ...current.value.properties]
        return
    }
}

const renderedTemplate = async (tmplPath, value, resultConverter) => {
    const templatePackage = `${TEMPLATE_PACKAGE.NAME}/package.json`
    const tmpl = await ejs.renderFile(`${path.dirname(require.resolve(templatePackage))}/src/templates/_shared/${tmplPath}`, value)
    return resultConverter(tmpl)
}

const parseTemplate = (template, recursionChecker = 0) => {
    const templateWrapperVariations = [
        (template) => ({
            structure: 'body.0.expression', template
        }),
        (template) => ({
            structure: 'body.0.declarations.0.init',
            template: `var tmpl = ${template}`
        }),
        (template) => ({
            structure: 'body.0.declarations.0.init.properties.0',
            template: `var tmpl = {${template}}`
        }),
    ];

    let parsedTemplate = null
    let structure = ''

    if (recursionChecker >= templateWrapperVariations.length) {
        throw new Error(`Can't parse template.`)
    }

    try {
        const wrappedTemplate = templateWrapperVariations[recursionChecker](template)
        parsedTemplate = esprima.parse(wrappedTemplate.template)
        structure = wrappedTemplate.structure
    } catch (e) {
        return parseTemplate(template, ++recursionChecker)
    }

    return {
        ast: parsedTemplate,
        structure: structure
    }
}

module.exports = {
    astMerge
}
