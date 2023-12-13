const inquirer = require('inquirer')
const slugify = require('slugify')
const { AREA } = require('./config')
const promptButtonsArea = () => {
    const choices = []

    choices.push(
        new inquirer.Separator(),
        {
            name: "Add a custom button to Action Bar",
            value: AREA.ACTION_BAR,
        },
        {
            name: "Add a custom button to Header Menu",
            value: AREA.HEADER_MENU,
        },
        new inquirer.Separator(),
        {
            name: "I'm done",
            value: null
        }
    )

    return inquirer
        .prompt({
            type: 'list',
            name: 'execute',
            message: "What would you like to do next?",
            choices,
        })
        .then((answers) => answers.execute)
        .catch((error) => {
            console.log(error)
        })
}

const promptButtonsOptions = async () => {
    const questions = [promptButtonLabel(), promptModal()]
    return inquirer
        .prompt(questions)
        .then((answers) => {
            answers.id = slugify(answers.label, {
                replacement: '-',  // replace spaces with replacement character, defaults to `-`
                remove: undefined, // remove characters that match regex, defaults to `undefined`
                lower: true,       // convert to lower case, defaults to `false`
                strict: true,      // strip special characters except replacement, defaults to `false`
                locale: 'vi',      // language code of the locale to use
                trim: true         // trim leading and trailing replacement chars, defaults to `true`
            })

            return answers
        })
        .catch((error) => {
            console.error(error)
        })
}

const promptButtonLabel = () => {
    return {
        type: 'input',
        name: 'label',
        message: "Please provide label name for the button:",
        validate(answer) {
            if (!answer.length) {
                return 'Required.'
            }

            return true
        },
    }
}

const promptModal = () => {
    return {
        type: 'confirm',
        name: 'needsModal',
        message: "Do you need to show a modal for the button?",
        default: false
    }
}

module.exports = {
    promptButtonsArea,
    promptButtonsOptions
}
